import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../shared/presentation/widgets/citizen_bottom_nav.dart';
import '../../../shared/domain/models/demande_model.dart';

class SuiviDossierPage extends StatelessWidget {
  static const routeName = '/suivi-dossier';

  final DemandeModel demande;

  const SuiviDossierPage({
    super.key,
    required this.demande,
  });

  // Colors
  static const primaryBlue = Color(0xFF1A237E);
  static const accentBlue = Color(0xFF1565C0);
  static const successGreen = Color(0xFF27AE60);
  static const warningOrange = AppColors.warning;
  static const backgroundLight = Color(0xFFF4F6F9);
  static const textPrimary = Color(0xFF1C1C1E);
  static const textSecondary = Color(0xFF8E8E93);
  static const stepPending = Color(0xFFCCCCCC);
  static const statusBg = Color(0xFFFFF3E0);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundLight,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: primaryBlue),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Row(
          children: [
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
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "BURKINA FASO",
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: primaryBlue,
                      letterSpacing: 0.5,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    "Unité · Progrès · Justice",
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      color: textSecondary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          Container(
            width: 36,
            height: 36,
            decoration: const BoxDecoration(
              color: primaryBlue,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.help_outline_rounded,
              color: Colors.white,
              size: 18,
            ),
          ),
          const SizedBox(width: 16),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(
            color: const Color(0xFFEEEEEE),
            height: 1.0,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 24, 16, 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // A. TITRE + BADGE STATUT + RÉFÉRENCE
            Text(
              "Suivi de votre dossier",
              style: GoogleFonts.inter(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: textPrimary,
              ),
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: statusBg,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.chat_bubble_outline_rounded,
                    color: AppColors.warning,
                    size: 16,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    demande.statut.toUpperCase(),
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.warning,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            RichText(
              text: TextSpan(
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: textSecondary,
                ),
                children: [
                  const TextSpan(text: "Référence: "),
                  TextSpan(
                    text: demande.reference,
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: accentBlue,
                    ).copyWith(fontFamily: 'monospace'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // B. CARTE PROGRESSION DE LA DEMANDE
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Progression de la demande",
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: textPrimary,
                    ),
                  ),
                  const SizedBox(height: 20),
                  if (demande.statusHistory.isEmpty)
                    _buildTimelineStep(
                      status: 'active',
                      title: "Demande soumise",
                      date: "Le ${_formatDate(demande.dateSoumission)}",
                      subtitle: "Votre dossier est en attente de traitement.",
                      subtitleColor: textSecondary,
                      badge: "ÉTAPE ACTUELLE",
                      isLast: true,
                    )
                  else
                    ...demande.statusHistory.asMap().entries.map((entry) {
                      final index = entry.key;
                      final h = entry.value;
                      final isLast = index == demande.statusHistory.length - 1;
                      
                      return _buildTimelineStep(
                        status: isLast ? 'active' : 'done',
                        title: _mapActionToTitle(h['action']),
                        date: _formatDateStr(h['date']),
                        subtitle: h['commentaire'] ?? 'Étape complétée',
                        subtitleColor: isLast ? textSecondary : successGreen,
                        badge: isLast ? "ÉTAPE ACTUELLE" : null,
                        isLast: isLast,
                      );
                    }),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // C. SECTION DOCUMENT DÉLIVRÉ
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Document délivré",
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: textPrimary,
                  ),
                ),
                const Icon(
                  Icons.description_outlined,
                  color: textSecondary,
                  size: 22,
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (demande.documentUrl != null)
              _buildDownloadableDocument()
            else
              _buildPendingDocument(),
            const SizedBox(height: 28),

            // D. BOUTON CONTACTER L'ASSISTANCE
            SizedBox(
              width: double.infinity,
              height: 56,
              child: OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.support_agent_rounded, size: 20),
                label: Text(
                  "Contacter l'assistance",
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  foregroundColor: primaryBlue,
                  side: const BorderSide(color: primaryBlue, width: 1.5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),

            // E. FOOTER TEXTE
            Column(
              children: [
                Center(
                  child: Text(
                    "PORTAIL OFFICIEL DES SERVICES DÉMATÉRIALISÉS",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: textSecondary,
                      letterSpacing: 0.6,
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Center(
                  child: Text(
                    "© 2023 Ministère de la Transition Digitale · Burkina Faso",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      color: textSecondary,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      bottomNavigationBar: const CitizenBottomNav(currentIndex: 2),
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // DOCUMENT WIDGETS
  // ──────────────────────────────────────────────────────────────────
  Widget _buildPendingDocument() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFEEEEEE), width: 1),
      ),
      child: Column(
        children: [
          const Icon(
            Icons.hourglass_empty_rounded,
            color: stepPending,
            size: 40,
          ),
          const SizedBox(height: 16),
          Text(
            "Le document sera disponible au téléchargement après la phase de validation.",
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(
              fontSize: 13,
              color: textSecondary,
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDownloadableDocument() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: successGreen.withOpacity(0.2), width: 1.5),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: successGreen.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.picture_as_pdf_rounded, color: successGreen, size: 32),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Document disponible",
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                    color: textPrimary,
                  ),
                ),
                Text(
                  "Prêt pour téléchargement",
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: textSecondary,
                  ),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () {
              // Action de téléchargement (simulée avec l'URL Cloudinary)
              debugPrint("Lancement du téléchargement : ${demande.documentUrl}");
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: primaryBlue,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              elevation: 0,
            ),
            child: const Text("TÉLÉCHARGER", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────────────────────────
  String _mapActionToTitle(String? action) {
    switch (action) {
      case 'CREATION': return "Demande soumise";
      case 'PAIEMENT': return "Paiement confirmé";
      case 'PRISE_EN_CHARGE': return "En cours d'examen";
      case 'VALIDATION': return "Dossier validé";
      case 'REJET': return "Dossier rejeté";
      case 'DEMANDE_COMPLEMENT': return "Documents manquants";
      case 'COMPLEMENT_FOURNI': return "Compléments reçus";
      default: return action ?? "Étape inconnue";
    }
  }

  String _formatDate(DateTime date) {
    return "${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year} à ${date.hour}:${date.minute.toString().padLeft(2, '0')}";
  }

  String _formatDateStr(String? dateStr) {
    if (dateStr == null) return "...";
    try {
      final dt = DateTime.parse(dateStr);
      return "Le ${_formatDate(dt)}";
    } catch (_) {
      return dateStr;
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // TIMELINE STEP
  // ──────────────────────────────────────────────────────────────────
  Widget _buildTimelineStep({
    required String status,
    required String title,
    String? date,
    required String subtitle,
    required Color subtitleColor,
    String? badge,
    required bool isLast,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // COLONNE GAUCHE : cercle + ligne verticale
          Column(
            children: [
              // Cercle selon statut
              if (status == 'done')
                Container(
                  width: 28,
                  height: 28,
                  decoration: const BoxDecoration(
                    color: successGreen,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_rounded,
                    color: Colors.white,
                    size: 16,
                  ),
                )
              else if (status == 'active')
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: primaryBlue, width: 3),
                    color: Colors.white,
                  ),
                  child: Center(
                    child: Container(
                      width: 10,
                      height: 10,
                      decoration: const BoxDecoration(
                        color: primaryBlue,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                )
              else // pending
                Container(
                  width: 28,
                  height: 28,
                  decoration: const BoxDecoration(
                    color: stepPending,
                    shape: BoxShape.circle,
                  ),
                ),

              // Ligne verticale (sauf dernier)
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: status == 'done'
                        ? successGreen.withOpacity(0.3)
                        : stepPending.withOpacity(0.4),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 14),

          // COLONNE DROITE : texte
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Titre
                  Text(
                    title,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight:
                          status == 'active' ? FontWeight.w700 : FontWeight.w600,
                      color: status == 'pending' ? textSecondary : textPrimary,
                    ),
                  ),

                  // Date
                  if (date != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      date,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: textSecondary,
                      ),
                    ),
                  ],

                  const SizedBox(height: 4),

                  // Sous-titre
                  Text(
                    subtitle,
                    style: status == 'active'
                        ? GoogleFonts.inter(
                            fontSize: 13,
                            fontStyle: FontStyle.italic,
                            color: textSecondary,
                          )
                        : GoogleFonts.inter(
                            fontSize: 12,
                            color: subtitleColor,
                          ),
                  ),

                  // Badge "ÉTAPE ACTUELLE"
                  if (badge != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      badge,
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: primaryBlue,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
