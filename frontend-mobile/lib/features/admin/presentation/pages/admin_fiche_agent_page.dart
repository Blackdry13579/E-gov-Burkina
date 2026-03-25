import 'package:egov_mobile/core/providers/auth_provider.dart';
import 'package:egov_mobile/core/providers/user_management_provider.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'agent_model.dart';
import 'admin_home_page.dart';
import 'admin_demandes_page.dart';
import 'admin_documents_page.dart';

// ─── Couleurs ──────────────────────────────────────────────────────────────────
const _kNavy    = Color(0xFF1a237e);
const _kBg      = Color(0xFFf0f4f8);
const _kDark    = Color(0xFF1e293b);
const _kGray    = Color(0xFF94a3b8);
const _kBorder  = Color(0xFFe2e8f0);
const _kGreen   = Color(0xFF16a34a);
const _kGreenBg = Color(0xFFdcfce7);
const _kRed     = Color(0xFF991b1b);
const _kRedBg   = Color(0xFFfee2e2);
const _kMuted   = Color(0xFF64748b);

// ─── Page Fiche Agent ──────────────────────────────────────────────────────────
class AdminFicheAgentPage extends StatefulWidget {
  final AgentData agent;
  const AdminFicheAgentPage({super.key, required this.agent});

  @override
  State<AdminFicheAgentPage> createState() => _AdminFicheAgentPageState();
}

class _AdminFicheAgentPageState extends State<AdminFicheAgentPage> {

  @override
  void initState() {
    super.initState();
  }

  // ── Build ──────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    final userProvider = context.watch<UserManagementProvider>();
    final agent = userProvider.agents.cast<AgentData?>().firstWhere(
      (a) => a?.matricule == widget.agent.matricule,
      orElse: () => widget.agent,
    ) ?? widget.agent;
    final isActive = agent.actif;

