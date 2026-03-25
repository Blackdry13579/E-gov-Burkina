import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import 'package:egov_mobile/core/constants/app_colors.dart';
import 'package:egov_mobile/core/providers/auth_provider.dart';
import 'package:egov_mobile/core/models/user_model.dart';
import 'package:egov_mobile/features/landing/landing_page.dart';
import 'package:egov_mobile/features/agent/domain/models/agent_config.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  static const routeName = '/splash';

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    await Future.delayed(const Duration(milliseconds: 800));
    if (!mounted) return;

    final authProvider = context.read<AuthProvider>();
    try {
      await authProvider.tryAutoLogin();
    } catch (_) {
      // En cas d'erreur inattendue, on repart sur l'écran d'accueil.
      await authProvider.logout();
      if (!mounted) return;
      Navigator.of(context).pushReplacementNamed(LandingPage.routeName);
      return;
    }

    if (!mounted) return;

    if (authProvider.isAuthenticated) {
      final user = authProvider.currentUser;
      if (user == null) {
        Navigator.of(context).pushReplacementNamed(LandingPage.routeName);
        return;
      }

      // Redirection selon le rôle
      if (user.role == 'ADMIN') {
        Navigator.of(context).pushReplacementNamed('/admin-home');
      } else if (user.role.startsWith('AGENT')) {
        AgentRole role = AgentRole.mairie;
        if (user.service?.toLowerCase() == 'justice' || user.role == 'AGENT_JUSTICE') {
          role = AgentRole.justice;
        }
        Navigator.of(context).pushReplacementNamed(
          '/agent-main',
          arguments: {'role': role},
        );
      } else {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    } else {
      Navigator.of(context).pushReplacementNamed(LandingPage.routeName);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Image.asset(
                  'assets/images/embleme.png',
                  fit: BoxFit.contain,
                ),
              ),
            ),
            const SizedBox(height: 18),
            Text(
              'E-Gov Burkina',
              style: GoogleFonts.outfit(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: AppColors.textDark,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Chargement de vos services...',
              style: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.textLight,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

