import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/constants/app_colors.dart';

class AgentProfilePage extends StatelessWidget {
  const AgentProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final agent = authProvider.agent;
    final agentName = agent?.fullName ?? 'Agent';
    final agentService = agent?.service ?? 'Service Non Spécifié';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const EgovMainAppBar(title: 'MON PROFIL'),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              color: Colors.white,
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 40),
              child: Column(
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.primary.withOpacity(0.1),
                      border: Border.all(color: AppColors.primary.withOpacity(0.2), width: 3),
                    ),
                    child: const Icon(Icons.person_rounded, size: 50, color: AppColors.primary),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    agentName,
                    style: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.textDark),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    agentService,
                    style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.primary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            _buildSettingsItem(Icons.badge_outlined, "Identifiant Agent", agent?.id ?? "N/A", AppColors.primary, AppColors.textDark, AppColors.textLight, AppColors.background),
            _buildSettingsItem(Icons.shield_outlined, "Signature Numérique", "Certifiée et valide", AppColors.primary, AppColors.textDark, AppColors.textLight, AppColors.background),
            const SizedBox(height: 40),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton.icon(
                  onPressed: () {
                    authProvider.logout(context);
                    Navigator.pushNamedAndRemoveUntil(context, '/agent-auth', (route) => false);
                  },
                  icon: const Icon(Icons.logout_rounded, color: Colors.red),
                  label: Text("Déconnexion", style: GoogleFonts.publicSans(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 16)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.red, width: 1.5),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsItem(IconData icon, String title, String subtitle, Color color, Color textPrimary, Color textSecondary, Color iconBg) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.divider),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(color: iconBg, shape: BoxShape.circle),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary)),
                const SizedBox(height: 2),
                Text(subtitle, style: GoogleFonts.inter(color: textSecondary, fontSize: 12, fontWeight: FontWeight.w500)),
              ],
            ),
          ),
          const Icon(Icons.chevron_right_rounded, color: Color(0xFF94a3b8)),
        ],
      ),
    );
  }
}
