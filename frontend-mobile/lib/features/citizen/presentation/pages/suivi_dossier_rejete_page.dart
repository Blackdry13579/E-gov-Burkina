import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../shared/presentation/widgets/citizen_bottom_nav.dart';
class SuiviDossierRejetePage extends StatelessWidget {
  static const routeName = '/suivi-dossier-rejete';

  final String reference;
  final String titreDemande;
  final String dateDepot;
  final String direction;
  final String motifRejet;
  final String noteInstructeur;

  const SuiviDossierRejetePage({
    super.key,
    required this.reference,
    required this.titreDemande,
    required this.dateDepot,
    required this.direction,
    required this.motifRejet,
    required this.noteInstructeur,
  });

  // Colors
  static const primaryBlue = Color(0xFF1A237E);
  static const accentBlue = Color(0xFF1565C0);
  static const successGreen = Color(0xFF27AE60);
  static const errorRed = Color(0xFFE74C3C);
  static const darkRed = Color(0xFF8B1A1A);
  static const backgroundLight = Color(0xFFF4F6F9);
  static const textPrimary = Color(0xFF1C1C1E);
  static const textSecondary = Color(0xFF8E8E93);
  static const cardMotifBg = Color(0xFFF5F5F5);

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
            size: 26,
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          "E-Gov Burkina",
          style: GoogleFonts.inter(
            fontSize: 17,
            fontWeight: FontWeight.w700,
            color: primaryBlue,
          ),
        ),
        actions: [
          Container(
            width: 42,
            height: 42,
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
                  size: 24,
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(
            color: const Color(0xFFDDDDDD),
            height: 1.0,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 24, 16, 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // A. EN-TÊTE DOSSIER
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: errorRed.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.error_outline_rounded,
                    color: errorRed,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "NUMÉRO DE SUIVI: $reference",
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: textSecondary,
                          letterSpacing: 0.8,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        titreDemande,
                        style: GoogleFonts.inter(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: primaryBlue,
                          height: 1.2,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Badge "Dossier Rejeté"
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: darkRed,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                "Dossier Rejeté",
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // B. CARTE MOTIF DU REJET
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: cardMotifBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE0E0E0), width: 1),
              ),
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  // Filigrane "REJETÉ"
                  Positioned(
                    right: -10,
                    top: 20,
                    child: Transform.rotate(
                      angle: -0.4,
                      child: Text(
                        "REJETÉ",
                        style: GoogleFonts.inter(
                          fontSize: 38,
                          fontWeight: FontWeight.w900,
                          color: errorRed.withOpacity(0.06),
                          letterSpacing: 4,
                        ),
                      ),
                    ),
                  ),

                  // Contenu par-dessus
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.info_outline_rounded,
                            color: textSecondary,
                            size: 16,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            "MOTIF DU REJET",
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: textSecondary,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      RichText(
                        text: TextSpan(
                          style: GoogleFonts.inter(
                            fontSize: 15,
                            color: textPrimary,
                            height: 1.6,
                          ),
                          children: [
                            const TextSpan(
                              text:
                                  "Votre demande a été examinée par les services compétents. Malheureusement, le document ",
                            ),
                            TextSpan(
                              text: '"$motifRejet"',
                              style: GoogleFonts.inter(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: accentBlue,
                              ),
                            ),
                            const TextSpan(
                              text: " fourni est illisible ou expiré.",
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Divider(color: Color(0xFFDDDDDD), height: 1),
                      const SizedBox(height: 14),
                      Text(
                        'Note de l\'instructeur: "$noteInstructeur"',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontStyle: FontStyle.italic,
                          color: textSecondary,
                          height: 1.6,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // C. ROW 2 INFOS
            Row(
              children: [
                Expanded(
                  child: _buildInfoBox(
                    icon: Icons.calendar_today_outlined,
                    label: "DATE DE DÉPÔT",
                    value: dateDepot,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildInfoBox(
                    icon: Icons.account_balance_rounded,
                    label: "DIRECTION",
                    value: direction,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),

            // D. BOUTON
            SizedBox(
              width: double.infinity,
              height: 60,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).pushNamed('/citizen-catalogue');
                },
                icon: const Icon(Icons.add_circle_outline_rounded, size: 22),
                label: Text(
                  "Soumettre une nouvelle demande",
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: successGreen,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // E. LIEN ASSISTANCE
            Center(
              child: GestureDetector(
                onTap: () {},
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.help_outline_rounded,
                      color: textSecondary,
                      size: 18,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      "Contacter l'assistance",
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: textSecondary,
                      ),
                    ),
                  ],
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
  // INFO BOX
  // ──────────────────────────────────────────────────────────────────
  Widget _buildInfoBox({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Container(
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: primaryBlue, size: 22),
          const SizedBox(height: 8),
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: textSecondary,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: primaryBlue,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
