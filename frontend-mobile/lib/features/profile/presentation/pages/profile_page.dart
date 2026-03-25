import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/models/user_model.dart';
import 'profile_edit_page.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  static const routeName = '/profile';

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;
    final userName = user?.nom ?? 'Citoyen';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const EgovMainAppBar(title: 'MON COMPTE CITOYEN'),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 20, 16, 30),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const SizedBox(height: 10),
                    const _AvatarHeader(),
                    const SizedBox(height: 6),
                    Text(
                      userName,
                      style: GoogleFonts.outfit(
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                        color: AppColors.textDark,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFDCFCE7),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        'COMPTE VÉRIFIÉ',
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.7,
                          color: const Color(0xFF166534),
                        ),
                      ),
                    ),
                    const SizedBox(height: 22),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'INFORMATIONS PERSONNELLES',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.7,
                          color: AppColors.textLight.withOpacity(0.9),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    _InfoCard(user: user),
                    const SizedBox(height: 22),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'SÉCURITÉ & PARAMÈTRES',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.7,
                          color: AppColors.textLight.withOpacity(0.9),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    const _SettingsList(),
                    const SizedBox(height: 22),
                    _LogoutButton(onTap: () {
                      context.read<AuthProvider>().logout(context);
                      Navigator.of(context).pushNamedAndRemoveUntil(
                        '/landing',
                        (route) => false,
                      );
                    }),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        heroTag: 'profile_fab',
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const ProfileEditPage()),
          );
        },
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.white,
        shape: const CircleBorder(),
        child: const Icon(Icons.edit_rounded),
      ),
    );
  }
}


class _AvatarHeader extends StatelessWidget {
  const _AvatarHeader();

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          width: 96,
          height: 96,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            color: AppColors.sectionBg,
          ),
          child: const Icon(
            Icons.person,
            size: 52,
            color: AppColors.textLight,
          ),
        ),
        Positioned(
          right: 4,
          bottom: 4,
          child: Container(
            width: 22,
            height: 22,
            decoration: const BoxDecoration(
              color: Color(0xFF22C55E),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.verified, size: 16, color: AppColors.white),
          ),
        ),
      ],
    );
  }
}


class _InfoCard extends StatelessWidget {
  final UserModel? user;
  const _InfoCard({this.user});

  @override
  Widget build(BuildContext context) {
    // Avoid RangeError when backend returns a short/null id for some users.
    final id = user?.id ?? '';
    final idDisplay = id.isEmpty
        ? 'B00000000'
        : (id.length >= 8 ? id.substring(0, 8) : id).toUpperCase();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        children: [
          _InfoRow(
            icon: Icons.person_outline_rounded,
            label: 'Nom Complet',
            value: user?.nom ?? 'Citoyen',
          ),
          const SizedBox(height: 12),
          _InfoRow(
            icon: Icons.badge_outlined,
            label: 'Numéro CNIB',
            value: idDisplay,
          ),
          const SizedBox(height: 12),
          _InfoRow(
            icon: Icons.phone_outlined,
            label: 'Téléphone',
            value: user?.telephone ?? '+226 -- -- -- --',
          ),
          const SizedBox(height: 12),
          _InfoRow(
            icon: Icons.mail_outline_rounded,
            label: 'E-mail',
            value: user?.email ?? 'non renseigné',
          ),
          const SizedBox(height: 12),
          _InfoRow(
            icon: Icons.location_on_outlined,
            label: 'Adresse',
            value: user?.adresse ?? 'non renseignée',
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            color: AppColors.sectionBg,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppColors.primary, size: 18),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: GoogleFonts.outfit(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textLight,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: GoogleFonts.outfit(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textDark,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _SettingsList extends StatelessWidget {
  const _SettingsList();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        children: [
          _SettingsRow(
            icon: Icons.lock_outline_rounded,
            label: 'Changer le mot de passe',
            onTap: () {},
          ),
          const Divider(height: 1, color: Color(0xFFE5E7EB)),
          _SettingsRow(
            icon: Icons.notifications_active_outlined,
            label: 'Préférences de notification',
            onTap: () {},
          ),
        ],
      ),
    );
  }
}

class _SettingsRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _SettingsRow({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        child: Row(
          children: [
            Icon(icon, color: AppColors.primary, size: 18),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: GoogleFonts.outfit(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textDark,
                ),
              ),
            ),
            const Icon(Icons.chevron_right_rounded,
                color: AppColors.textLight, size: 20),
          ],
        ),
      ),
    );
  }
}

class _LogoutButton extends StatelessWidget {
  final VoidCallback onTap;
  const _LogoutButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(999),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFFFEE2E2),
          borderRadius: BorderRadius.circular(999),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.logout_rounded, color: Color(0xFFB91C1C)),
            const SizedBox(width: 8),
            Text(
              'Déconnexion',
              style: GoogleFonts.outfit(
                fontSize: 13,
                fontWeight: FontWeight.w900,
                color: const Color(0xFFB91C1C),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

