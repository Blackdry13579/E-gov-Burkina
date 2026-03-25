import 'package:flutter/material.dart';

class AgentData {
  final String id; // ID MongoDB
  final String initials;
  final Color  avatarBg;
  final Color  avatarFg;
  final String name;
  final String matricule;
  final String service;
  final Color  serviceBg;
  final String dossiersLabel;
  final bool   actif;
  final String email;
  final String phone;
  final String dateAjout;
  final int    dossiersTraites;
  final int    tauxValidation;
  final int    validees;
  final int    rejetees;
  final String serviceComplet;

  const AgentData({
    required this.id,
    required this.initials,
    required this.avatarBg,
    required this.avatarFg,
    required this.name,
    required this.matricule,
    required this.service,
    required this.serviceBg,
    required this.dossiersLabel,
    required this.actif,
    required this.email,
    required this.phone,
    required this.dateAjout,
    required this.dossiersTraites,
    required this.tauxValidation,
    required this.validees,
    required this.rejetees,
    required this.serviceComplet,
  });
}