    return Scaffold(
      backgroundColor: _kBg,
      appBar: _appBar(context),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(bottom: 32),
        child: Column(
          children: [
            _identityCard(agent, isActive),
            const SizedBox(height: 16),
            _statsGrid(agent),
            const SizedBox(height: 16),
            _infoCard(agent),
            const SizedBox(height: 16),
            _actionButton(context, agent, isActive),
            const SizedBox(height: 8),
          ],
        ),
      ),
      bottomNavigationBar: _bottomNav(),
    );
  }

  // ── AppBar ─────────────────────────────────────────────────────────────────
  PreferredSizeWidget _appBar(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      automaticallyImplyLeading: false,
      title: Row(
        children: [
          // Bouton retour
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Container(
              width: 40,
              height: 40,
              decoration: const BoxDecoration(
                color: _kBg,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.arrow_back,
                  color: _kMuted, size: 20),
            ),
          ),
          const SizedBox(width: 12),
          // Titre centré
          Expanded(
            child: Column(
              children: [
                Text(
                  'Fiche Agent',
                  style: GoogleFonts.publicSans(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: _kNavy,
                  ),
                ),
                Text(
                  'PORTAIL ADMIN',
                  style: GoogleFonts.publicSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: _kGray,
                    letterSpacing: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 16),
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              shape: BoxShape.circle,
              border: Border.all(color: _kBorder),
            ),
            child: ClipOval(
              child: Image.asset(
                'assets/images/embleme.png',
                fit: BoxFit.contain,
                errorBuilder: (_, __, ___) =>
                    const Icon(Icons.account_balance,
                        color: _kNavy, size: 18),
              ),
            ),
          ),
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(color: _kBorder, height: 1),
      ),
    );
  }

  // ── Carte identité ─────────────────────────────────────────────────────────
  Widget _identityCard(AgentData agent, bool isActive) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 12,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Avatar avec point vert
          Stack(
            children: [
              Container(
                width: 90,
                height: 90,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF1a237e), Color(0xFF283593)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    agent.initials,
                    style: GoogleFonts.publicSans(
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: 3,
                right: 3,
                child: Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    color: isActive ? _kGreen : _kGray,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 3),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            agent.name,
            style: GoogleFonts.publicSans(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: _kDark,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            agent.matricule,
            style: GoogleFonts.jetBrainsMono(
              fontSize: 13,
              color: _kGray,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 12),
          // Badge service
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            decoration: BoxDecoration(
              color: _kNavy,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              agent.service,
              style: GoogleFonts.publicSans(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: 1,
              ),
            ),
          ),
          const SizedBox(height: 8),
          // Badge statut
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: isActive ? _kGreenBg : const Color(0xFFf1f5f9),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: isActive ? _kGreen : _kGray,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  isActive ? 'Actif' : 'Inactif',
                  style: GoogleFonts.publicSans(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: isActive ? _kGreen : _kGray,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Grille stats 2×2 ───────────────────────────────────────────────────────
  Widget _statsGrid(AgentData agent) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _StatCard(
                  label: 'DOSSIERS TRAITÉS',
                  value: '${agent.dossiersTraites}',
                  valueColor: _kDark,
                  bottom: Row(
                    children: [
                      const Icon(Icons.trending_up_rounded,
                          color: _kGreen, size: 14),
                      const SizedBox(width: 4),
                      Text(
                        '+5 cette semaine',
                        style: GoogleFonts.publicSans(
                            fontSize: 12, color: _kGreen),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _StatCard(
                  label: 'TAUX VALIDATION',
                  value: '${agent.tauxValidation}%',
                  valueColor: _kGreen,
                  bottom: Text(
                    'Ce mois',
                    style: GoogleFonts.publicSans(
                        fontSize: 12, color: _kMuted),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _StatCard(
                  label: 'VALIDÉES',
                  value: '${agent.validees}',
                  valueColor: _kGreen,
                  bottom: const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Spacer(),
                      Icon(Icons.check_circle_rounded,
                          color: _kGreen, size: 28),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _StatCard(
                  label: 'REJETÉES',
                  value: '${agent.rejetees}',
                  valueColor: _kRed,
                  bottom: const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Spacer(),
                      Icon(Icons.cancel_rounded,
                          color: _kRed, size: 28),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── Infos professionnelles ─────────────────────────────────────────────────
  Widget _infoCard(AgentData agent) {
    final rows = [
      ('Service',       agent.serviceComplet, false),
      ('Matricule',     agent.matricule,      true),
      ('Email',         agent.email,          false),
      ('Téléphone',     agent.phone,          false),
      ("Date d'ajout",  agent.dateAjout,      false),
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // En-tête
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: _kBg,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.badge_rounded,
                    color: _kNavy, size: 22),
              ),
              const SizedBox(width: 12),
              Text(
                'Informations Professionnelles',
                style: GoogleFonts.publicSans(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: _kDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Lignes
          for (int i = 0; i < rows.length; i++) ...[
            if (i > 0) const Divider(height: 1, color: _kBorder),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    rows[i].$1,
                    style: GoogleFonts.publicSans(
                      fontSize: 14,
                      color: _kMuted,
                    ),
                  ),
                  rows[i].$3
                      ? Text(
                          rows[i].$2,
                          style: GoogleFonts.jetBrainsMono(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: _kDark,
                          ),
                        )
                      : Flexible(
                          child: Text(
                            rows[i].$2,
                            textAlign: TextAlign.right,
                            style: GoogleFonts.publicSans(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: _kDark,
                            ),
                          ),
                        ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ── Bouton désactiver / réactiver ──────────────────────────────────────────
  Widget _actionButton(BuildContext context, AgentData agent, bool isActive) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GestureDetector(
        onTap: () => _showConfirmDialog(context, agent, isActive),
        child: Container(
          width: double.infinity,
          height: 56,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isActive ? _kRed : _kGreen,
              width: 2,
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                isActive ? Icons.block_rounded : Icons.check_circle_outline_rounded,
                color: isActive ? _kRed : _kGreen,
                size: 22,
              ),
              const SizedBox(width: 10),
              Text(
                isActive ? "Désactiver l'agent" : "Réactiver l'agent",
                style: GoogleFonts.publicSans(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: isActive ? _kRed : _kGreen,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Dialog de confirmation ─────────────────────────────────────────────────
  void _showConfirmDialog(BuildContext context, AgentData agent, bool isActive) {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        insetPadding: const EdgeInsets.symmetric(horizontal: 32),
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Icône
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: isActive ? _kRedBg : _kGreenBg,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isActive ? Icons.block_rounded : Icons.check_circle_rounded,
                  color: isActive ? _kRed : _kGreen,
                  size: 32,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                isActive ? 'Désactiver cet agent ?' : 'Réactiver cet agent ?',
                style: GoogleFonts.publicSans(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: _kDark,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                isActive
                    ? "L'agent ${agent.name} ne pourra plus accéder à la plateforme."
                    : "L'agent ${agent.name} pourra à nouveau accéder à la plateforme.",
                style: GoogleFonts.publicSans(
                  fontSize: 13,
                  color: _kGray,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => Navigator.pop(ctx),
                      child: Container(
                        height: 48,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: _kNavy),
                        ),
                        child: Center(
                          child: Text(
                            'Annuler',
                            style: GoogleFonts.publicSans(
                              fontWeight: FontWeight.bold,
                              color: _kNavy,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        final token = context.read<AuthProvider>().token ?? '';
                        context.read<UserManagementProvider>().toggleAgentStatus(agent.id, token);
                        Navigator.pop(ctx);
                      },
                      child: Container(
                        height: 48,
                        decoration: BoxDecoration(
                          color: isActive ? _kRed : _kGreen,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: Text(
                            isActive ? 'Désactiver' : 'Réactiver',
                            style: GoogleFonts.publicSans(
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Bottom nav ─────────────────────────────────────────────────────────────
  Widget _bottomNav() {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: _kBorder)),
      ),
      child: BottomNavigationBar(
        elevation: 0,
        backgroundColor: Colors.white,
        currentIndex: 2,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: _kNavy,
        unselectedItemColor: _kGray,
        selectedFontSize: 10,
        unselectedFontSize: 10,
        selectedLabelStyle: GoogleFonts.publicSans(
            fontWeight: FontWeight.bold, letterSpacing: 0.5),
        unselectedLabelStyle:
            GoogleFonts.publicSans(letterSpacing: 0.5),
        onTap: (index) {
          if (index == 2) return;
          if (index == 0) Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const AdminHomePage()));
          if (index == 1) Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const AdminDemandesPage()));
          if (index == 3) Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const AdminDocumentsPage()));
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.grid_view_outlined),
            activeIcon: Icon(Icons.grid_view_rounded),
            label: 'TABLEAU',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.description_outlined),
            activeIcon: Icon(Icons.description_rounded),
            label: 'DEMANDES',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people_outline),
            activeIcon: Icon(Icons.people_rounded),
            label: 'UTILISATEURS',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.folder_outlined),
            activeIcon: Icon(Icons.folder_rounded),
            label: 'DOCUMENTS',
          ),
        ],
      ),
    );
  }
}

// ─── Widget stat card ─────────────────────────────────────────────────────────
class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final Color  valueColor;
  final Widget bottom;

  const _StatCard({
    required this.label,
    required this.value,
    required this.valueColor,
    required this.bottom,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: GoogleFonts.publicSans(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: _kGray,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: GoogleFonts.publicSans(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: valueColor,
            ),
          ),
          const SizedBox(height: 6),
          bottom,
        ],
      ),
    );
  }
}
