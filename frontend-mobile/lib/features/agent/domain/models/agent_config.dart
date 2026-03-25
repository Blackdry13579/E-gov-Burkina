import 'package:flutter/material.dart';

enum AgentRole { justice, mairie }

class AgentConfig {
  final String title;
  final Color primaryColor;
  final String logoAsset;
  final String flagAsset;
  final String ministryName;

  const AgentConfig({
    required this.title,
    required this.primaryColor,
    required this.logoAsset,
    required this.flagAsset,
    required this.ministryName,
  });

  static AgentConfig getByRole(AgentRole role) {
    switch (role) {
      case AgentRole.justice:
        return const AgentConfig(
          title: 'Justice',
          primaryColor: Color(0xFF1A237E),
          logoAsset: 'assets/images/embleme.png',
          flagAsset: 'assets/images/embleme.png',
          ministryName: 'Ministère de la Justice',
        );
      case AgentRole.mairie:
        return const AgentConfig(
          title: 'Mairie',
          primaryColor: Color(0xFF1A237E),
          logoAsset: 'assets/images/embleme.png',
          flagAsset: 'assets/images/embleme.png',
          ministryName: 'Mairie de Ouagadougou',
        );
    }
  }
}
