import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/providers/demande_provider.dart';
import '../../../../core/providers/auth_provider.dart';
import 'suivi_dossier_page.dart';
import 'suivi_dossier_rejete_page.dart';
import 'dossier_approuve_page.dart';
import '../../../catalogue/presentation/pages/catalogue_page.dart';
import '../../../../scaffolds/citizen_main_scaffold.dart';
import '../../../shared/domain/models/demande_model.dart';


class MesDemandesPage extends StatefulWidget {
  const MesDemandesPage({super.key});

  @override
  State<MesDemandesPage> createState() => _MesDemandesPageState();
}

class _MesDemandesPageState extends State<MesDemandesPage> {
  int _selectedFilter = 0;
  final List<String> _filters = ['Tout', 'En attente', 'Validé', 'Rejeté'];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final token = context.read<AuthProvider>().token;
      if (token != null) {
        context.read<DemandeProvider>().fetchDemandes(token: token);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final demandeProvider = context.watch<DemandeProvider>();
    final allDemandes = demandeProvider.demandes;

    final filteredDemandes = allDemandes.where((d) {
      if (_selectedFilter == 0) return true; // Tout
      
      final st = d.statut.toUpperCase();
      if (_selectedFilter == 1) return st == 'EN_ATTENTE'; // En attente
      if (_selectedFilter == 2) return st == 'VALIDEE' || st == 'VALIDÉE'; // Validé
      if (_selectedFilter == 3) return st == 'REJETEE' || st == 'REJETÉE'; // Rejeté
      return true;
    }).toList();
    
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: EgovMainAppBar(
        title: 'SUIVI DEMANDES',
        onProfileTap: () => CitizenMainScaffold.of(context)?.switchTab(3),
      ),
      floatingActionButton: FloatingActionButton(
        heroTag: 'mes_demandes_fab',
        onPressed: () {
          final scaffold = CitizenMainScaffold.of(context);
          if (scaffold != null) {
            scaffold.switchTab(1);
          } else {
            Navigator.of(context).pushNamed(CataloguePage.routeName);
          }
        },
        backgroundColor: AppColors.primary,
        shape: const CircleBorder(),
        child: const Icon(
          Icons.add,
          color: Colors.white,
          size: 28,
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          final token = context.read<AuthProvider>().token;
          if (token != null) {
            await context.read<DemandeProvider>().fetchDemandes(token: token);
          }
        },
        color: AppColors.primary,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
          child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // B. FILTRES HORIZONTAUX
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _filters.asMap().entries.map((entry) {
                  final index = entry.key;
                  final filtre = entry.value;
                  return Padding(
                    padding: const EdgeInsets.only(right: 10),
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedFilter = index;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 11),
                        decoration: BoxDecoration(
                          color: _selectedFilter == index
                              ? AppColors.primary
                              : Colors.white,
                          borderRadius: BorderRadius.circular(999),
                          border: _selectedFilter != index
                              ? Border.all(
                                  color: AppColors.divider, width: 1)
                              : null,
                          boxShadow: _selectedFilter == index
                              ? [
                                  BoxShadow(
                                    color: AppColors.primary.withOpacity(0.25),
                                    blurRadius: 8,
                                    offset: const Offset(0, 3),
                                  )
                                ]
                              : null,
                        ),
                        child: Text(
                          filtre,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: _selectedFilter == index
                                ? Colors.white
                                : AppColors.textLight,
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 24),

            // C. LISTE DES DEMANDES
            if (demandeProvider.isLoading)
              const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 40.0),
                  child: CircularProgressIndicator(color: AppColors.primary),
                ),
              )
            else if (filteredDemandes.isEmpty)
              Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 60.0),
                  child: Column(
                    children: [
                      Icon(Icons.folder_off_outlined, size: 64, color: AppColors.textLight.withOpacity(0.5)),
                      const SizedBox(height: 16),
                      Text(
                        "Aucune demande trouvée.",
                        style: GoogleFonts.inter(fontSize: 16, color: AppColors.textLight),
                      ),
                    ],
                  ),
                ),
              )
            else
              ...filteredDemandes.map((d) {
                final st = d.statut.toUpperCase();
                String displayStatut = "EN ATTENTE";
                Color statutColor = AppColors.warning;
                
                if (st == 'VALIDEE' || st == 'VALIDÉE') {
                  displayStatut = "VALIDÉ";
                  statutColor = AppColors.success;
                } else if (st == 'REJETEE' || st == 'REJETÉE') {
                  displayStatut = "REJETÉ";
                  statutColor = AppColors.error;
                }

                IconData icon = Icons.description_outlined;
                final docName = d.typeDocument.toLowerCase();
                if (docName.contains('nationalité')) icon = Icons.badge_outlined;
                if (docName.contains('casier')) icon = Icons.gavel_rounded;

                String rawDate = d.dateSoumissionRaw;
                String formattedDate = rawDate;
                if (rawDate.length >= 10) {
                   try {
                     DateTime dt = DateTime.parse(rawDate);
                     formattedDate = "${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year}";
                   } catch (_) {}
                }

                void handleTap() {
                  final model = d;

                  final title = model.typeDocument;
                  final reference = model.reference;
                  
                  if (st == 'VALIDEE' || st == 'VALIDÉE') {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => DossierApprouvePage(
                        reference: reference,
                        nomFichier: title,
                        tailleFichier: "2.4 MB",
                        delivrePar: "Mairie Centrale de Ouagadougou",
                        validite: "Permanente",
                        documentUrl: model.documentUrl,
                    )));
                  } else if (st == 'REJETEE' || st == 'REJETÉE') {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => SuiviDossierRejetePage(
                        reference: reference,
                        titreDemande: title,
                        dateDepot: formattedDate,
                        direction: "Mairie Centrale de Ouagadougou",
                        motifRejet: model.motifRejet ?? "Document non-conforme aux exigences.",
                        noteInstructeur: "Veuillez fournir une copie numérisée lisible.",
                    )));
                  } else {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => SuiviDossierPage(
                        demande: model,
                    )));
                  }
                }

                return Padding(
                  padding: const EdgeInsets.only(bottom: 14.0),
                  child: GestureDetector(
                    onTap: handleTap,
                    child: _buildDemandeCard(
                      statut: displayStatut,
                      statutColor: statutColor,
                      titre: d.typeDocument,
                      reference: d.reference,
                      date: formattedDate,
                      icon: icon,
                      onTap: handleTap,
                    ),
                  ),
                );
              }).toList(),
            ],
          ),
        ),
      ),
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // CARTE DEMANDE
  // ──────────────────────────────────────────────────────────────────
  Widget _buildDemandeCard({
    required String statut,
    required Color statutColor,
    required String titre,
    required String reference,
    required String date,
    required IconData icon,

    required VoidCallback onTap,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 12,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // LIGNE 1 : badge statut + icône document
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: statutColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  statut,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: statutColor,
                    letterSpacing: 0.6,
                  ),
                ),
              ),
              Icon(icon, color: const Color(0xFFCCCCCC), size: 24),
            ],
          ),
          const SizedBox(height: 12),

          // TITRE DE LA DEMANDE
          Text(
            titre,
            style: GoogleFonts.outfit(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textDark,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 12),

          // RÉFÉRENCE
          Row(
            children: [
              const Icon(
                Icons.fingerprint_rounded,
                color: AppColors.textLight,
                size: 16,
              ),
              const SizedBox(width: 6),
              Flexible(
                child: Text(
                  "Réf: $reference",
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: AppColors.textLight,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // DATE
          Row(
            children: [
              const Icon(
                Icons.calendar_today_outlined,
                color: AppColors.textLight,
                size: 14,
              ),
              const SizedBox(width: 6),
              Flexible(
                child: Text(
                  "Date: $date",
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: AppColors.textLight,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // BOUTON "Voir les détails"
          Align(
            alignment: Alignment.centerRight,
            child: ElevatedButton.icon(
              onPressed: onTap,

              icon: const Icon(Icons.chevron_right_rounded, size: 18),
              iconAlignment: IconAlignment.end,
              label: Text(
                "Voir les détails",
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                elevation: 0,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(999),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
