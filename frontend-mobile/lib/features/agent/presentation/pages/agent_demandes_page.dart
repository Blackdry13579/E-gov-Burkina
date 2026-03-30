import 'package:egov_mobile/core/providers/auth_provider.dart';
import 'package:egov_mobile/core/providers/demande_provider.dart';
import 'package:egov_mobile/features/shared/domain/models/demande_model.dart';
import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:egov_mobile/features/agent/domain/models/agent_config.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'detail_demande_page.dart';

// ─── Couleurs globales ──────────────────────────────────────────────────────
const _kNavy       = Color(0xFF1a237e);
const _kBg         = Color(0xFFf0f4f8);
const _kDark       = Color(0xFF1e293b);
const _kGray       = Color(0xFF94a3b8);
const _kText       = Color(0xFF475569);
const _kBorderGray = Color(0xFFe2e8f0);

// badges
const _kPendingBg  = Color(0xFFfee2e2);
const _kPendingFg  = Color(0xFF991b1b);
const _kValidBg    = Color(0xFFdcfce7);
const _kValidFg    = Color(0xFF16a34a);

class AgentDemandesPage extends StatefulWidget {
  final AgentRole role;
  final VoidCallback? onNotificationTap;
  final VoidCallback? onProfileTap;

  const AgentDemandesPage({
    super.key,
    required this.role,
    this.onNotificationTap,
    this.onProfileTap,
  });

  @override
  State<AgentDemandesPage> createState() => _AgentDemandesPageState();
}

class _AgentDemandesPageState extends State<AgentDemandesPage> {
  String _selectedStatus  = 'TOUS';
  String _searchQuery     = '';

  final _searchCtrl = TextEditingController();
  final _statuts  = const ['Tout', 'En attente', 'Validée', 'Rejetée'];

