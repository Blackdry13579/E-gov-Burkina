import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:egov_mobile/features/shared/presentation/widgets/admin_bottom_nav.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../../core/providers/stats_provider.dart';
import '../../../../core/constants/app_colors.dart';

class AdminStatsPage extends StatefulWidget {
  const AdminStatsPage({super.key});

  @override
  State<AdminStatsPage> createState() => _AdminStatsPageState();
}

class _AdminStatsPageState extends State<AdminStatsPage> {
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  static const routeName = '/admin-stats';

  @override
  Widget build(BuildContext context) {
    final stats = context.watch<StatsProvider>();
    final filteredActivities = stats.activites.where((a) {
      if (_searchQuery.isEmpty) return true;
      return a['title'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
             a['subtitle'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const EgovMainAppBar(title: 'STATISTIQUES NATIONALES'),
      body: SafeArea(
        child: Column(
          children: [
            // Suppression de _TopBar car remplacé par appBar
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 14, 16, 18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 10),
                    Center(
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.analytics_rounded, size: 40, color: AppColors.primary),
                      ),
                    ),
                    const SizedBox(height: 16),

                    Center(
                      child: Column(
                        children: [
                          Text(
                            'Tableau de Bord National',
                            style: GoogleFonts.outfit(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textLight,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),
                    // Counters
                    Row(
                      children: [
                        _StatCard(
                          label: 'DEMANDES',
                          value: stats.totalDemandes.toString(),
                          icon: Icons.description_rounded,
                        ),
                        const SizedBox(width: 12),
                        _StatCard(
                          label: 'SUCCÈS',
                          value: '${stats.tauxTraitement}%',
                          icon: Icons.auto_awesome_rounded,
                          isSuccess: true,
                        ),
                      ],
                    ),
                    const SizedBox(height: 22),
                    // Search Bar for activities
                    Container(
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.divider),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: [
                          const Icon(Icons.search_rounded, color: AppColors.textLight, size: 20),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextField(
                              controller: _searchCtrl,
                              onChanged: (v) => setState(() => _searchQuery = v),
                              decoration: const InputDecoration(
                                hintText: 'Rechercher une activité...',
                                border: InputBorder.none,
                                hintStyle: TextStyle(fontSize: 14, color: AppColors.textLight),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 22),
                    // -- Chart & Delivery --
                    _buildSectionTitle('Délivrance par Service'),
                    const SizedBox(height: 12),
                    ...stats.deliveryTimes.entries.map((e) => Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: _DeliveryTimeRow(
                        label: e.key,
                        days: '${e.value} jours',
                        value: e.value / 5.0, // Ratio arbitraire
                      ),
                    )),
                    const SizedBox(height: 22),
                    _buildSectionTitle('Journal d\'Activités'),
                    const SizedBox(height: 12),
                    ...filteredActivities.map((a) => _ActivityItem(
                      title: a['title'],
                      subtitle: a['subtitle'],
                      isError: a['isError'],
                    )),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: const AdminBottomNav(currentIndex: 0),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: GoogleFonts.outfit(
        fontSize: 14,
        fontWeight: FontWeight.w800,
        color: AppColors.textDark,
      ),
    );
  }
}


class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final bool isSuccess;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    this.isSuccess = false,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.divider),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: isSuccess ? AppColors.success : AppColors.primary, size: 20),
            const SizedBox(height: 12),
            Text(
              value,
              style: GoogleFonts.outfit(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: AppColors.textDark,
              ),
            ),
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.w800,
                color: AppColors.textLight,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActivityItem extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool isError;

  const _ActivityItem({
    required this.title,
    required this.subtitle,
    this.isError = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.divider),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: isError ? AppColors.error.withOpacity(0.1) : AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              isError ? Icons.warning_amber_rounded : Icons.info_outline_rounded,
              color: isError ? AppColors.error : AppColors.primary,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textDark,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.outfit(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textLight,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _DeliveryTimeRow extends StatelessWidget {
  final String label;
  final String days;
  final double value;

  const _DeliveryTimeRow({
    required this.label,
    required this.days,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textDark)),
            Text(days, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.primary)),
          ],
        ),
        const SizedBox(height: 6),
        LinearProgressIndicator(
          value: value,
          backgroundColor: AppColors.divider,
          valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
          minHeight: 4,
        ),
      ],
    );
  }
}
