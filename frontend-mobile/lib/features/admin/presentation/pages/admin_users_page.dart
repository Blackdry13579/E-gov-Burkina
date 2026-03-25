import 'package:egov_mobile/core/providers/auth_provider.dart';
import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:egov_mobile/features/shared/presentation/widgets/admin_bottom_nav.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'admin_fiche_agent_page.dart';
import 'admin_ajouter_agent_page.dart';
import 'agent_model.dart';
import 'citizen_model.dart';
import 'admin_citizen_detail_page.dart';
import '../../../../core/providers/user_management_provider.dart';
import 'package:provider/provider.dart';

// ─── Couleurs ─────────────────────────────────────────────────────────────────
const _kNavy    = Color(0xFF1a237e);
const _kBg      = Color(0xFFf0f4f8);
const _kGray    = Color(0xFF94a3b8);
const _kText    = Color(0xFF475569);
const _kBorder  = Color(0xFFe2e8f0);

const _serviceFilters = ['Tous', 'Mairie', 'Justice', 'Police', 'Santé'];

class AdminUsersPage extends StatefulWidget {
  final int initialIndex;
  const AdminUsersPage({super.key, this.initialIndex = 0});
  static const routeName = '/admin-users';

  @override
  State<AdminUsersPage> createState() => _AdminUsersPageState();
}

class _AdminUsersPageState extends State<AdminUsersPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedService = 'Tous';
  String _searchQuery     = '';
  final  _searchCtrl      = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this, initialIndex: widget.initialIndex);
    _searchCtrl.addListener(() => setState(() => _searchQuery = _searchCtrl.text));
    
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final token = context.read<AuthProvider>().token;
      if (token != null) {
        context.read<UserManagementProvider>().fetchUsers(token);
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchCtrl.dispose();
    super.dispose();
  }

  List<AgentData> getFilteredAgents(List<AgentData> allAgents) {
    return allAgents.where((a) {
      final matchService = _selectedService == 'Tous' || a.service.toUpperCase() == _selectedService.toUpperCase();
      final matchQuery   = a.name.toLowerCase().contains(_searchQuery.toLowerCase()) || 
                           a.matricule.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchService && matchQuery;
    }).toList();
  }

  List<CitizenData> getFilteredCitizens(List<CitizenData> allCitizens) {
    if (_searchQuery.isEmpty) return allCitizens;
    return allCitizens.where((c) {
      return c.name.toLowerCase().contains(_searchQuery.toLowerCase()) || 
             c.cnib.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = context.watch<UserManagementProvider>();
    final agents = userProvider.agents;
    final citizens = userProvider.citizens;
    
    return Scaffold(
      backgroundColor: _kBg,
      appBar: _appBar(),
      body: Column(
        children: [
          _tabControl(),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildAgentsSection(getFilteredAgents(agents)),
                _buildCitizensSection(getFilteredCitizens(citizens)),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: const AdminBottomNav(currentIndex: 2),
    );
  }

  PreferredSizeWidget _appBar() {
    return const EgovMainAppBar(title: 'GESTION UTILISATEURS');
  }

  Widget _tabControl() {
    return Container(
      color: Colors.white,
      child: TabBar(
        controller: _tabController,
        labelColor: _kNavy,
        unselectedLabelColor: _kGray,
        indicatorColor: _kNavy,
        indicatorWeight: 3,
        labelStyle: GoogleFonts.publicSans(fontWeight: FontWeight.bold, fontSize: 13),
        tabs: const [
          Tab(text: 'AGENTS'),
          Tab(text: 'CITOYENS'),
        ],
      ),
    );
  }

  // --- SECTION AGENTS ---
  Widget _buildAgentsSection(List<AgentData> filtered) {
    return SingleChildScrollView(
      child: Column(
        children: [
          _headerCard(
            title: 'Personnel Administratif',
            subtitle: 'Gérez les comptes des agents de l\'État',
            icon: Icons.admin_panel_settings_rounded,
            onAdd: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminAjouterAgentPage())),
          ),
          _searchBar('Rechercher un agent...'),
          _serviceChips(),
          if (filtered.isEmpty)
            _emptyState()
          else
            _buildAgentsList(filtered),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  // --- SECTION CITOYENS ---
  Widget _buildCitizensSection(List<CitizenData> citizens) {
    return SingleChildScrollView(
      child: Column(
        children: [
          _headerCard(
            title: 'Base de données Citoyenne',
            subtitle: 'Consultez les profils des citoyens inscrits',
            icon: Icons.people_alt_rounded,
            color: _kNavy,
          ),
          _searchBar('Rechercher un citoyen (Nom, CNIB)...'),
          const SizedBox(height: 16),
          _buildCitizensList(citizens),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  // --- WIDGETS REUTILISABLES ---

  Widget _headerCard({required String title, required String subtitle, required IconData icon, VoidCallback? onAdd, Color color = _kNavy}) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: color.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.white, size: 40),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.publicSans(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                Text(subtitle, style: GoogleFonts.publicSans(color: Colors.white.withOpacity(0.8), fontSize: 12)),
              ],
            ),
          ),
          if (onAdd != null)
            IconButton(
              onPressed: onAdd,
              icon: const Icon(Icons.add_circle_outline_rounded, color: Colors.white, size: 30),
            ),
        ],
      ),
    );
  }

  Widget _searchBar(String hint) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: _kBorder)),
      child: TextField(
        controller: _searchCtrl,
        decoration: InputDecoration(
          hintText: hint,
          prefixIcon: const Icon(Icons.search_rounded, color: _kGray),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }

  Widget _buildAgentsList(List<AgentData> agents) {
    return ListView.separated(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: agents.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) => _AgentCard(agent: agents[index]),
    );
  }

  Widget _buildCitizensList(List<CitizenData> citizens) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ListView.separated(
        physics: const NeverScrollableScrollPhysics(),
        shrinkWrap: true,
        itemCount: citizens.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) => _CitizenRow(citizen: citizens[index]),
      ),
    );
  }

  Widget _serviceChips() {
    return SizedBox(
      height: 50,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _serviceFilters.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (_, i) {
          final s = _serviceFilters[i];
          final sel = _selectedService == s;
          return ChoiceChip(
            label: Text(s),
            selected: sel,
            onSelected: (_) => setState(() => _selectedService = s),
            backgroundColor: Colors.white,
            selectedColor: _kNavy,
            labelStyle: GoogleFonts.publicSans(color: sel ? Colors.white : _kText, fontWeight: sel ? FontWeight.bold : FontWeight.normal),
          );
        },
      ),
    );
  }

  Widget _emptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off_rounded, size: 60, color: _kGray.withOpacity(0.5)),
          const SizedBox(height: 16),
          Text('Aucun résultat trouvé', style: GoogleFonts.publicSans(color: _kGray, fontSize: 14)),
        ],
      ),
    );
  }
}

