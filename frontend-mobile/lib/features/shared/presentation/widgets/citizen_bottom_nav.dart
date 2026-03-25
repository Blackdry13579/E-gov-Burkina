import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../home/presentation/pages/home_page.dart';
import '../../../../scaffolds/citizen_main_scaffold.dart';

class CitizenBottomNav extends StatelessWidget {
  final int currentIndex;

  const CitizenBottomNav({super.key, required this.currentIndex});

  void _navigate(BuildContext context, int index) {
    if (index == currentIndex) return;

    final scaffold = CitizenMainScaffold.of(context);
    if (scaffold != null) {
      scaffold.switchTab(index);
      return;
    }

    String routeName;
    switch (index) {
      case 0: routeName = HomePage.routeName; break;
      case 1: routeName = '/citizen-catalogue'; break;
      case 2: routeName = '/citizen-demandes'; break;
      case 3: default: routeName = '/citizen-profile'; break;
    }

    Navigator.of(context).pushNamedAndRemoveUntil(
      routeName,
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: (i) => _navigate(context, i),
      type: BottomNavigationBarType.fixed,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: AppColors.textLight,
      selectedLabelStyle: GoogleFonts.outfit(
        fontSize: 10,
        fontWeight: FontWeight.w700,
      ),
      unselectedLabelStyle: GoogleFonts.outfit(
        fontSize: 10,
        fontWeight: FontWeight.w600,
      ),
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home_rounded),
          label: 'ACCUEIL',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.apps_outlined),
          label: 'SERVICES',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.folder_copy_outlined),
          label: 'MES DEMANDES',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline_rounded),
          label: 'PROFIL',
        ),
      ],
    );
  }
}

