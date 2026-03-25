import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/presentation/widgets/citizen_bottom_nav.dart';
import 'package:url_launcher/url_launcher.dart';


class DossierApprouvePage extends StatelessWidget {
  static const routeName = '/dossier-approuve';

  final String reference;
  final String nomFichier;
  final String tailleFichier;
  final String delivrePar;
  final String validite;
  final String? documentUrl;

  const DossierApprouvePage({
    super.key,
    required this.reference,
    required this.nomFichier,
    required this.tailleFichier,
    required this.delivrePar,
    required this.validite,
    this.documentUrl,
  });

  // Colors
  static const primaryBlue = Color(0xFF1A237E);
  static const successGreen = Color(0xFF27AE60);
  static const successGreenBg = Color(0xFFE8F5E9);
  static const successGreenFg = Color(0xFF1B5E20);
  static const iconDocBg = Color(0xFFE8EAF6);
  static const backgroundLight = Color(0xFFF4F6F9);
  static const textPrimary = Color(0xFF1C1C1E);
  static const textSecondary = Color(0xFF8E8E93);
  static const labelGray = Color(0xFF9E9E9E);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundLight,
      appBar: AppBar(
        backgroundColor: backgroundLight,
        elevation: 0,
        leadingWidth: 50,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_rounded,
            color: primaryBlue,
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          "Dossier #$reference",
          style: GoogleFonts.inter(
            fontSize: 17,
            fontWeight: FontWeight.w700,
            color: primaryBlue,
          ),
        ),
        actions: [
          Container(
            width: 40,
            height: 40,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Color(0xFFDDDDDD),
            ),
            child: ClipOval(
              child: Image.asset(
                'assets/images/citizen_avatar.png',
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const Icon(
                  Icons.person,
                  color: Colors.white,
                  size: 22,
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // A. BANNER "DOSSIER APPROUVÉ"
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: successGreenBg,
                borderRadius: BorderRadius.circular(18),
              ),
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  // Filigrane check en fond droite
                  Positioned(
                    right: -10,
                    top: -10,
                    child: Icon(
                      Icons.check_circle_rounded,
                      color: successGreen.withOpacity(0.15),
                      size: 100,
                    ),
                  ),

                  // Contenu
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Dossier Approuvé",
                        style: GoogleFonts.inter(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          color: successGreenFg,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "Félicitations ! Votre demande a été traitée et validée par les services compétents.",
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: successGreen,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 28),

            // B. SECTION "PROGRESSION DU DOSSIER"
            Text(
              "PROGRESSION DU DOSSIER",
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: textSecondary,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 16),

            // Timeline 3 étapes
            _buildTimelineStep(
              title: "Dépôt du dossier",
              date: "12 Octobre 2023 • 09:15",
              isLast: false,
              isActive: false,
            ),
            _buildTimelineStep(
              title: "Examen technique",
              date: "14 Octobre 2023 • 14:30",
              isLast: false,
              isActive: false,
            ),
            _buildTimelineStep(
              title: "Approbation finale",
              date: "Aujourd'hui • 10:45",
              isLast: true,
              isActive: true,
            ),
            const SizedBox(height: 28),

            // C. SECTION "DOCUMENT GÉNÉRÉ"
            Text(
              "DOCUMENT GÉNÉRÉ",
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: textSecondary,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 12),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Icône PDF
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: iconDocBg,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.description_rounded,
                      color: primaryBlue,
                      size: 26,
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Nom + taille
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          nomFichier,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: textPrimary,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          "$tailleFichier • PDF DOCUMENT",
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            color: textSecondary,
                            letterSpacing: 0.3,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Bouton télécharger
                  GestureDetector(
                    onTap: () async {
                      if (documentUrl != null && documentUrl!.isNotEmpty) {
                        final uri = Uri.parse(documentUrl!);
                        if (await canLaunchUrl(uri)) {
                          await launchUrl(uri, mode: LaunchMode.externalApplication);
                        }
                      }
                    },
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: const BoxDecoration(
                        color: primaryBlue,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.download_rounded,
                        color: Colors.white,
                        size: 22,
                      ),
                    ),
                  ),

                ],
              ),
            ),
            const SizedBox(height: 20),

            // D. ROW DÉLIVRÉ PAR + VALIDITÉ
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Colonne DÉLIVRÉ PAR
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "DÉLIVRÉ PAR",
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: labelGray,
                            letterSpacing: 0.8,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          delivrePar,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: textPrimary,
                            height: 1.3,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),

                  // Séparateur vertical
                  Container(
                    width: 1,
                    height: 50,
                    color: const Color(0xFFEEEEEE),
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                  ),

                  // Colonne VALIDITÉ
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "VALIDITÉ",
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: labelGray,
                            letterSpacing: 0.8,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          validite,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: textPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // E. BOUTON Voir mon document
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                onPressed: () async {
                  if (documentUrl != null && documentUrl!.isNotEmpty) {
                    final uri = Uri.parse(documentUrl!);
                    if (await canLaunchUrl(uri)) {
                      await launchUrl(uri, mode: LaunchMode.externalApplication);
                    }
                  }
                },
                iconAlignment: IconAlignment.end,
                icon: const Icon(Icons.print_rounded, size: 20),
                label: Text(
                  documentUrl != null && documentUrl!.isNotEmpty ? "Télécharger mon document (PDF)" : "Génération PDF en attente...",
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryBlue,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: const CitizenBottomNav(currentIndex: 2),
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // TIMELINE STEP
  // ──────────────────────────────────────────────────────────────────
  Widget _buildTimelineStep({
    required String title,
    required String date,
    required bool isLast,
    required bool isActive,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Colonne gauche : cercle vert + ligne
          Column(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: successGreen,
                  shape: BoxShape.circle,
                  boxShadow: isActive
                      ? [
                          BoxShadow(
                            color: successGreen.withOpacity(0.4),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          )
                        ]
                      : null,
                ),
                child: const Icon(
                  Icons.check_rounded,
                  color: Colors.white,
                  size: 18,
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    decoration: BoxDecoration(
                      color: successGreen.withOpacity(0.4),
                      borderRadius: BorderRadius.circular(1),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 12),

          // Colonne droite : titre + date
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.inter(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: isActive ? successGreen : textPrimary,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    date,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
