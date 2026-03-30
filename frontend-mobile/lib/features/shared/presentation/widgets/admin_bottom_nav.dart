import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../admin/presentation/pages/admin_home_page.dart';
import '../../../admin/presentation/pages/admin_demandes_page.dart';
import '../../../admin/presentation/pages/admin_users_page.dart';
import '../../../admin/presentation/pages/admin_documents_page.dart';
import '../../../admin/presentation/pages/admin_profile_page.dart';

class AdminBottomNav extends StatelessWidget {
  final int currentIndex;

  const AdminBottomNav({
    super.key,
    required this.currentIndex,
  });

  static const primaryBlue = Color(0xFF1A237E);
  static const grayMuted = Color(0xFF94A3B8);

  void _onTap(BuildContext context, int index) {
    if (index == currentIndex) return;

    String routeName;
    switch (index) {
      case 0:
        routeName = AdminHomePage.routeName;
        break;
      case 1:
        routeName = AdminDemandesPage.routeName;
        break;
      case 2:
        routeName = AdminUsersPage.routeName;
        break;
      case 3:
        routeName = AdminDocumentsPage.routeName;
        break;
      case 4:
        routeName = AdminProfilePage.routeName;
        break;
      default:
        routeName = AdminHomePage.routeName;
    }

    Navigator.pushReplacementNamed(context, routeName);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: Colors.grey.withOpacity(0.2), width: 0.5),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (index) => _onTap(context, index),
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: primaryBlue,
        unselectedItemColor: grayMuted,
        selectedFontSize: 10,
        unselectedFontSize: 10,
        elevation: 0,
        selectedLabelStyle: GoogleFonts.publicSans(
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
        unselectedLabelStyle: GoogleFonts.publicSans(
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
        ),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.grid_view_outlined, size: 22),
            activeIcon: Icon(Icons.grid_view_rounded, size: 22),
            label: 'TABLEAU',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.description_outlined, size: 22),
            activeIcon: Icon(Icons.description_rounded, size: 22),
            label: 'DEMANDES',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people_outline_rounded, size: 22),
            activeIcon: Icon(Icons.people_alt_rounded, size: 22),
            label: 'AGENTS',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.folder_open_outlined, size: 22),
            activeIcon: Icon(Icons.folder_rounded, size: 22),
            label: 'DOCS & SERVICES',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_circle_outlined, size: 22),
            activeIcon: Icon(Icons.account_circle_rounded, size: 22),
            label: 'PROFIL',
          ),
        ],
      ),
    );
  }
}
