import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';
import 'package:flutter/material.dart' show BuildContext, debugPrint;
import 'package:provider/provider.dart';
import 'notification_provider.dart';
import 'demande_provider.dart';
import 'user_management_provider.dart';
import 'stats_provider.dart';

Map<String, dynamic>? _decodeUserJsonMap(String savedUser) {
  try {
    final decoded = jsonDecode(savedUser);
    if (decoded is Map<String, dynamic>) return decoded;
    return null;
  } catch (_) {
    return null;
  }
}

class AuthProvider extends ChangeNotifier {
  static const _tokenKey = 'auth_token';
  static const _userKey = 'auth_user';

  final ApiService _api = ApiService();

  bool _isLoading = false;
  String? _token;
  UserModel? _currentUser;
  String? _error;

  bool get isAuthenticated => _token != null && _currentUser != null;
  bool get isLoading => _isLoading;
  String? get token => _token;
  UserModel? get currentUser => _currentUser;
  String? get error => _error;

  // Compatibilité portail agent (alias)
  UserModel? get user => _currentUser;
  UserModel? get agent => _currentUser;

  // ─── Persistance ──────────────────────────────────────────────────────────

  /// Charger le token et l'utilisateur sauvegardés au démarrage
  Future<void> tryAutoLogin() async {
    final prefs = await SharedPreferences.getInstance();
    final savedToken = prefs.getString(_tokenKey);
    final savedUser = prefs.getString(_userKey);

    if (savedToken == null || savedUser == null) {
      // Etat local nettoyé pour éviter toute incohérence.
      _token = null;
      _currentUser = null;
      return;
    }

    _token = savedToken;
    try {
      // Decode en arrière-plan pour éviter un blocage (gros JSON) sur le main thread.
      final decodedMap = await compute(_decodeUserJsonMap, savedUser);
      if (decodedMap == null) {
        throw const FormatException('Saved user JSON invalide.');
      }
      _currentUser = UserModel.fromJson(decodedMap);
    } catch (_) {
      // Si le JSON est corrompu, on annule l'auto-login et on nettoie le stockage local.
      _token = null;
      _currentUser = null;
      await _clearAuth();
      return;
    }
    
    // On notifie immédiatement pour que SplashPage redirige vers le tableau de bord sans délai
    notifyListeners();

    // Met à jour le profil en arrière-plan (sans bloquer SplashPage).
    // Une erreur réseau ou JSON invalide ne doit pas empêcher la navigation.
    _refreshProfileInBackground();
  }

  Future<void> _refreshProfileInBackground() async {
    try {
      await getMe();
    } catch (e) {
      if (e is ApiUnauthorizedException || e is ApiForbiddenException) {
        // Le token a expiré côté serveur ou compte bloqué
        await logout();
      }
      // Autres erreurs: on laisse la session locale continuer.
    }
  }

  Future<void> _saveAuth(String token, UserModel user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setString(_userKey, jsonEncode(user.toJson()));
  }

  Future<void> _clearAuth() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }

  // ─── Authentification Citoyen ─────────────────────────────────────────────

  Future<void> loginCitoyen(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _api.post('/auth/login', {
        'email': email.trim().toLowerCase(),
        'password': password,
      });

      _token = data['token'];
      _currentUser = UserModel.fromJson(data['user']);
      await _saveAuth(_token!, _currentUser!);
    } on ApiException catch (e) {
      _error = e.message;
      rethrow;
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register({
    required String nom,
    required String prenom,
    required String email,
    required String telephone,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _api.post('/auth/register', {
        'nom': nom.trim(),
        'prenom': prenom.trim(),
        'email': email.trim().toLowerCase(),
        'telephone': telephone.trim(),
        'password': password,
      });

      _token = data['token'];
      _currentUser = UserModel.fromJson(data['user']);
      await _saveAuth(_token!, _currentUser!);
    } on ApiException catch (e) {
      _error = e.message;
      rethrow;
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─── Authentification Admin (2 étapes) ───────────────────────────────────

  Future<void> requestAdminPin(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _api.post('/auth/admin/request-pin', {
        'email': email.trim().toLowerCase(),
        'password': password,
      });
    } on ApiException catch (e) {
      _error = e.message;
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loginAdmin(String email, String password, String pin) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _api.post('/auth/admin/login', {
        'email': email.trim().toLowerCase(),
        'password': password,
        'pin': pin,
      });

      _token = data['token'];
      _currentUser = UserModel.fromJson(data['user']);
      await _saveAuth(_token!, _currentUser!);
    } on ApiException catch (e) {
      _error = e.message;
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─── Agent login (même endpoint que citoyen) ─────────────────────────────

  Future<void> loginAgent(String email, String password) async {
    await loginCitoyen(email, password); // même API, le rôle differencie
  }

  // ─── Profil ──────────────────────────────────────────────────────────────

  Future<void> getMe() async {
    if (_token == null) return;
    try {
      final data = await _api.get('/auth/me', token: _token);
      _currentUser = UserModel.fromJson(data['data']);
      notifyListeners();
    } catch (_) {
      rethrow;
    }
  }

  // ─── Déconnexion ─────────────────────────────────────────────────────────

  Future<void> logout([BuildContext? context]) async {
    _token = null;
    _currentUser = null;
    _error = null;
    await _clearAuth();
    
    // Nettoyage des autres providers si le contexte est fourni
    if (context != null && context.mounted) {
      try {
        context.read<NotificationProvider>().clear();
        context.read<DemandeProvider>().clear();
        context.read<UserManagementProvider>().clear();
        context.read<StatsProvider>().clear();
      } catch (e) {
        debugPrint('Erreur lors du nettoyage multi-provider: $e');
      }
    }
    
    notifyListeners();
  }

  // Compatibilité ancienne interface (mocked)
  void login() => debugPrint('[AuthProvider] Utiliser loginCitoyen() à la place.');
}
