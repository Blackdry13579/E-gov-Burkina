import 'package:flutter/foundation.dart';
import '../services/api_service.dart';

class AgentProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<dynamic> _demandes = [];
  Map<String, dynamic> _stats = {};
  bool _isLoading = false;
  String? _error;

  List<dynamic> get demandes => _demandes;
  Map<String, dynamic> get stats => _stats;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // ─── Charger demandes de l'agent ─────────────────────────────────────────

  Future<void> fetchDemandesAgent(String token) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _api.get('/agent/demandes', token: token);
      _demandes = List<dynamic>.from(data['data'] ?? []);
    } catch (e) {
      _error = e.toString();
      debugPrint('[AgentProvider] fetchDemandesAgent: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─── Statistiques agent ───────────────────────────────────────────────────

  Future<void> fetchStats(String token) async {
    try {
      final data = await _api.get('/agent/stats', token: token);
      _stats = Map<String, dynamic>.from(data['data'] ?? {});
      notifyListeners();
    } catch (e) {
      debugPrint('[AgentProvider] fetchStats: $e');
    }
  }

  // ─── Prendre en charge ────────────────────────────────────────────────────

  Future<bool> prendreEnCharge(String token, String demandeId) async {
    try {
      await _api.put('/agent/demandes/$demandeId/prendre-en-charge', {}, token: token);
      await fetchDemandesAgent(token);
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // ─── Valider une demande ──────────────────────────────────────────────────

  Future<bool> validerDemande(String token, String demandeId, {String? notes}) async {
    try {
      await _api.put(
        '/agent/demandes/$demandeId/valider',
        {'notes': notes ?? ''},
        token: token,
      );
      await fetchDemandesAgent(token);
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // ─── Rejeter une demande ──────────────────────────────────────────────────

  Future<bool> rejeterDemande(String token, String demandeId, {String? motif}) async {
    try {
      await _api.put(
        '/agent/demandes/$demandeId/rejeter',
        {'motif': motif ?? 'Dossier incomplet'},
        token: token,
      );
      await fetchDemandesAgent(token);
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // ─── Demander un complément ───────────────────────────────────────────────

  Future<bool> demanderComplement(String token, String demandeId, String message) async {
    try {
      await _api.put(
        '/agent/demandes/$demandeId/demander-complement',
        {'message': message},
        token: token,
      );
      await fetchDemandesAgent(token);
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }
}
