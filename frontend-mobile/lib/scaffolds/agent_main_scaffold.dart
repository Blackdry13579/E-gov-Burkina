import 'package:flutter/material.dart';
import 'package:egov_mobile/features/notifications/presentation/pages/notifications_page.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:egov_mobile/core/providers/auth_provider.dart';
import 'package:egov_mobile/features/agent/domain/models/agent_config.dart';
import 'package:egov_mobile/features/agent/presentation/pages/agent_dashboard_page.dart';
import 'package:egov_mobile/features/agent/presentation/pages/agent_demandes_page.dart';
import 'package:egov_mobile/features/agent/presentation/pages/agent_profile_page.dart';
import 'package:egov_mobile/features/agent/presentation/pages/agent_documents_page.dart';

class AgentMainScaffold extends StatefulWidget {
  final AgentRole role;
  const AgentMainScaffold({super.key, this.role = AgentRole.justice});

  static const routeName = '/agent-main';

  @override
  State<AgentMainScaffold> createState() => _AgentMainScaffoldState();
}

class _AgentMainScaffoldState extends State<AgentMainScaffold> {
  int _currentIndex = 0;
  List<Widget> _pages = [];
  AgentRole? _currentRole;

  @override
  void initState() {
    super.initState();
    // Initialisation immédiate avec le rôle du widget
    _currentRole = widget.role;
    _initPages();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Détection dynamique du rôle via le profil utilisateur
    final user = Provider.of<AuthProvider>(context).currentUser;
    AgentRole detectedRole = AgentRole.mairie;
    
    if (user?.service?.toLowerCase() == 'justice' || user?.role == 'AGENT_JUSTICE') {
      detectedRole = AgentRole.justice;
    } else if (user?.service?.toLowerCase() == 'mairie' || user?.role == 'AGENT_MAIRIE') {
      detectedRole = AgentRole.mairie;
    } else {
      // Fallback sur le rôle passé au widget si le profil n'est pas encore là
      detectedRole = widget.role;
    }

    if (_currentRole != detectedRole) {
      _currentRole = detectedRole;
      _initPages();
    }
  }

  void _initPages() {
    final activeRole = _currentRole ?? widget.role;
    _pages = [
      AgentDashboardPage(
        role: activeRole,
        onSeeAll: () => setState(() => _currentIndex = 1),
        onProfileTap: () => setState(() => _currentIndex = 3),
        onNotificationTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const NotificationsPage(role: 'agent')),
        ),
      ),
      AgentDemandesPage(
        role: activeRole,
        onProfileTap: () => setState(() => _currentIndex = 3),
        onNotificationTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const NotificationsPage(role: 'agent')),
        ),
      ),
      AgentDocumentsPage(
        onProfileTap: () => setState(() => _currentIndex = 3),
        onNotificationTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const NotificationsPage(role: 'agent')),
        ),
      ),
      const AgentProfilePage(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final config = AgentConfig.getByRole(widget.role);

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        selectedItemColor: config.primaryColor,
        unselectedItemColor: const Color(0xFF94a3b8),
        selectedLabelStyle: GoogleFonts.publicSans(fontWeight: FontWeight.bold, fontSize: 11),
        unselectedLabelStyle: GoogleFonts.publicSans(fontWeight: FontWeight.w500, fontSize: 11),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard_rounded),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.folder_open_outlined),
            activeIcon: Icon(Icons.folder_rounded),
            label: 'Demandes',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.description_outlined),
            activeIcon: Icon(Icons.description_rounded),
            label: 'Documents',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline_rounded),
            activeIcon: Icon(Icons.person_rounded),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}
