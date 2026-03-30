import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../../core/providers/auth_provider.dart';
import '../pages/admin_home_page.dart';
import '../pages/admin_demandes_page.dart';
import '../pages/admin_users_page.dart';
import '../pages/gestion_services_page.dart';
import '../pages/admin_profile_page.dart';

class AdminDrawer extends StatelessWidget {
  const AdminDrawer({super.key});

  static const _primaryBlue = Color(0xFF1A237E);

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return Drawer(
      backgroundColor: Colors.white,
      child: Column(
        children: [
          UserAccountsDrawerHeader(
            decoration: const BoxDecoration(color: _primaryBlue),
            currentAccountPicture: const CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.shield_rounded, color: _primaryBlue, size: 40),
            ),
            accountName: Text(
              user?.fullName ?? "Administrateur",
              style: GoogleFonts.inter(fontWeight: FontWeight.bold),
            ),
            accountEmail: Text(
              user?.email ?? "admin@egov.bf",
              style: GoogleFonts.inter(fontSize: 12),
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                _buildDrawerItem(
                  context,
                  icon: Icons.dashboard_rounded,
                  title: 'Tableau de bord',
                  onTap: () => Navigator.pushReplacementNamed(context, AdminHomePage.routeName),
                ),
                _buildDrawerItem(
                  context,
                  icon: Icons.description_rounded,
                  title: 'Gestions des demandes',
                  onTap: () => Navigator.pushReplacementNamed(context, AdminDemandesPage.routeName),
                ),
                _buildDrawerItem(
                  context,
                  icon: Icons.people_alt_rounded,
                  title: 'Utilisateurs & Agents',
                  onTap: () => Navigator.pushReplacementNamed(context, AdminUsersPage.routeName),
                ),
                const Divider(),
                Padding(
                  padding: const EdgeInsets.only(left: 16, top: 10, bottom: 5),
                  child: Text(
                    "CONFIGURATION",
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[600],
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                _buildDrawerItem(
                  context,
                  icon: Icons.folder_special_rounded,
                  title: 'Documents & Services',
                  onTap: () {
                    Navigator.pop(context); // Close drawer
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const GestionServicesPage()));
                  },
                ),
              ],
            ),
          ),
          const Divider(),
          _buildDrawerItem(
            context,
            icon: Icons.account_circle_rounded,
            title: 'Profil Administratif',
            onTap: () => Navigator.pushReplacementNamed(context, AdminProfilePage.routeName),
          ),
          _buildDrawerItem(
            context,
            icon: Icons.logout_rounded,
            title: 'Déconnexion',
            color: Colors.red[700],
            onTap: () {
              context.read<AuthProvider>().logout();
              Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
            },
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(BuildContext context, {required IconData icon, required String title, required VoidCallback onTap, Color? color}) {
    return ListTile(
      leading: Icon(icon, color: color ?? _primaryBlue),
      title: Text(
        title,
        style: GoogleFonts.inter(
          color: color ?? const Color(0xFF1C1C1E),
          fontWeight: FontWeight.w600,
          fontSize: 14,
        ),
      ),
      onTap: onTap,
    );
  }
}
