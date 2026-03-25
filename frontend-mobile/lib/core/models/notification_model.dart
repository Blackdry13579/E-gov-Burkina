class NotificationModel {
  final String id;
  final String userId;
  final String demandeId;
  final String type;
  final String titre;
  final String message;
  final bool lue;
  final DateTime createdAt;
  final String? reference;
  final String? statut;

  NotificationModel({
    required this.id,
    required this.userId,
    required this.demandeId,
    required this.type,
    required this.titre,
    required this.message,
    required this.lue,
    required this.createdAt,
    this.reference,
    this.statut,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    final donnees = json['donnees'] as Map<String, dynamic>? ?? {};
    
    return NotificationModel(
      id: json['_id'] ?? '',
      userId: json['userId'] ?? '',
      demandeId: json['demandeId'] ?? '',
      type: json['type'] ?? '',
      titre: json['titre'] ?? '',
      message: json['message'] ?? '',
      lue: json['lue'] ?? false,
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      reference: donnees['reference'],
      statut: donnees['statut'],
    );
  }
}
