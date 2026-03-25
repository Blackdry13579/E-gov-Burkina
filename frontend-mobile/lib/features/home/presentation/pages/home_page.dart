import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../citizen/presentation/pages/dossier_approuve_page.dart';
import '../../../citizen/presentation/pages/suivi_dossier_rejete_page.dart';
import '../../../citizen/presentation/pages/mes_demandes_page.dart';
import '../../../catalogue/presentation/pages/catalogue_page.dart';
import '../../../../core/providers/demande_provider.dart';
import '../../../../core/providers/notification_provider.dart';
import '../../../../scaffolds/citizen_main_scaffold.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  static const routeName = '/home';

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      if (auth.token != null) {
        context.read<DemandeProvider>().fetchDemandes(token: auth.token);
      }
      if (auth.token != null) {
        context.read<NotificationProvider>().fetchNotifications(auth.token);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final agent = authProvider.agent;
    final userName = agent?.nom ?? 'Citoyen';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: EgovMainAppBar(
        title: 'PORTAIL CITOYEN',
        onProfileTap: () => CitizenMainScaffold.of(context)?.switchTab(3),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          final auth = context.read<AuthProvider>();
          await Future.wait([
            auth.token != null ? context.read<DemandeProvider>().fetchDemandes(token: auth.token) : Future.value(),
            context.read<NotificationProvider>().fetchNotifications(auth.token),
          ]);
        },
        color: AppColors.primary,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeroBanner(userName),
              const SizedBox(height: 16),
              _buildNewRequestButton(),
              const SizedBox(height: 24),
              _buildSectionHeader('Services Populaires'),
              const SizedBox(height: 16),
              _buildServicesGrid(),
              const SizedBox(height: 24),
              _buildSectionHeader('Demandes Récentes', showVoirTout: true),
              const SizedBox(height: 16),
              Consumer<DemandeProvider>(
                builder: (context, provider, child) {
                  if (provider.isLoading) {
                    return const Center(
                      child: Padding(
                        padding: EdgeInsets.all(20.0),
                        child: CircularProgressIndicator(color: AppColors.primary),
                      ),
                    );
                  }

                  final recentDemandes = provider.demandes.take(3).toList();

                  if (recentDemandes.isEmpty) {
                    return _buildEmptyState();
                  }

                  return Column(
                    children: recentDemandes.map((d) {
                      final st = d.statut.toUpperCase();
                      
                      String statusText = 'EN ATTENTE';
                      Color statusColor = AppColors.warning;
                      IconData actionIcon = Icons.history_rounded;
                      String actionLabel = 'Suivre';

                      if (st == 'VALIDEE' || st == 'VALIDÉE') {
                        statusText = 'VALIDÉE';
                        statusColor = AppColors.success;
                        actionIcon = Icons.open_in_new_rounded;
                        actionLabel = 'Détails';
                      } else if (st == 'REJETEE' || st == 'REJETÉE') {
                        statusText = 'REJETÉE';
                        statusColor = AppColors.error;
                        actionIcon = Icons.info_outline_rounded;
                        actionLabel = 'Motif';
                      }

                      String rawDate = d.dateSoumissionRaw;
                      String formattedDate = rawDate;
                      if (rawDate.length >= 10) {
                        try {
                          DateTime dt = DateTime.parse(rawDate);
                          formattedDate = "Effectué le ${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year}";
                        } catch (_) {}
                      }

                      return _buildRequestCard(
                        title: d.typeDocument,
                        reference: d.reference,
                        date: formattedDate,
                        statusText: statusText,
                        statusColor: statusColor,
                        actionLabel: actionLabel,
                        actionIcon: actionIcon,
                        service: d.service,
                        motif: d.motifRejet,
                        documentUrl: d.documentUrl,
                      );
                    }).toList(),
                  );
                },
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeroBanner(String userName) {
    return Container(
      width: double.infinity,
      height: 180,
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: AppColors.primary,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.asset(
              'assets/images/building.png',
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [AppColors.primaryLight, AppColors.primary],
                  ),
                ),
              ),
            ),
            Positioned.fill(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.65),
                    ],
                    stops: const [0.3, 1.0],
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 20,
              left: 20,
              right: 20,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Bienvenue sur votre portail',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                      color: Colors.white.withOpacity(0.85),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Bonjour, $userName 👋',
                    style: GoogleFonts.outfit(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
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

  Widget _buildNewRequestButton() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: () {
          final scaffold = CitizenMainScaffold.of(context);
          if (scaffold != null) {
            scaffold.switchTab(1);
          } else {
            Navigator.of(context).pushNamed(CataloguePage.routeName);
          }
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.add_circle_outline, size: 20),
            const SizedBox(width: 10),
            Text(
              'NOUVELLE DEMANDE',
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(width: 8),
            const Icon(Icons.arrow_forward_ios_rounded, size: 14),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, {bool showVoirTout = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 20,
            decoration: BoxDecoration(
              color: AppColors.accent,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              title,
              style: GoogleFonts.outfit(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.textDark,
              ),
            ),
          ),
          if (showVoirTout) ...[
            GestureDetector(
              onTap: () {
                Navigator.of(context).push(MaterialPageRoute(
                  builder: (_) => const MesDemandesPage(),
                ));
              },
              child: Text(
                'Voir tout',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildServicesGrid() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(child: _buildServiceCard(Icons.account_tree_outlined, 'État Civil')),
          const SizedBox(width: 12),
          Expanded(child: _buildServiceCard(Icons.gavel_rounded, 'Justice')),
        ],
      ),
    );
  }

  Widget _buildServiceCard(IconData icon, String label) {
    return GestureDetector(
      onTap: () {
        final scaffold = CitizenMainScaffold.of(context);
        if (scaffold != null) {
          scaffold.switchTab(1);
        } else {
          Navigator.of(context).pushNamed(CataloguePage.routeName);
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: const Color(0xFFF0F2F5),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: AppColors.primary, size: 26),
            ),
            const SizedBox(height: 12),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: AppColors.textDark,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRequestCard({
    required String title,
    required String reference,
    required String date,
    required String statusText,
    required Color statusColor,
    required String actionLabel,
    required IconData actionIcon,
    String service = 'Mairie Centrale',
    String? motif,
    String? documentUrl,
  }) {
    return GestureDetector(
      onTap: () {
        if (statusText == "VALIDÉE") {
          Navigator.of(context).push(MaterialPageRoute(
            builder: (_) => DossierApprouvePage(
              reference: reference,
              nomFichier: title,
              tailleFichier: "2.4 MB",
              delivrePar: "Mairie Centrale de Ouagadougou",
              validite: "Permanente",
              documentUrl: documentUrl,
            ),
          ));
        } else if (statusText == "REJETÉE") {
          Navigator.of(context).push(MaterialPageRoute(
            builder: (_) => SuiviDossierRejetePage(
              reference: reference,
              titreDemande: title,
              dateDepot: date,
              direction: service,
              motifRejet: motif ?? "Document non conforme",
              noteInstructeur: "Veuillez consulter les détails.",
            ),
          ));
        } else {
          final scaffold = CitizenMainScaffold.of(context);
          if (scaffold != null) {
            scaffold.switchTab(2);
          } else {
            Navigator.of(context).push(MaterialPageRoute(
              builder: (_) => const MesDemandesPage(),
            ));
          }
        }
      },
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border(left: BorderSide(color: statusColor, width: 4)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      title,
                      style: GoogleFonts.outfit(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textDark,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      statusText,
                      style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: statusColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(reference, style: GoogleFonts.outfit(fontSize: 12, color: AppColors.textLight)),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(date, style: GoogleFonts.outfit(fontSize: 12, color: AppColors.textLight)),
                  Row(
                    children: [
                      Text(actionLabel, style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primary)),
                      const SizedBox(width: 4),
                      Icon(actionIcon, size: 14, color: AppColors.primary),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.divider, width: 1),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.folder_open_rounded,
            size: 48,
            color: AppColors.textLight.withOpacity(0.5),
          ),
          const SizedBox(height: 16),
          Text(
            'Aucune demande récente',
            style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textLight),
          ),
          const SizedBox(height: 8),
          Text(
            'Vos dossiers apparaîtront ici après avoir soumis une demande.',
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(fontSize: 13, color: AppColors.textLight.withOpacity(0.8)),
          ),
        ],
      ),
    );
  }
}
