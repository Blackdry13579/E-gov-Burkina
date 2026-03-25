import 'dart:io';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../../../features/shared/domain/models/demande_model.dart';

class DemandeProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<DemandeModel> _demandes = [];
  bool _isLoading = false;
  String? _error;
  bool _usedMock = false;

  List<DemandeModel> get demandes => _demandes;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get usedMock => _usedMock;
  
  void clear() {
    _demandes = [];
    _error = null;
    _usedMock = false;
    notifyListeners();
  }

  // ─── Citoyen : mes demandes ───────────────────────────────────────────────

  Future<void> fetchDemandes({String? token}) async {
    _isLoading = true;
    _error = null;
    _usedMock = false;
    notifyListeners();

    try {
      if (token == null || token.isEmpty || token == 'mock_token_123') {
        throw Exception('no_token');
      }
      final data = await _api.get('/demandes', token: token);
      final list = List<dynamic>.from(data['data'] ?? []);
      _demandes = list.map((e) => DemandeModel.fromMap(e as Map<String, dynamic>)).toList();
    } catch (e) {
      if (e.toString().contains('no_token') || e.toString().contains('connexion') || e.toString().contains('socket')) {
        // Fallback vers les mocks si pas de connexion
        _demandes = _getMockDemandes().map((e) => DemandeModel.fromMap(e as Map<String, dynamic>)).toList();
        _usedMock = true;
      } else {
        _error = e.toString();
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─── Agent : demandes du service ──────────────────────────────────────────

  Future<void> fetchAgentDemandes({String? token}) async {
    _isLoading = true;
    _error = null;
    _usedMock = false;
    notifyListeners();

    try {
      if (token == null || token.isEmpty) throw Exception('no_token');
      final data = await _api.get('/agent/demandes', token: token);
      final list = List<dynamic>.from(data['data'] ?? []);
      _demandes = list.map((e) => DemandeModel.fromMap(e as Map<String, dynamic>)).toList();
    } catch (e) {
      _error = e.toString();
      _demandes = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─── Admin : toutes les demandes ──────────────────────────────────────────

  Future<void> fetchAllDemandes({String? token}) async {
    _isLoading = true;
    _error = null;
    _usedMock = false;
    notifyListeners();

    try {
      if (token == null || token.isEmpty) throw Exception('no_token');
      final data = await _api.get('/admin/demandes', token: token);
      final list = List<dynamic>.from(data['data'] ?? []);
      _demandes = list.map((e) => DemandeModel.fromMap(e as Map<String, dynamic>)).toList();
    } catch (e) {
      _demandes = _getMockDemandes().map((e) => DemandeModel.fromMap(e as Map<String, dynamic>)).toList();
      _usedMock = true;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─── Créer une demande ────────────────────────────────────────────────────
  
  Future<Map<String, dynamic>?> createDemande({
    required String token,
    required String documentTypeId,
    required Map<String, dynamic> donnees,
    Map<String, File>? justificatifs, // Nouveau : Map code_justificatif -> Fichier
    String modeLivraison = 'NUMERIQUE',
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      List<Map<String, dynamic>> fichiersUploades = [];

      // 1. Upload des justificatifs si présents
      if (justificatifs != null && justificatifs.isNotEmpty) {
        for (var entry in justificatifs.entries) {
          final res = await _api.postMultipart(
            '/upload',
            {}, // Pas de champs additionnels pour /upload
            {'file': entry.value},
            token: token,
          );
          
          if (res['success'] == true && res['data'] != null) {
            fichiersUploades.add({
              'code': entry.key,
              'nom': entry.value.path.split('/').last,
              'url': res['data']['url'],
              'publicId': res['data']['publicId'],
              'type': entry.value.path.split('.').last.toUpperCase(),
            });
          }
        }
      }

      // 2. Création de la demande avec les URLs des fichiers
      final data = await _api.post(
        '/demandes',
        {
          'documentTypeId': documentTypeId,
          'donnees': donnees,
          'fichiers': fichiersUploades,
          'modeLivraison': modeLivraison,
        },
        token: token,
      );

      if (data['success'] == true) {
        await fetchDemandes(token: token);
      }
      return data;
    } catch (e) {
      _error = e.toString();
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─── Agent : Actions sur les demandes ─────────────────────────────────────

  Future<bool> validerDemandeAgent(String id, String token) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final res = await _api.put('/agent/demandes/$id/valider', {}, token: token);
      if (res['success'] == true) {
        // Optimisation : mettre à jour l'élément en local au lieu de tout recharger
        final index = _demandes.indexWhere((d) => d.id == id);
        if (index != -1) {
          final old = _demandes[index];
          _demandes[index] = DemandeModel(
            id: old.id,
            reference: old.reference,
            citoyenNom: old.citoyenNom,
            citoyenEmail: old.citoyenEmail,
            citoyenTelephone: old.citoyenTelephone,
            service: old.service,
            type: old.type,
            typeDocument: old.typeDocument,
            statut: 'Validée',
            dateSoumission: old.dateSoumission,
            fichiers: old.fichiers,
            donnees: old.donnees,
            statusHistory: [
              ...old.statusHistory,
              {
                'action': 'VALIDATION',
                'date': DateTime.now().toIso8601String(),
                'commentaire': 'Dossier validé par l\'agent',
              }
            ],
          );
        }
        notifyListeners();
        return true;
      }
      _error = res['message'] ?? 'Erreur lors de la validation';
      return false;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> rejeterDemandeAgent(String id, String token, String motif) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final res = await _api.put(
        '/agent/demandes/$id/rejeter',
        {'motif': motif},
        token: token,
      );
      if (res['success'] == true) {
        // Optimisation : mettre à jour l'élément en local au lieu de tout recharger
        final index = _demandes.indexWhere((d) => d.id == id);
        if (index != -1) {
          final old = _demandes[index];
          _demandes[index] = DemandeModel(
            id: old.id,
            reference: old.reference,
            citoyenNom: old.citoyenNom,
            citoyenEmail: old.citoyenEmail,
            citoyenTelephone: old.citoyenTelephone,
            service: old.service,
            type: old.type,
            typeDocument: old.typeDocument,
            statut: 'Rejetée',
            dateSoumission: old.dateSoumission,
            fichiers: old.fichiers,
            donnees: old.donnees,
            motifRejet: motif,
            statusHistory: [
              ...old.statusHistory,
              {
                'action': 'REJET',
                'date': DateTime.now().toIso8601String(),
                'commentaire': motif,
              }
            ],
          );
        }
        notifyListeners();
        return true;
      }
      _error = res['message'] ?? 'Erreur lors du rejet';
      return false;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─── Mock fallback ────────────────────────────────────────────────────────

  List<dynamic> _getMockDemandes() {
    return [
      {
        'id': '1',
        'reference': 'CDB-2026-001234',
        'documentTypeId': {'nom': "Extrait d'acte de naissance"},
        'statut': 'VALIDEE',
        'dateSoumission': '2026-03-12T10:00:00Z',
        'citoyenId': {'nom': 'Ouédraogo', 'prenom': 'Jean-Baptiste'},
        'service': 'Mairie Centrale',
        'type': "Extrait d'acte de naissance",
      },
      {
        'id': '2',
        'reference': 'CDB-2026-005678',
        'documentTypeId': {'nom': 'Certificat de Nationalité'},
        'statut': 'EN_ATTENTE',
        'dateSoumission': '2026-03-18T14:30:00Z',
        'citoyenId': {'nom': 'Koulibaly', 'prenom': 'Awa'},
        'service': 'Justice',
        'type': 'Certificat de Nationalité',
      },
      {
        'id': '3',
        'reference': 'CDB-2026-009901',
        'documentTypeId': {'nom': 'Casier Judiciaire'},
        'statut': 'REJETEE',
        'dateSoumission': '2026-03-15T09:15:00Z',
        'citoyenId': {'nom': 'Sanou', 'prenom': 'Ibrahim'},
        'service': 'Justice',
        'type': 'Casier Judiciaire',
        'motif': 'Casier non vierge',
      },
    ];
  }
}
