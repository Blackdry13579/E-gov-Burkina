import 'package:egov_mobile/features/shared/presentation/widgets/egov_sub_app_bar.dart';
import 'package:egov_mobile/scaffolds/citizen_main_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../home/presentation/pages/home_page.dart';
import '../../domain/models/document_model.dart';

class ConfirmationPage extends StatelessWidget {
  final DocumentModel document;
  final String reference;

  const ConfirmationPage({
    super.key,
    required this.document,
    required this.reference,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFf0f9f4),
      appBar: const EgovSubAppBar(
        title: 'SERVICES PUBLICS',
        subtitle: 'BURKINA FASO',
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 32),
              _buildSuccessIcon(),
              const SizedBox(height: 28),
              _buildSuccessTitle(),
              const SizedBox(height: 32),
              _buildReferenceCard(),
              const SizedBox(height: 28),
              _buildSuivreButton(context),
              const SizedBox(height: 12),
              _buildRetourButton(context),
              const SizedBox(height: 32),
              _buildEmailNote(),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // SUCCESS ICON
  // ──────────────────────────────────────────────────────────────────
  Widget _buildSuccessIcon() {
    return Center(
      child: Container(
        width: 120,
        height: 120,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF16a34a).withOpacity(0.15),
              blurRadius: 24,
              spreadRadius: 4,
            ),
          ],
        ),
        child: Center(
          child: Container(
            width: 80,
            height: 80,
            decoration: const BoxDecoration(
              color: Color(0xFF16a34a),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_rounded,
              color: Colors.white,
              size: 44,
            ),
          ),
        ),
      ),
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // SUCCESS TITLE
  // ──────────────────────────────────────────────────────────────────
  Widget _buildSuccessTitle() {
    return Column(
      children: [
        Text(
          'Demande soumise avec\nsuccès !',
          textAlign: TextAlign.center,
          style: GoogleFonts.publicSans(
            color: const Color(0xFF1e293b),
            fontSize: 26,
            fontWeight: FontWeight.bold,
            height: 1.2,
          ),
        ),
        const SizedBox(height: 14),
        Text(
          'Votre dossier a été transmis avec succès aux services administratifs du Burkina Faso pour traitement.',
          textAlign: TextAlign.center,
          style: GoogleFonts.publicSans(
            color: const Color(0xFF64748b),
            fontSize: 14,
            height: 1.6,
          ),
        ),
      ],
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // REFERENCE CARD
  // ──────────────────────────────────────────────────────────────────
  Widget _buildReferenceCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Reference row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'RÉFÉRENCE DE SUIVI',
                style: GoogleFonts.publicSans(
                  color: const Color(0xFF94a3b8),
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF16a34a).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  reference,
                  style: GoogleFonts.publicSans(
                    color: const Color(0xFF16a34a),
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ).copyWith(fontFamily: 'monospace'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Divider(color: Color(0xFFf0f4f8), height: 1),
          const SizedBox(height: 16),

          // Date de dépôt
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFF16a34a).withOpacity(0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.calendar_today_rounded,
                    color: Color(0xFF16a34a), size: 18),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'DATE DE DÉPÔT',
                    style: GoogleFonts.publicSans(
                      color: const Color(0xFF94a3b8),
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    _getCurrentDateTime(),
                    style: GoogleFonts.publicSans(
                      color: const Color(0xFF1e293b),
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Nature du service
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFF16a34a).withOpacity(0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.description_rounded,
                    color: Color(0xFF16a34a), size: 18),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'NATURE DU SERVICE',
                    style: GoogleFonts.publicSans(
                      color: const Color(0xFF94a3b8),
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    document.title,
                    style: GoogleFonts.publicSans(
                      color: const Color(0xFF1e293b),
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _getCurrentDateTime() {
    final now = DateTime.now();
    return '${now.day} ${_getMonthName(now.month)} ${now.year} - ${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
  }

  String _getMonthName(int month) {
    const months = [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Août',
      'Sep',
      'Oct',
      'Nov',
      'Déc',
    ];
    return months[month - 1];
  }

  // ──────────────────────────────────────────────────────────────────
  // SUIVRE MA DEMANDE BUTTON
  // ──────────────────────────────────────────────────────────────────
  Widget _buildSuivreButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton.icon(
        onPressed: () => Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => const CitizenMainScaffold(initialIndex: 2),
          ),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF16a34a),
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          elevation: 0,
        ),
        icon: const Icon(Icons.track_changes_rounded, size: 22),
        label: Text(
          'Suivre ma demande',
          style: GoogleFonts.publicSans(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ),
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // RETOUR AU TABLEAU DE BORD BUTTON
  // ──────────────────────────────────────────────────────────────────
  Widget _buildRetourButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: OutlinedButton.icon(
        onPressed: () {
          Navigator.pushNamedAndRemoveUntil(
            context,
            HomePage.routeName,
            (route) => false,
          );
        },
        style: OutlinedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: AppColors.primary,
          side: const BorderSide(color: Color(0xFFe2e8f0), width: 1.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
        icon: const Icon(Icons.dashboard_outlined, size: 20),
        label: Text(
          'Retour au tableau de bord',
          style: GoogleFonts.publicSans(
            fontWeight: FontWeight.bold,
            fontSize: 15,
          ),
        ),
      ),
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // EMAIL NOTE
  // ──────────────────────────────────────────────────────────────────
  Widget _buildEmailNote() {
    return Center(
      child: Text(
        'Un email de confirmation contenant votre récapitulatif a été envoyé à votre adresse électronique.',
        textAlign: TextAlign.center,
        style: GoogleFonts.publicSans(
          color: const Color(0xFF94a3b8),
          fontSize: 12,
          height: 1.6,
        ),
      ),
    );
  }
}
