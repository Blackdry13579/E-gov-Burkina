import 'package:egov_mobile/core/services/api_service.dart';
import 'package:flutter/material.dart';

class StatsProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  int _totalDemandes = 0;
  double _tauxTraitement = 0.0;
  int _demandesAujourdhui = 0;
  double _totalCollecte = 0.0;
  
  Map<String, int> _statsParStatut = {};
  Map<String, int> _statsParService = {};

  bool _isLoading = false;
  String? _error;

  void clear() {
    _totalDemandes = 0;
    _tauxTraitement = 0.0;
    _demandesAujourdhui = 0;
    _totalCollecte = 0.0;
    _statsParStatut = {};
    _statsParService = {};
    _error = null;
    notifyListeners();
  }

  // Getters
  int get totalDemandes => _totalDemandes;
  double get tauxTraitement => _tauxTraitement;
  int get demandesAujourdhui => _demandesAujourdhui;
  double get totalCollecte => _totalCollecte;
  Map<String, int> get statsParStatut => _statsParStatut;
  Map<String, int> get statsParService => _statsParService;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Getters for views
  List<Map<String, dynamic>> get activites => []; // Pourrait être peuplé via API plus tard
  Map<String, int> get deliveryTimes => {
    'MAIRIE': 1,
    'POLICE': 3,
    'JUSTICE': 2,
    'SANTÉ': 1,
  };

  Future<void> fetchStatsGlobales(String token) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/admin/stats', token: token);
      if (response['success'] == true) {
        final data = response['data'];
        
        // Extraction par statut
        final List<dynamic> parStatut = data['demandes']['parStatut'] ?? [];
        _statsParStatut = {for (var item in parStatut) item['_id'] as String: item['count'] as int};
        
        _totalDemandes = _statsParStatut.values.fold(0, (sum, count) => sum + count);

        // Extraction par service
        final List<dynamic> parService = data['demandes']['parService'] ?? [];
        _statsParService = {for (var item in parService) item['_id'] as String: item['count'] as int};

        // Autres stats
        _totalCollecte = (data['paiements']['totalCollecte'] as num).toDouble();
        
        // Calcul du taux de traitement (Validées + Rejetées / Total)
        final int traitees = (_statsParStatut['VALIDEE'] ?? 0) + (_statsParStatut['REJETEE'] ?? 0);
        _tauxTraitement = _totalDemandes > 0 ? (traitees / _totalDemandes) * 100 : 0.0;

        // Note: demandesAujourdhui nécessiterait une agrégation spécifique au backend ou filtrage local
        _demandesAujourdhui = _totalDemandes > 0 ? (_totalDemandes / 30).ceil() : 0; // Estimation temporaire
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
