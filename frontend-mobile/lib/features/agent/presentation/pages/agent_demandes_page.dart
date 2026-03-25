import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../../core/providers/demande_provider.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../shared/domain/models/demande_model.dart';
import '../../domain/models/agent_config.dart';
import '../../domain/models/agent_model.dart';
import '../../domain/models/service_documents.dart';
import '../../../../core/constants/app_colors.dart';
import 'detail_demande_page.dart';
import 'agent_validation_success_page.dart';
import 'agent_rejection_success_page.dart';

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
  String _selectedFilter = 'Tout';
  String _searchQuery = '';
  bool _sortNewest = true;

  final List<String> _filters = [
    'Tout',
    'En attente',
    'Validée',
    'Rejetée',
  ];

  AgentModel? _currentAgent;

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

  List<DemandeModel> _getFilteredDemandes(List<DemandeModel> demandes) {

    // Le backend filtre déjà par service pour l'agent, pas besoin de le faire côté client !
    
    // Step 1: filter by selected chip
    List<DemandeModel> statusFiltered;
    if (_selectedFilter == 'Tout') {
      statusFiltered = demandes;
    } else {
      final filter = _selectedFilter.toLowerCase();
      statusFiltered = demandes.where((d) {
        final status = d.statut.toLowerCase();
        if (filter.contains('valid')) return status.contains('valid');
        if (filter.contains('rejet')) return status.contains('rejet');
        if (filter.contains('attente')) return status.contains('attente');
        return status == filter;
      }).toList();
    }

    // Step 3: filter by search query
    List<DemandeModel> searchFiltered;
    if (_searchQuery.isEmpty) {
      searchFiltered = statusFiltered;
    } else {
      final q = _searchQuery.toLowerCase();
      searchFiltered = statusFiltered.where((d) {
        return d.typeDocument.toLowerCase().contains(q) ||
            d.citoyenNom.toLowerCase().contains(q) ||
            d.reference.toLowerCase().contains(q);
      }).toList();
    }

    // Step 4: Sort
    searchFiltered.sort((a, b) {
      if (_sortNewest) {
        return b.dateSoumission.compareTo(a.dateSoumission);
      } else {
        return a.dateSoumission.compareTo(b.dateSoumission);
      }
    });

    return searchFiltered;
  }

  @override
  Widget build(BuildContext context) {
    final demandes = context.watch<DemandeProvider>().demandes;
    final filtered = _getFilteredDemandes(demandes);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: EgovMainAppBar(
        title: 'Mes Demandes',
        onNotificationTap: widget.onNotificationTap,
        onProfileTap: widget.onProfileTap,
      ),
      body: Column(
        children: [
          _buildSearchBar(),
          _buildFilterChips(demandes),
          _buildCountBar(filtered.length),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                final token = context.read<AuthProvider>().token;
                if (token != null) {
                  await context.read<DemandeProvider>().fetchAgentDemandes(token: token);
                }
              },
              color: AppColors.primary,
              child: filtered.isEmpty
                  ? _buildEmptyState()
                  : _buildDemandesList(filtered),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      margin: const EdgeInsets.all(16),
      height: 46,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.divider),
      ),
      child: TextField(
        onChanged: (v) => setState(() => _searchQuery = v),
        decoration: InputDecoration(
          hintText: 'Rechercher par nom, réf ou type...',
          hintStyle: GoogleFonts.publicSans(
            color: AppColors.textLight,
            fontSize: 13,
          ),
          prefixIcon: const Icon(
            Icons.search_rounded,
            color: AppColors.textLight,
            size: 20,
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }

  Widget _buildFilterChips(List<DemandeModel> demandes) {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _filters.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (_, i) {
          final filter = _filters[i];
          final isSelected = _selectedFilter == filter;

          final count = filter == 'Tout'
              ? demandes.length
              : demandes.where((d) {
                  final status = d.statut.toLowerCase();
                  final f = filter.toLowerCase();
                  if (f.contains('valid')) return status.contains('valid');
                  if (f.contains('rejet')) return status.contains('rejet');
                  if (f.contains('attente')) return status.contains('attente');
                  return status == f;
                }).length;

          return GestureDetector(
            onTap: () => setState(() => _selectedFilter = filter),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isSelected ? AppColors.primary : AppColors.divider,
                ),
              ),
              child: Row(
                children: [
                  Text(
                    filter,
                    style: GoogleFonts.publicSans(
                      color: isSelected ? Colors.white : AppColors.textMedium,
                      fontSize: 12,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    ),
                  ),
                  if (count > 0) ...[
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? Colors.white.withOpacity(0.3)
                            : AppColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '$count',
                        style: GoogleFonts.publicSans(
                          color: isSelected ? Colors.white : AppColors.primary,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildCountBar(int count) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            '$count résultat(s)',
            style: GoogleFonts.publicSans(
              color: AppColors.textLight,
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
          GestureDetector(
            onTap: () => setState(() => _sortNewest = !_sortNewest),
            child: Row(
              children: [
                const Icon(Icons.sort_rounded, color: AppColors.primary, size: 16),
                const SizedBox(width: 4),
                Text(
                  _sortNewest ? 'Plus récent' : 'Plus ancien',
                  style: GoogleFonts.publicSans(
                    color: AppColors.primary,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return LayoutBuilder(
      builder: (context, constraints) {
        return SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Container(
            height: constraints.maxHeight,
            alignment: Alignment.center,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.folder_open_rounded, size: 64, color: Color(0xFFcbd5e1)),
                const SizedBox(height: 16),
                Text(
                  'Aucune demande trouvée',
                  style: GoogleFonts.publicSans(color: const Color(0xFF64748b), fontSize: 16),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildDemandesList(List<DemandeModel> filtered) {
    return ListView.builder(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
      itemCount: filtered.length,
      itemBuilder: (context, i) {
        final d = filtered[i];
        return _buildDemandeCard(d);
      },
    );
  }

  Widget _buildDemandeCard(DemandeModel d) {
    Color statusColor;
    String statusLabel;
    final status = d.statut.toLowerCase();
    
    if (status.contains('valid')) {
      statusColor = const Color(0xFF16a34a);
      statusLabel = 'Validée';
    } else if (status.contains('rejet')) {
      statusColor = const Color(0xFF991b1b);
      statusLabel = 'Rejetée';
    } else if (status.contains('attente')) {
      statusColor = const Color(0xFFf59e0b);
      statusLabel = 'En attente';
    } else {
      statusColor = AppColors.primary;
      statusLabel = d.statut;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Left colored border
            Container(
              width: 4,
              decoration: BoxDecoration(
                color: statusColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(14),
                  bottomLeft: Radius.circular(14),
                ),
              ),
            ),
            
            // Card Content
            Expanded(
              child: Column(
                children: [
                  // Top Row
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.description_outlined, color: AppColors.primary, size: 22),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                d.typeDocument,
                                style: GoogleFonts.publicSans(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                  color: AppColors.textDark,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                d.reference,
                                style: GoogleFonts.publicSans(
                                  color: AppColors.textLight,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                        _buildStatusPill(statusLabel, statusColor),
                      ],
                    ),
                  ),

                  const Divider(height: 1, thickness: 1, color: AppColors.divider),

                  // Bottom Row
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.person_outline_rounded, size: 14, color: AppColors.textLight),
                                const SizedBox(width: 6),
                                Text(
                                  d.citoyenNom.toUpperCase(),
                                  style: GoogleFonts.publicSans(
                                    color: AppColors.textLight,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                const Icon(Icons.calendar_today_outlined, size: 14, color: AppColors.textLight),
                                const SizedBox(width: 6),
                                Text(
                                  _formatDate(d.dateSoumission),
                                  style: GoogleFonts.publicSans(
                                    color: AppColors.textLight,
                                    fontSize: 11,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        _buildActionButton(d),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusPill(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: GoogleFonts.publicSans(
          color: color,
          fontSize: 11,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildActionButton(DemandeModel d) {
    bool isCompleted = d.statut.toLowerCase().contains('valid') || d.statut.toLowerCase().contains('rejet');
    
    if (!isCompleted) {
      return ElevatedButton(
        onPressed: () => Navigator.pushNamed(
          context,
          AgentDetailDemandePage.routeName,
          arguments: d.toMap(),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          elevation: 0,
          minimumSize: Size.zero,
          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        ),
        child: Text(
          'Traiter',
          style: GoogleFonts.publicSans(fontWeight: FontWeight.bold, fontSize: 13),
        ),
      );
    } else {
      bool isValidated = d.statut.toLowerCase().contains('valid');
      String label = isValidated ? 'Voir détails' : 'Voir motif';
      Color labelColor = isValidated ? const Color(0xFF16a34a) : const Color(0xFF991b1b);
      
      return InkWell(
        onTap: () {
          if (isValidated) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => AgentValidationSuccessPage(demande: d),
              ),
            );
          } else {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => AgentRejectionSuccessPage(
                  demande: d,
                  motifRejet: d.motifRejet ?? 'Motif non spécifié',
                ),
              ),
            );
          }
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Text(
            label,
            style: GoogleFonts.publicSans(
              color: labelColor,
              fontWeight: FontWeight.bold,
              fontSize: 13,
            ),
          ),
        ),
      );
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
