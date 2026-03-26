class DemandeModel {
  static const String enAttente = 'En attente';
  static const String validee = 'Validée';
  static const String rejetee = 'Rejetée';

  final String id;
  final String reference;
  final String citoyenNom;
  final String? citoyenTelephone;
  final String? citoyenEmail;
  final String typeDocument;
  final String? agentNom;
  final String statut;
  final DateTime dateSoumission;
  final String service;
  final String type;
  final String? motifRejet;
  final String? notesAgent;
  final String? documentUrl;
  final List<Map<String, dynamic>> statusHistory;
  final Map<String, dynamic> donnees;
  final List<dynamic> fichiers;
  
  String get documentTypeNom => typeDocument;
  String get dateSoumissionRaw => dateSoumission.toIso8601String();


  DemandeModel({
    required this.id,
    required this.reference,
    required this.citoyenNom,
    this.citoyenTelephone,
    this.citoyenEmail,
    required this.typeDocument,
    this.agentNom,
    required this.statut,
    required this.dateSoumission,
    required this.service,
    required this.type,
    this.motifRejet,
    this.notesAgent,
    this.documentUrl,
    this.statusHistory = const [],
    this.donnees = const {},
    this.fichiers = const [],
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      '_id': id,
      'reference': reference,
      'citoyenId': {
        'nom': citoyenNom.split(' ').last,
        'prenom': citoyenNom.split(' ').first,
        'telephone': citoyenTelephone,
        'email': citoyenEmail,
      },
      'documentTypeId': {
        'nom': typeDocument,
      },
      'agentNom': agentNom,
      'statut': statut,
      'dateSoumission': dateSoumission.toIso8601String(),
      'service': service,
      'type': type,
      'motif': motifRejet,
      'documentPDF': documentUrl != null ? {'url': documentUrl} : null,
      'donnees': donnees,
      'fichiers': fichiers,
      'historique': statusHistory,
    };
  }

  factory DemandeModel.fromMap(Map<String, dynamic> map) {
    // Sécurisation citoyenId (peut être une String ou une Map)
    Map<String, dynamic> citoyen = {};
    if (map['citoyenId'] is Map) {
      citoyen = Map<String, dynamic>.from(map['citoyenId']);
    }

    // Sécurisation documentTypeId (peut être une String ou une Map)
    Map<String, dynamic> typeDoc = {};
    if (map['documentTypeId'] is Map) {
      typeDoc = Map<String, dynamic>.from(map['documentTypeId']);
    } else if (map['type'] is Map) {
       // Fallback pour certains endpoints
       typeDoc = Map<String, dynamic>.from(map['type']);
    }
    
    return DemandeModel(
      id: map['_id'] ?? map['id'] ?? map['reference'] ?? '',
      reference: map['reference'] ?? '',
      citoyenNom: citoyen.isNotEmpty 
          ? '${citoyen['prenom'] ?? ''} ${citoyen['nom'] ?? ''}'.trim()
          : (map['citoyenNom'] ?? 'Citoyen Inconnu'),
      citoyenTelephone: citoyen['telephone'],
      citoyenEmail: citoyen['email'],
      typeDocument: typeDoc['nom'] ?? map['type'] ?? 'Demande',
      agentNom: map['agentNom'],
      statut: map['statut'] ?? 'En attente',
      dateSoumission: DateTime.tryParse(map['dateSoumission'] ?? '') ?? DateTime.now(),
      service: map['service'] ?? 'Général',
      type: typeDoc['nom'] ?? map['type'] ?? 'Demande',
      motifRejet: map['motif'] ?? map['motifRejet'],
      notesAgent: map['notesAgent'],
      documentUrl: map['documentPDF']?['url'],
      statusHistory: (map['historique'] as List?)?.map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{}).toList() ?? [],
      donnees: Map<String, dynamic>.from(map['donnees'] ?? {}),
      fichiers: List<dynamic>.from(map['fichiers'] ?? []),
    );
  }
}
