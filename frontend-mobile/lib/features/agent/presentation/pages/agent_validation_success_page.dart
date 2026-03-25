import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../shared/domain/models/demande_model.dart';
import '../../../../core/constants/app_colors.dart';

class AgentValidationSuccessPage extends StatelessWidget {
  final DemandeModel demande;

  const AgentValidationSuccessPage({
    super.key,
    required this.demande,
  });

  static const Color _successGreen = Color(0xFF16a34a);
  static const Color _bgGreenTint = Color(0xFFf0f9f4);

  String _getInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : 'A';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgGreenTint,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        automaticallyImplyLeading: false,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            height: 1,
            color: AppColors.primary.withOpacity(0.1),
          ),
        ),
        title: Row(
          children: [
            const Icon(
              Icons.account_balance_rounded,
              color: AppColors.primary,
              size: 22,
            ),
            const SizedBox(width: 10),
            Text(
              'Portail Agent',
              style: GoogleFonts.publicSans(
                color: AppColors.primary,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: CircleAvatar(
              radius: 20,
              backgroundColor: AppColors.primary.withOpacity(0.1),
              child: Text(
                _getInitials(demande.agentNom ?? 'Agent'),
                style: GoogleFonts.publicSans(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
          ),
        ],
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
              _buildRecapCard(),
              const SizedBox(height: 16),
              _buildSMSNote(),
              const SizedBox(height: 32),
              _buildRetourButton(context),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSuccessIcon() {
    return Center(
      child: Container(
        width: 96,
        height: 96,
        decoration: BoxDecoration(
          color: _successGreen,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: _successGreen.withOpacity(0.3),
              blurRadius: 24,
              spreadRadius: 4,
            ),
          ],
        ),
        child: const Icon(
          Icons.check_rounded,
          color: Colors.white,
          size: 52,
        ),
      ),
    );
  }

  Widget _buildSuccessTitle() {
    return Column(
      children: [
        Text(
          'Demande Validée avec\nSuccès',
          textAlign: TextAlign.center,
          style: GoogleFonts.publicSans(
            color: AppColors.primary,
            fontSize: 26,
            fontWeight: FontWeight.bold,
            height: 1.2,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          'L\'enregistrement a été mis à jour dans la base de données nationale.',
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

  Widget _buildRecapCard() {
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'RÉCAPITULATIF DOSSIER',
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
                  color: _successGreen,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  'APPROUVÉ',
                  style: GoogleFonts.publicSans(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.8,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Divider(color: Color(0xFFf0f4f8), height: 1),
          const SizedBox(height: 16),
          _buildInfoRow(
            icon: Icons.fingerprint_rounded,
            label: 'Numéro de Référence',
            value: demande.reference,
            valueColor: AppColors.primary,
            isBold: true,
            isMonospace: true,
          ),
          const SizedBox(height: 16),
          _buildInfoRow(
            icon: Icons.person_rounded,
            label: 'Citoyen',
            value: demande.citoyenNom,
            valueColor: const Color(0xFF1e293b),
            isBold: true,
          ),
          const SizedBox(height: 16),
          _buildInfoRow(
            icon: Icons.description_rounded,
            label: 'Type de Demande',
            value: demande.typeDocument,
            valueColor: const Color(0xFF1e293b),
            isBold: true,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String label,
    required String value,
    required Color valueColor,
    bool isBold = false,
    bool isMonospace = false,
  }) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.08),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: AppColors.primary, size: 20),
        ),
        const SizedBox(width: 14),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: GoogleFonts.publicSans(
                color: const Color(0xFF94a3b8),
                fontSize: 12,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: isMonospace
                  ? TextStyle(
                      color: valueColor,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'monospace',
                    )
                  : GoogleFonts.publicSans(
                      color: valueColor,
                      fontSize: 15,
                      fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
                    ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSMSNote() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.06),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.info_rounded, color: AppColors.primary, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Un SMS de confirmation a été envoyé automatiquement au citoyen.',
              style: GoogleFonts.publicSans(
                color: AppColors.primary,
                fontSize: 13,
                height: 1.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRetourButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton.icon(
        onPressed: () {
          Navigator.pushNamedAndRemoveUntil(
            context,
            '/agent-main', // AgentMainScaffold.routeName
            (route) => false,
          );
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: _successGreen,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          elevation: 0,
        ),
        icon: const Icon(Icons.arrow_back_rounded, size: 20),
        label: Text(
          'Retour à la liste',
          style: GoogleFonts.publicSans(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
    );
  }
}
