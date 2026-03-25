import 'package:egov_mobile/core/services/api_service.dart';
import 'package:egov_mobile/core/models/user_model.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart' show Icons, Color, Colors;
import 'package:egov_mobile/features/admin/presentation/pages/agent_model.dart';
import 'package:egov_mobile/features/admin/presentation/pages/citizen_model.dart';
import 'package:egov_mobile/features/admin/presentation/pages/service_model.dart';

class UserManagementProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<AgentData> _agents = [];
  List<CitizenData> _citizens = [];
  bool _isLoading = false;
  String? _error;

  void clear() {
    _agents = [];
    _citizens = [];
    _error = null;
    notifyListeners();
  }

  final List<ServiceData> _services = [
    const ServiceData(
      id: '1',
      name: 'MAIRIE',
      description: 'Actes de naissance, mariage, décès et documents civils.',
      icon: Icons.account_balance_rounded,
      color: Color(0xFF1A237E),
      isActive: true,
    ),
    const ServiceData(
      id: '2',
      name: 'JUSTICE',
      description: 'Casier judiciaire, certificats de nationalité.',
      icon: Icons.gavel_rounded,
      color: Color(0xFFB91C1C),
      isActive: true,
    ),
    const ServiceData(
      id: '3',
      name: 'POLICE',
      description: 'CNIB, Passeports, certificats de résidence.',
      icon: Icons.shield_rounded,
      color: Color(0xFF1E40AF),
      isActive: true,
    ),
    const ServiceData(
      id: '4',
      name: 'SANTÉ',
      description: 'Carnets de santé, certificats médicaux.',
      icon: Icons.local_hospital_rounded,
      color: Color(0xFF059669),
      isActive: false,
    ),
  ];

  // Getters
  List<AgentData> get agents => _agents;
  List<CitizenData> get citizens => _citizens;
  List<ServiceData> get services => _services;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // --- API CALLS ---

  Future<void> fetchUsers(String token) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/admin/users', token: token);
      if (response['success'] == true) {
        final List<dynamic> usersJson = response['data'] ?? [];
        final List<UserModel> users = usersJson.map((u) => UserModel.fromJson(u)).toList();

        // Séparer et Mapper vers les modèles UI
        _citizens = users
            .where((u) => u.role == 'CITOYEN')
            .map((u) => _mapToCitizenData(u))
            .toList();

        _agents = users
            .where((u) => u.role.startsWith('AGENT_') || u.role == 'SUPERVISEUR' || u.role == 'ADMIN')
            .map((u) => _mapToAgentData(u))
            .toList();
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> toggleUserStatus(String id, String token) async {
    try {
      final response = await _apiService.put('/admin/users/$id/toggle', {}, token: token);
      if (response['success'] == true) {
        await fetchUsers(token);
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      rethrow;
    }
  }

  // Aliases for compatibility
  Future<void> toggleAgentStatus(String id, String token) => toggleUserStatus(id, token);
  Future<void> updateCitizenStatus(String id, String token) => toggleUserStatus(id, token);

  Future<void> addService(Map<String, dynamic> serviceData, String token) async {
     // TODO: Implement API call for adding service if backend supports it
     notifyListeners();
  }

  Future<void> createUser(Map<String, dynamic> userData, String token) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _apiService.post('/admin/users', userData, token: token);
      if (response['success'] == true) {
        await fetchUsers(token);
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      rethrow;
    } finally {
      _isLoading = false;
    }
  }

  // --- MAPPING HELPERS ---

  CitizenData _mapToCitizenData(UserModel u) {
    final id = u.id;
    final safeId = id.length >= 8 ? id.substring(0, 8) : id;
    final cnib = safeId.isEmpty ? '00000000' : safeId.toUpperCase();
    return CitizenData(
      id: u.id,
      name: u.fullName,
      cnib: 'B$cnib', // CNIB simulée si manquante
      email: u.email,
      phone: u.telephone ?? 'N/A',
      address: u.adresse ?? 'N/A',
      city: 'Burkina Faso',
      birthDate: u.dateNaissance ?? 'N/A',
      status: 'VALIDE', // Backend simpler for now
      registrationDate: 'Récemment',
    );
  }

  AgentData _mapToAgentData(UserModel u) {
    final safeId = u.id.length >= 8 ? u.id.substring(0, 8) : u.id;
    final matricule = safeId.isEmpty ? '00000000' : safeId.toUpperCase();
    final bool isMairie = u.service == 'mairie';
    final String initials = u.prenom.isNotEmpty ? u.prenom[0] + u.nom[0] : 'AG';
    
    return AgentData(
      id: u.id,
      initials: initials,
      avatarBg: isMairie ? const Color(0xFFe0e7ff) : const Color(0xFFfee2e2),
      avatarFg: isMairie ? const Color(0xFF4338ca) : const Color(0xFF991b1b),
      name: u.fullName,
      matricule: matricule,
      service: u.service?.toUpperCase() ?? 'N/A',
      serviceBg: isMairie ? const Color(0xFF1a237e) : const Color(0xFF991b1b),
      dossiersLabel: 'Dossiers actifs',
      actif: true, // À récupérer de isActive si ajouté au UserModel
      email: u.email,
      phone: u.telephone ?? 'N/A',
      dateAjout: 'Récemment',
      dossiersTraites: 0,
      tauxValidation: 100,
      validees: 0,
      rejetees: 0,
      serviceComplet: u.service == 'mairie' ? 'Mairie de Ouagadougou' : 'Services Judiciaires',
    );
  }

  // --- ACTIONS SERVICES (Local for now) ---

  void toggleServiceStatus(String id) {
    final index = _services.indexWhere((s) => s.id == id);
    if (index != -1) {
      _services[index] = _services[index].copyWith(isActive: !_services[index].isActive);
      notifyListeners();
    }
  }
}
