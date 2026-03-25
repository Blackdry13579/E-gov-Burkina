import 'package:flutter/material.dart';
import '../features/home/presentation/pages/home_page.dart';
import '../features/catalogue/presentation/pages/catalogue_page.dart';
import '../features/citizen/presentation/pages/mes_demandes_page.dart';
import '../features/profile/presentation/pages/profile_page.dart';
import '../core/constants/app_colors.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/providers/auth_provider.dart';
import '../core/providers/notification_provider.dart';
import '../core/providers/demande_provider.dart';

class CitizenMainScaffold extends StatefulWidget {
  final int initialIndex;
  const CitizenMainScaffold({super.key, this.initialIndex = 0});

  static const routeName = '/citizen-main';

  static CitizenMainScaffoldState? of(BuildContext context) {
    return context.findAncestorStateOfType<CitizenMainScaffoldState>();
  }

  @override
  State<CitizenMainScaffold> createState() => CitizenMainScaffoldState();
}

class CitizenMainScaffoldState extends State<CitizenMainScaffold> {
  late int _currentIndex;

  void switchTab(int index) {
    if (mounted) {
      setState(() {
        _currentIndex = index;
      });
    }
  }

  final List<Widget> _pages = [
    const HomePage(),
    const CataloguePage(),
    const MesDemandesPage(),
    const ProfilePage(),
  ];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    
    // Récupération initiale des données (Notifications & Demandes)
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final token = context.read<AuthProvider>().token;
      if (token != null) {
        context.read<NotificationProvider>().fetchNotifications(token);
        context.read<DemandeProvider>().fetchDemandes();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textLight,
        selectedLabelStyle: GoogleFonts.outfit(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
        ),
        unselectedLabelStyle: GoogleFonts.outfit(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
        ),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded, size: 24),
            activeIcon: Icon(Icons.home_rounded, size: 24),
            label: 'ACCUEIL',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.apps_outlined, size: 24),
            activeIcon: Icon(Icons.apps_rounded, size: 24),
            label: 'SERVICES',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.folder_copy_outlined, size: 24),
            activeIcon: Icon(Icons.folder_copy_rounded, size: 24),
            label: 'MES DEMANDES',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline_rounded, size: 24),
            activeIcon: Icon(Icons.person_rounded, size: 24),
            label: 'PROFIL',
          ),
        ],
      ),
    );
  }
}
