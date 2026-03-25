import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../../features/catalogue/domain/models/document_model.dart';

class DocumentProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  List<DocumentModel> _documents = [];
  bool _isLoading = false;
  String? _error;

  List<DocumentModel> get documents => _documents;
  bool get isLoading => _isLoading;
  String? get error => _error;

  List<DocumentModel> get activeDocuments =>
      _documents.where((d) => d.isActive).toList();

  List<DocumentModel> get allDocuments => _documents;

  Future<void> loadDocuments(String token) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/documents', token: token);
      if (response['success'] == true) {
        final List data = response['data'] ?? [];
        _documents = data.map((d) => DocumentModel.fromJson(d)).toList();
      } else {
        _error = 'Erreur de chargement';
        if (_documents.isEmpty) _documents = _getMockDocuments();
      }
    } catch (e) {
      _error = e.toString();
      if (_documents.isEmpty) _documents = _getMockDocuments();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> toggleDocument({
    required String documentId,
    required bool newValue,
    required String token,
  }) async {
    final index = _documents.indexWhere((d) => d.id == documentId);
    if (index == -1) return;

    // Mise à jour immédiate et locale
    _documents[index] = _documents[index].copyWith(isActive: newValue);
    notifyListeners();

    if (token.isEmpty || documentId.length < 5) return;

    try {
      await _apiService.patch('/documents/$documentId/toggle', {'isActive': newValue}, token: token);
    } catch (e) {
      debugPrint('Erreur toggle document: $e');
    }
  }

  Future<bool> updateDocument({
    required String documentId,
    required Map<String, dynamic> data,
    required String token,
  }) async {
    try {
      final response = await _apiService.put('/documents/$documentId', data, token: token);
      if (response['success'] == true) {
        final index = _documents.indexWhere((d) => d.id == documentId);
        if (index != -1) {
          final updated = DocumentModel.fromJson(response['data']);
          _documents[index] = updated;
          notifyListeners();
        }
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  Future<bool> deleteDocument({
    required String documentId,
    required String token,
  }) async {
    try {
      final response = await _apiService.delete('/documents/$documentId', token: token);
      if (response['success'] == true) {
        _documents.removeWhere((d) => d.id == documentId);
        notifyListeners();
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  List<DocumentModel> _getMockDocuments() {
    return [
      const DocumentModel(
        id: '1',
        title: 'Extrait d\'Acte de Naissance',
        description: 'Copie intégrale ou extrait simple',
        code: 'NAISS_EX',
        price: '300 FCFA',
        delay: 'Instantané',
        delivery: 'Mobile',
        status: 'INSTANTANÉ',
        icon: Icons.history_edu_outlined,
        iconName: 'history_edu',
        service: 'mairie',
        isActive: true,
        category: 'État Civil',
        requiredDocs: [
          'Ancien Extrait de Naissance (Scan)'
        ],
      ),
      const DocumentModel(
        id: '2',
        title: 'Casier Judiciaire',
        description: 'Bulletin N°3 administratif',
        code: 'CAS_JUD',
        price: '750 FCFA',
        delay: '48h',
        delivery: 'Email / Retrait',
        status: '48H DÉLAI',
        icon: Icons.gavel_outlined,
        iconName: 'gavel',
        service: 'justice',
        isActive: true,
        category: 'Justice',
        requiredDocs: [
          'Extrait de Naissance (Scan)',
          'CNIB (Scan Recto/Verso)'
        ],
      ),
      const DocumentModel(
        id: '3',
        title: 'Certificat de Nationalité',
        description: 'Document attestant de la nationalité burkinabè',
        code: 'NATIONALITE',
        price: '500 FCFA',
        delay: '5 jours',
        delivery: 'Retrait Tribunal',
        status: 'DISPONIBLE',
        icon: Icons.flag_rounded,
        iconName: 'flag',
        service: 'justice',
        isActive: true,
        category: 'Justice',
        requiredDocs: [
          'Extrait de naissance (Père ou Mère)',
          'Extrait de naissance (Demandeur)'
        ],
      ),
    ];
  }
}
