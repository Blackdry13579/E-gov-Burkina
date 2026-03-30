import 'package:egov_mobile/core/providers/auth_provider.dart';
import 'package:egov_mobile/core/providers/stats_provider.dart';
import 'package:egov_mobile/core/providers/user_management_provider.dart';
import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:egov_mobile/features/notifications/presentation/pages/notifications_page.dart';
import 'package:egov_mobile/features/admin/presentation/pages/admin_profile_page.dart';
import 'package:egov_mobile/features/shared/presentation/widgets/admin_bottom_nav.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../../../../core/constants/app_colors.dart';
import 'admin_users_page.dart';
import 'admin_demandes_page.dart';
import 'admin_stats_page.dart';
import '../widgets/admin_drawer.dart';

class AdminHomePage extends StatefulWidget {
  const AdminHomePage({super.key});

  static const routeName = '/admin-home';

  @override
  State<AdminHomePage> createState() => _AdminHomePageState();
}

class _AdminHomePageState extends State<AdminHomePage> {
  // Colors
  static const primaryBlue = Color(0xFF1A237E);
  static const accentTeal = Color(0xFF0D7377);
  static const successGreen = Color(0xFF27AE60);
  static const warningOrange = AppColors.warning;
  static const errorRed = Color(0xFFE74C3C);
  static const backgroundLight = Color(0xFFF4F6F9);
  static const textPrimary = Color(0xFF1C1C1E);
  static const textSecondary = Color(0xFF8E8E93);
  static const heroBg = Color(0xFFE8EEF4);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final token = context.read<AuthProvider>().token;
      if (token != null) {
        context.read<StatsProvider>().fetchStatsGlobales(token);
        context.read<UserManagementProvider>().fetchUsers(token);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;
    final stats = context.watch<StatsProvider>();
    final userMgmt = context.watch<UserManagementProvider>();

    return Scaffold(
      backgroundColor: backgroundLight,
      drawer: const AdminDrawer(),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.menu_rounded, color: primaryBlue),
            onPressed: () => Scaffold.of(ctx).openDrawer(),
          ),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('E-Gov Burkina', style: GoogleFonts.publicSans(color: primaryBlue, fontSize: 15, fontWeight: FontWeight.bold)),
            Text('ADMINISTRATION PUBLIQUE', style: GoogleFonts.publicSans(color: textSecondary, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded, color: primaryBlue),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsPage(role: 'admin'))),
          ),
          IconButton(
            icon: const Icon(Icons.account_circle, color: primaryBlue),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminProfilePage())),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: stats.isLoading || userMgmt.isLoading
          ? const Center(child: CircularProgressIndicator(color: primaryBlue))
          : SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Tableau de Bord Admin",
                    style: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.w800, color: textPrimary),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Session active · ${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}",
                    style: GoogleFonts.inter(fontSize: 13, color: textSecondary),
                  ),
                  const SizedBox(height: 16),
                  
                  // Hero Card
                  Container(
                    width: double.infinity,
                    height: 100,
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    decoration: BoxDecoration(color: heroBg, borderRadius: BorderRadius.circular(18)),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "Bienvenue, ${user?.fullName ?? 'Administrateur'}",
                                style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w700, color: primaryBlue),
                              ),
                              const SizedBox(height: 6),
                              Text("Administration Publique", style: GoogleFonts.inter(fontSize: 13, color: textSecondary)),
                            ],
                          ),
                        ),
                        Image.asset(
                          'assets/images/embleme.png',
                          height: 60,
                          fit: BoxFit.contain,
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(Icons.account_balance_rounded, color: primaryBlue, size: 40),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: _buildKpiCard(
                          label: "TOTAL DEMANDES",
                          value: stats.totalDemandes.toString(),
                          trend: "+${stats.demandesAujourdhui}",
                          trendUp: true,
                          onTap: () => Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const AdminDemandesPage())),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildKpiCard(
                          label: "CITOYENS",
                          value: userMgmt.citizens.length.toString(),
                          trend: "Réel",
                          trendUp: true,
                          valueColor: accentTeal,
                          onTap: () => Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const AdminUsersPage())),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _buildKpiCard(
                          label: "AGENTS ACTIFS",
                          value: userMgmt.agents.length.toString(),
                          trend: "Stable",
                          trendUp: true,
                          isStable: true,
                          onTap: () => Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const AdminUsersPage())),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildKpiCard(
                          label: "RECRUITS",
                          value: "${stats.tauxTraitement.toStringAsFixed(1)}%",
                          trend: "Traitement",
                          trendUp: true,
                          valueColor: const Color(0xFFd4af37),
                          onTap: () => Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const AdminStatsPage())),
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  _buildSectionHeader("Répartition par Service", rightText: "Global"),
                  const SizedBox(height: 12),
                  _buildServiceChartCard(stats.statsParService),

                  const SizedBox(height: 24),
                  _buildSectionHeader("Agents Institutionnels"),
                  const SizedBox(height: 12),
                  _buildAgentsList(userMgmt.agents.take(3).toList()),

                  const SizedBox(height: 32),
                ],
              ),
            ),
      bottomNavigationBar: const AdminBottomNav(currentIndex: 0),
    );
  }

  Widget _buildSectionHeader(String title, {String? rightText, Widget? rightWidget}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(width: 4, height: 18, decoration: BoxDecoration(color: const Color(0xFFd4af37), borderRadius: BorderRadius.circular(2))),
            const SizedBox(width: 10),
            Text(title, style: GoogleFonts.publicSans(fontSize: 16, fontWeight: FontWeight.bold, color: const Color(0xFF1e293b))),
          ],
        ),
        if (rightWidget != null) rightWidget else if (rightText != null) Text(rightText, style: GoogleFonts.publicSans(fontSize: 12, color: textSecondary)),
      ],
    );
  }

  Widget _buildServiceChartCard(Map<String, int> data) {
    if (data.isEmpty) return const SizedBox(height: 100, child: Center(child: Text("Pas encore de données")));
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]),
      child: Column(
        children: data.entries.map((e) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(e.key.toUpperCase(), style: GoogleFonts.publicSans(fontSize: 12, fontWeight: FontWeight.bold)),
                    Text("${e.value} dossiers", style: GoogleFonts.publicSans(fontSize: 12, color: textSecondary)),
                  ],
                ),
                const SizedBox(height: 4),
                LinearProgressIndicator(
                  value: e.value / 100, // Simulation simple
                  backgroundColor: backgroundLight,
                  valueColor: const AlwaysStoppedAnimation<Color>(primaryBlue),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildAgentsList(List<dynamic> agents) {
    if (agents.isEmpty) return const Center(child: Text("Aucun agent configuré"));
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]),
      child: Column(
        children: agents.map((agent) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12.0),
            child: Row(
              children: [
                CircleAvatar(backgroundColor: primaryBlue, child: Text(agent.initials, style: const TextStyle(color: Colors.white, fontSize: 12))),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(agent.name, style: GoogleFonts.publicSans(fontSize: 14, fontWeight: FontWeight.bold)),
                    Text(agent.service, style: GoogleFonts.publicSans(fontSize: 11, color: textSecondary)),
                  ]),
                ),
                const Icon(Icons.verified_user_rounded, color: successGreen, size: 16),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildKpiCard({required String label, required String value, required String trend, required bool trendUp, bool isStable = false, Color valueColor = textPrimary, VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2))]),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: textSecondary, letterSpacing: 0.5)),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(value, style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w800, color: valueColor)),
                Icon(trendUp ? Icons.trending_up_rounded : Icons.trending_down_rounded, color: trendUp ? successGreen : errorRed, size: 14),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
