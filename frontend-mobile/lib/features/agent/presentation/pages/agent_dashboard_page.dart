import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/providers/demande_provider.dart';
import '../../domain/models/agent_config.dart';
import '../../../shared/domain/models/demande_model.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

class AgentDashboardPage extends StatefulWidget {
  final AgentRole role;
  final VoidCallback? onSeeAll;
  final VoidCallback? onNotificationTap;
  final VoidCallback? onProfileTap;
  
  const AgentDashboardPage({
    super.key, 
    required this.role,
    this.onSeeAll,
    this.onNotificationTap,
    this.onProfileTap,
  });

  @override
  State<AgentDashboardPage> createState() => _AgentDashboardPageState();
}

class _AgentDashboardPageState extends State<AgentDashboardPage> {

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final token = context.read<AuthProvider>().token;
      if (token != null) {
        context.read<DemandeProvider>().fetchAgentDemandes(token: token);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final agent = context.watch<AuthProvider>().agent;
    final agentName = agent?.fullName ?? 'Agent';
    final agentService = agent?.service ?? (widget.role == AgentRole.justice ? 'Justice' : 'Mairie');

    final demandes = context.watch<DemandeProvider>().demandes;
    
    final enAttente = demandes.where((d) => d.statut.toLowerCase().contains('attente')).length;
    final validees = demandes.where((d) => d.statut.toLowerCase().contains('valid')).length;
    final totalTrainees = demandes.where((d) => d.statut.toLowerCase().contains('valid') || d.statut.toLowerCase().contains('rejet')).length;
    
    final successRate = totalTrainees == 0 ? 0 : ((validees / totalTrainees) * 100).round();

    final recentDemandes = List<DemandeModel>.from(demandes.where((d) {
      final s = d.statut.toLowerCase();
      return s.contains('valid') || s.contains('rejet');
    }))
      ..sort((a, b) => b.dateSoumission.compareTo(a.dateSoumission));
    final displayRecent = recentDemandes.take(3).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: EgovMainAppBar(
        title: 'Tableau de Bord',
        onNotificationTap: widget.onNotificationTap,
        onProfileTap: widget.onProfileTap,
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          final token = context.read<AuthProvider>().token;
          if (token != null) {
            await context.read<DemandeProvider>().fetchAgentDemandes(token: token);
          }
        },
        color: AppColors.primary,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Bonjour, $agentName',
              style: GoogleFonts.inter(
                fontSize: 26,
                fontWeight: FontWeight.w800,
                color: AppColors.textDark,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.account_balance_rounded,
                    size: 16, color: AppColors.primary),
                const SizedBox(width: 8),
                Text(
                  agentService,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textMedium,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: const Border(
                  left: BorderSide(color: AppColors.accent, width: 4),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 15,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Demandes en attente',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textLight,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(
                            '$enAttente',
                            style: GoogleFonts.inter(
                              fontSize: 36,
                              fontWeight: FontWeight.w900,
                              color: AppColors.textDark,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.accent.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.hourglass_empty_rounded,
                        size: 28, color: AppColors.accent),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    label: 'Dossiers validés',
                    value: '$validees',
                    icon: Icons.check_circle_rounded,
                    iconColor: AppColors.success,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    label: 'Taux de succès',
                    value: '$successRate%',
                    icon: Icons.speed_rounded,
                    iconColor: AppColors.primary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Activités Récentes',
                  style: GoogleFonts.outfit(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
                if (displayRecent.isNotEmpty)
                  GestureDetector(
                    onTap: widget.onSeeAll,
                    child: Text(
                      'Tout voir',
                      style: GoogleFonts.outfit(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.accent,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            if (displayRecent.isEmpty)
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: Text(
                    'Aucune activité récente',
                    style: GoogleFonts.publicSans(color: AppColors.textLight),
                  ),
                ),
              )
            else
              ...displayRecent.map((d) => Padding(
                    padding: const EdgeInsets.only(bottom: 12.0),
                    child: _buildActiviteCard(
                      context,
                      icon: Icons.description_outlined,
                      iconBg: _getStatusColor(d.statut).withOpacity(0.1),
                      iconColor: _getStatusColor(d.statut),
                      titre: d.typeDocument,
                      sousTitre: '${d.citoyenNom} • ${_formatDate(d.dateSoumission)}',
                      badge: d.statut.toUpperCase(),
                      badgeColor: _getStatusColor(d.statut),
                      demande: d,
                    ),
                  )),
          ],
        ),
      ),
      ),
    );
  }


  Color _getStatusColor(String statut) {
    final s = statut.toLowerCase();
    if (s.contains('valid')) return const Color(0xFF16a34a);
    if (s.contains('rejet')) return const Color(0xFF991b1b);
    if (s.contains('attente')) return const Color(0xFFf59e0b);
    return AppColors.primary;
  }

  String _formatDate(DateTime d) {
    return '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
  }

  Widget _buildStatCard({
    required String label,
    required String value,
    required IconData icon,
    required Color iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.divider),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
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
                  label,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textLight,
                  ),
                ),
              ),
              Icon(icon, color: iconColor, size: 20),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: AppColors.textDark,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiviteCard(
    BuildContext context, {
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String titre,
    required String sousTitre,
    required String badge,
    required Color badgeColor,
    required DemandeModel demande,
  }) {
    return InkWell(
      onTap: () => Navigator.pushNamed(
        context, 
        '/agent-detail-demande',
        arguments: demande.toMap(),
      ),
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.divider),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: iconBg,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    titre,
                    style: GoogleFonts.publicSans(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textDark,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    sousTitre,
                    style: GoogleFonts.publicSans(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textLight,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: badgeColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                badge,
                style: GoogleFonts.publicSans(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  color: badgeColor,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
