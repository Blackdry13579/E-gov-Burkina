import 'package:egov_mobile/core/models/user_model.dart';
import 'agent_config.dart';

class AgentModel {
  final String id;
  final String nom;
  final String prenom;
  final String service;
  final AgentRole role;
  final String? email;
  final String? telephone;

  AgentModel({
    required this.id,
    required this.nom,
    required this.prenom,
    required this.service,
    required this.role,
    this.email,
    this.telephone,
  });

  UserModel toUserModel() => UserModel(
    id: id,
    nom: nom,
    prenom: prenom,
    email: email ?? "agent@egov.bf",
    telephone: telephone ?? "70000000",
    role: role == AgentRole.justice ? 'AGENT_JUSTICE' : 'AGENT_MAIRIE',
    service: service,
    adresse: "Ouagadougou, BF",
  );
}
