import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import '../models/notification_model.dart';

class NotificationProvider extends ChangeNotifier {
  final ApiService _api = ApiService();
  
  List<NotificationModel> _notifications = [];
  bool _isLoading = false;
  String? _error;
  int _unreadCount = 0;

  List<NotificationModel> get notifications => _notifications;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get unreadCount => _unreadCount;
  
  void clear() {
    _notifications = [];
    _unreadCount = 0;
    _error = null;
    notifyListeners();
  }

  Future<void> fetchNotifications(String? token) async {
    if (token == null) return;
    
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.get('/notifications', token: token);
      final List<dynamic> data = response['data'];
      _notifications = data.map((json) => NotificationModel.fromJson(json)).toList();
      _unreadCount = _notifications.where((n) => !n.lue).length;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> markAsRead(String notificationId, String? token) async {
    if (token == null) return;

    try {
      await _api.put('/notifications/$notificationId/read', {}, token: token);
      final index = _notifications.indexWhere((n) => n.id == notificationId);
      if (index != -1) {
        _notifications[index] = NotificationModel(
          id: _notifications[index].id,
          userId: _notifications[index].userId,
          demandeId: _notifications[index].demandeId,
          type: _notifications[index].type,
          titre: _notifications[index].titre,
          message: _notifications[index].message,
          lue: true,
          createdAt: _notifications[index].createdAt,
          reference: _notifications[index].reference,
          statut: _notifications[index].statut,
        );
        _unreadCount = _notifications.where((n) => !n.lue).length;
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error marking notification as read: $e');
    }
  }

  Future<void> markAllAsRead(String? token) async {
    if (token == null) return;

    try {
      await _api.put('/notifications/read-all', {}, token: token);
      _notifications = _notifications.map((n) => NotificationModel(
        id: n.id,
        userId: n.userId,
        demandeId: n.demandeId,
        type: n.type,
        titre: n.titre,
        message: n.message,
        lue: true,
        createdAt: n.createdAt,
        reference: n.reference,
        statut: n.statut,
      )).toList();
      _unreadCount = 0;
      notifyListeners();
    } catch (e) {
      debugPrint('Error marking all notifications as read: $e');
    }
  }
}