  @override
  void initState() {
    super.initState();
    _searchCtrl.addListener(() => setState(() => _searchQuery = _searchCtrl.text));
    
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final token = context.read<AuthProvider>().token;
      if (token != null) {
        context.read<DemandeProvider>().fetchAgentDemandes(token: token);
      }
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  List<DemandeModel> _filter(List<DemandeModel> demandes) {
    return demandes.where((d) {
      final bool matchesSearch = d.reference.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          d.citoyenNom.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          d.typeDocument.toLowerCase().contains(_searchQuery.toLowerCase());
      
      final bool matchesStatus = _selectedStatus == 'TOUS' || 
          d.statut.toUpperCase() == _selectedStatus.toUpperCase() ||
          (_selectedStatus == 'Tout') ||
          (d.statut.toUpperCase().contains('VALIDEE') && _selectedStatus.toUpperCase().contains('VALIDEE')) ||
          (d.statut.toUpperCase().contains('REJETE') && _selectedStatus.toUpperCase().contains('REJETEE'));
          
      return matchesSearch && matchesStatus;
    }).toList();
  }

  int get _enAttenteCount {
    final allDemandes = context.read<DemandeProvider>().demandes;
    return allDemandes.where((d) {
      final st = d.statut.toUpperCase();
      return st == 'EN ATTENTE' || st == 'EN_ATTENTE';
    }).length;
  }

  int _countByStatut(String key) {
    final allDemandes = context.read<DemandeProvider>().demandes;
    if (key == 'Tout') return allDemandes.length;
    
    final normalizedKey = (key == 'En attente' ? 'EN ATTENTE' : key.toUpperCase()).replaceAll('É', 'E');
    
    return allDemandes.where((d) {
       final st = d.statut.toUpperCase().replaceAll('É', 'E');
       return st == normalizedKey || st == normalizedKey.replaceAll(' ', '_') || st.contains(normalizedKey);
    }).length;
  }

  @override
  Widget build(BuildContext context) {
    final filteredList = _filter(context.watch<DemandeProvider>().demandes);
    
    return Scaffold(
      backgroundColor: _kBg,
      appBar: EgovMainAppBar(
        title: 'GESTION DES DEMANDES',
        onNotificationTap: widget.onNotificationTap,
        onProfileTap: widget.onProfileTap,
      ),
      body: Consumer<DemandeProvider>(
        builder: (context, demandeProvider, _) {
          if (demandeProvider.isLoading && demandeProvider.demandes.isEmpty) {
            return const Center(child: CircularProgressIndicator(color: _kNavy));
          }
          
          return RefreshIndicator(
            onRefresh: () async {
              final token = context.read<AuthProvider>().token;
              if (token != null) {
                 await context.read<DemandeProvider>().fetchAgentDemandes(token: token);
              }
            },
            color: _kNavy,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _header(filteredList.length),
                  _searchBar(),
                  _filterSection('FILTRER PAR STATUT', _statuts, _selectedStatus,
                      (v) => setState(() => _selectedStatus = v),
                      showCounts: true),
                  const SizedBox(height: 8),
                  if (filteredList.isEmpty)
                    SizedBox(height: 300, child: _emptyState())
                  else
                    ListView.separated(
                      physics: const NeverScrollableScrollPhysics(),
                      shrinkWrap: true,
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
                      itemCount: filteredList.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 16),
                      itemBuilder: (_, i) => _RequestCard(demande: filteredList[i]),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _header(int total) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Gestion des Demandes',
            style: GoogleFonts.publicSans(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: _kDark,
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Text(
                '$total demandes',
                style: GoogleFonts.publicSans(fontSize: 14, color: _kGray),
              ),
              const SizedBox(width: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: _kPendingBg,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '$_enAttenteCount en attente',
                  style: GoogleFonts.publicSans(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: _kPendingFg,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _searchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Container(
        height: 52,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: _kBorderGray),
        ),
        child: TextField(
          controller: _searchCtrl,
          style: GoogleFonts.publicSans(fontSize: 14, color: _kDark),
          decoration: InputDecoration(
            hintText: 'Rechercher par référence, citoyen...',
            hintStyle: GoogleFonts.publicSans(fontSize: 14, color: _kGray),
            prefixIcon: const Icon(Icons.search_rounded, color: _kGray, size: 22),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(vertical: 16),
          ),
        ),
      ),
    );
  }

  Widget _filterSection(String label, List<String> options, String current, void Function(String) onSelect, {bool showCounts = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 10),
          child: Text(
            label,
            style: GoogleFonts.publicSans(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: _kGray,
              letterSpacing: 1.2,
            ),
          ),
        ),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.only(left: 16),
          child: Row(
            children: [
              for (final opt in options)
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: _Chip(
                    label: _chipLabel(opt, showCounts),
                    active: opt == current || (current == 'TOUS' && opt == 'Tout'),
                    onTap: () => onSelect(opt),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }

  String _chipLabel(String opt, bool showCounts) {
    if (!showCounts) return opt;
    if (opt == 'Tout') return 'Tout ${context.read<DemandeProvider>().demandes.length}';
    final count = _countByStatut(opt);
    return '$opt $count';
  }

  Widget _emptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.inbox_rounded, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 12),
          Text(
            'Aucune demande trouvée',
            style: GoogleFonts.publicSans(fontSize: 16, color: _kGray),
          ),
        ],
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;

  const _Chip({required this.label, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: active ? _kNavy : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: active ? null : Border.all(color: _kBorderGray, width: 1.5),
        ),
        child: Text(
          label,
          style: GoogleFonts.publicSans(
            fontSize: 14,
            fontWeight: active ? FontWeight.bold : FontWeight.w500,
            color: active ? Colors.white : _kText,
          ),
        ),
      ),
    );
  }
}

class _RequestCard extends StatelessWidget {
  final DemandeModel demande;
  const _RequestCard({required this.demande});

  @override
  Widget build(BuildContext context) {
    final isEnAttente = demande.statut.toUpperCase() == 'EN ATTENTE' || demande.statut.toUpperCase() == 'EN_ATTENTE';
    final isValidee   = demande.statut.toUpperCase().contains('VALIDEE');

    final Color badgeBg  = isValidee ? _kValidBg  : (isEnAttente ? _kPendingBg : const Color(0xFFfee2e2));
    final Color badgeFg  = isValidee ? _kValidFg  : (isEnAttente ? _kPendingFg : const Color(0xFF991b1b));
    final Color btnBg    = isEnAttente ? _kNavy : const Color(0xFFe2e8f0);
    final Color btnFg    = isEnAttente ? Colors.white : _kText;
    final String btnText = isEnAttente ? 'Traiter' : (isValidee ? 'Détails' : 'Motif');

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(color: Color(0x0F000000), blurRadius: 8, offset: Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  demande.typeDocument,
                  style: GoogleFonts.publicSans(fontSize: 18, fontWeight: FontWeight.bold, color: _kDark),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(color: badgeBg, borderRadius: BorderRadius.circular(20)),
                child: Text(
                  demande.statut,
                  style: GoogleFonts.publicSans(fontSize: 10, fontWeight: FontWeight.bold, color: badgeFg),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
               _InfoCell(label: 'CITOYEN', value: demande.citoyenNom),
              const SizedBox(width: 40),
              _InfoCell(label: 'RÉFÉRENCE', value: demande.reference, mono: true),
            ],
          ),
          const SizedBox(height: 20),
          const Divider(height: 1, color: _kBorderGray),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.calendar_today_rounded, size: 14, color: _kGray),
                  const SizedBox(width: 4),
                  Text(
                    "${demande.dateSoumission.day}/${demande.dateSoumission.month}/${demande.dateSoumission.year}",
                    style: GoogleFonts.publicSans(fontSize: 13, color: _kGray),
                  ),
                ],
              ),
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => AgentDetailDemandePage(
                        initialDemande: demande,
                        isAdmin: false,
                        readOnly: !isEnAttente,
                      ),
                    ),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                  decoration: BoxDecoration(color: btnBg, borderRadius: BorderRadius.circular(20)),
                  child: Text(
                    btnText,
                    style: GoogleFonts.publicSans(fontSize: 14, fontWeight: FontWeight.bold, color: btnFg),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _InfoCell extends StatelessWidget {
  final String label;
  final String value;
  final bool mono;

  const _InfoCell({required this.label, required this.value, this.mono = false});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.publicSans(fontSize: 10, fontWeight: FontWeight.w700, color: _kGray, letterSpacing: 0.8),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: mono 
            ? GoogleFonts.jetBrainsMono(fontSize: 13, fontWeight: FontWeight.bold, color: _kDark)
            : GoogleFonts.publicSans(fontSize: 13, fontWeight: FontWeight.bold, color: _kDark),
        ),
      ],
    );
  }
}
