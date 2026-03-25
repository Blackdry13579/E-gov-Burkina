import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:egov_mobile/features/shared/presentation/widgets/admin_bottom_nav.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../../../../core/providers/auth_provider.dart';

class AdminProfilePage extends StatelessWidget {
  const AdminProfilePage({super.key});

  static const routeName = '/admin-profile';

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;
    final adminName = user?.nom ?? 'Administrateur';
    final adminId = user?.id ?? '';
    final adminIdDisplay = adminId.isEmpty
        ? 'ADM-2024-001'
        : (adminId.length >= 10 ? adminId.substring(0, 10) : adminId).toUpperCase();

    // Admin Specific Colors
    const primaryBlue = Color(0xFF1A237E);
    const goldAccent = Color(0xFFD4AF37);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: const EgovMainAppBar(title: 'PROFIL ADMINISTRATEUR'),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 10),
              // AVATAR SECTION
              Stack(
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white,
                      border: Border.all(color: goldAccent, width: 2),
                      boxShadow: [
                        BoxShadow(
                          color: primaryBlue.withOpacity(0.1),
                          blurRadius: 15,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.admin_panel_settings_rounded,
                      size: 56,
                      color: primaryBlue,
                    ),
                  ),
                  Positioned(
                    right: 4,
                    bottom: 4,
                    child: Container(
                      width: 24,
                      height: 24,
                      decoration: const BoxDecoration(
                        color: goldAccent,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.shield_rounded, size: 16, color: Colors.white),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                adminName,
                style: GoogleFonts.outfit(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  color: primaryBlue,
                ),
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: primaryBlue,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  'ACCÈS NIVEAU SUPÉRIEUR',
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.0,
                    color: Colors.white,
                  ),
                ),
              ),
              
              const SizedBox(height: 32),
              
              // INFO SECTION
              _buildSectionHeader("INFORMATIONS DE COMPTE"),
              const SizedBox(height: 12),
              _buildInfoCard(
                items: [
                  _InfoItem(
                    icon: Icons.badge_outlined,
                    label: "ID Administrateur",
                    value: adminIdDisplay,
                  ),
                  _InfoItem(
                    icon: Icons.mail_outline_rounded,
                    label: "Email Professionnel",
                    value: user?.email ?? "admin@egov.gov.bf",
                  ),
                  _InfoItem(
                    icon: Icons.business_center_outlined,
                    label: "Direction",
                    value: "Services Numériques",
                  ),
                ],
              ),
              
              const SizedBox(height: 24),
              
              // SETTINGS SECTION
              _buildSectionHeader("SÉCURITÉ & PROTOCOLE"),
              const SizedBox(height: 12),
              _buildSettingsCard(
                context,
                items: [
                  _SettingsItem(
                    icon: Icons.lock_reset_rounded,
                    label: "Réinitialiser le code PIN",
                    onTap: () {},
                  ),
                  _SettingsItem(
                    icon: Icons.history_rounded,
                    label: "Journal d'activité",
                    onTap: () {},
                  ),
                  _SettingsItem(
                    icon: Icons.support_agent_rounded,
                    label: "Support Technique",
                    onTap: () {},
                  ),
                ],
              ),
              
              const SizedBox(height: 32),
              
              // LOGOUT BUTTON
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: () {
                    context.read<AuthProvider>().logout(context);
                    Navigator.of(context).pushNamedAndRemoveUntil(
                      '/landing',
                      (route) => false,
                    );
                  },
                  icon: const Icon(Icons.logout_rounded),
                  label: Text(
                    "DÉCONNEXION SÉCURISÉE",
                    style: GoogleFonts.outfit(
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.5,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFEE2E2),
                    foregroundColor: const Color(0xFFB91C1C),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const AdminBottomNav(currentIndex: 4),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title,
        style: GoogleFonts.outfit(
          fontSize: 12,
          fontWeight: FontWeight.w900,
          letterSpacing: 0.8,
          color: const Color(0xFF64748B),
        ),
      ),
    );
  }

  Widget _buildInfoCard({required List<_InfoItem> items}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: items.length,
        separatorBuilder: (context, index) => const Divider(height: 1, color: Color(0xFFF1F5F9)),
        itemBuilder: (context, index) => Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(items[index].icon, color: const Color(0xFF1A237E), size: 20),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      items[index].label,
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF94A3B8),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      items[index].value,
                      style: GoogleFonts.outfit(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFF1E293B),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSettingsCard(BuildContext context, {required List<_SettingsItem> items}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: items.map((item) => InkWell(
          onTap: item.onTap,
          borderRadius: BorderRadius.circular(20),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(item.icon, color: const Color(0xFFD4AF37), size: 22),
                const SizedBox(width: 14),
                Expanded(
                  child: Text(
                    item.label,
                    style: GoogleFonts.outfit(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF1E293B),
                    ),
                  ),
                ),
                const Icon(Icons.chevron_right_rounded, color: Color(0xFFCBD5E1)),
              ],
            ),
          ),
        )).toList(),
      ),
    );
  }
}

class _InfoItem {
  final IconData icon;
  final String label;
  final String value;
  _InfoItem({required this.icon, required this.label, required this.value});
}

class _SettingsItem {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  _SettingsItem({required this.icon, required this.label, required this.onTap});
}
