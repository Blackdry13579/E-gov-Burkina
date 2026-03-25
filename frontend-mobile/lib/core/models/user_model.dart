class UserModel {
  final String id;
  final String nom;
  final String prenom;
  final String email;
  final String? telephone;
  final String role;
  final String? service;
  final String? adresse;
  final String? dateNaissance;
  final String? lieuNaissance;

  const UserModel({
    required this.id,
    required this.nom,
    required this.prenom,
    required this.email,
    this.telephone,
    required this.role,
    this.service,
    this.adresse,
    this.dateNaissance,
    this.lieuNaissance,
  });

  String get fullName => '$prenom $nom';
  String get initials {
    final p = prenom.isNotEmpty ? prenom[0].toUpperCase() : '';
    final n = nom.isNotEmpty ? nom[0].toUpperCase() : '';
    return '$p$n';
  }

  bool get isAdmin => role == 'ADMIN';
  bool get isAgent =>
      role == 'AGENT_MAIRIE' || role == 'AGENT_JUSTICE' || role == 'SUPERVISEUR';
  bool get isCitoyen => role == 'CITOYEN';

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? json['_id'] ?? '',
      nom: json['nom'] ?? '',
      prenom: json['prenom'] ?? '',
      email: json['email'] ?? '',
      telephone: json['telephone'],
      role: json['role'] ?? 'CITOYEN',
      service: json['service'],
      adresse: json['adresse'],
      dateNaissance: json['dateNaissance'],
      lieuNaissance: json['lieuNaissance'],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'nom': nom,
        'prenom': prenom,
        'email': email,
        'telephone': telephone,
        'role': role,
        'service': service,
        'adresse': adresse,
        'dateNaissance': dateNaissance,
        'lieuNaissance': lieuNaissance,
      };
}