class _AgentCard extends StatelessWidget {
  final AgentData agent;
  const _AgentCard({required this.agent});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => AdminFicheAgentPage(agent: agent))),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: Row(
          children: [
            CircleAvatar(backgroundColor: agent.avatarBg, child: Text(agent.initials, style: TextStyle(color: agent.avatarFg))),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(agent.name, style: GoogleFonts.publicSans(fontWeight: FontWeight.bold, fontSize: 14)),
                  Text(agent.matricule, style: GoogleFonts.publicSans(color: _kGray, fontSize: 11)),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Switch(
              value: agent.actif,
              onChanged: (val) {
                final token = context.read<AuthProvider>().token;
                if (token != null) {
                  context.read<UserManagementProvider>().toggleUserStatus(agent.id, token);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text("${agent.name} ${val ? 'activé' : 'désactivé'}"),
                      duration: const Duration(seconds: 1),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                }
              },
              activeThumbColor: _kNavy,
              activeTrackColor: _kNavy.withOpacity(0.3),
            ),
            const Icon(Icons.chevron_right_rounded, color: _kGray),
          ],
        ),
      ),
    );
  }
}

class _CitizenRow extends StatelessWidget {
  final CitizenData citizen;

  const _CitizenRow({required this.citizen});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => AdminCitizenDetailPage(citizen: citizen),
        ),
      ),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: _kBorder),
        ),
        child: Row(
          children: [
            const CircleAvatar(
                backgroundColor: Color(0xFFF1F5F9),
                child: Icon(Icons.person, color: _kNavy)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(citizen.name,
                      style: GoogleFonts.publicSans(
                          fontWeight: FontWeight.bold, fontSize: 14)),
                  Text('CNIB: ${citizen.cnib}',
                      style: GoogleFonts.publicSans(color: _kGray, fontSize: 11)),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                  color: citizen.statusBg,
                  borderRadius: BorderRadius.circular(8)),
              child: Text(citizen.statusLabel,
                  style: GoogleFonts.publicSans(
                      color: citizen.statusColor,
                      fontSize: 10,
                      fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}
