import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../shared/domain/models/demande_model.dart';
import '../../../../core/constants/app_colors.dart';

class AgentRejectionSuccessPage extends StatelessWidget {
  final DemandeModel demande;
  final String motifRejet;

  const AgentRejectionSuccessPage({
    super.key,
    required this.demande,
    required this.motifRejet,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFf5f5f5),
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
              _buildRejectionIcon(),
              const SizedBox(height: 28),
              _buildRejectionTitle(),
              const SizedBox(height: 32),
              _buildMotifCard(),
              const SizedBox(height: 32),
              _buildRetourButton(context),
              const SizedBox(height: 16),
              _buildConsulterButton(context),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRejectionIcon() {
    return Center(
      child: Container(
        width: 100,
        height: 100,
        decoration: const BoxDecoration(
          color: Color(0xFFe5e7eb),
          shape: BoxShape.circle,
        ),
        child: Center(
          child: Container(
            width: 72,
            height: 72,
            decoration: const BoxDecoration(
              color: Color(0xFF991b1b),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.close_rounded,
              color: Colors.white,
              size: 40,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRejectionTitle() {
    return Column(
      children: [
        Text(
          'Demande Rejetée',
          textAlign: TextAlign.center,
          style: GoogleFonts.publicSans(
            color: const Color(0xFF1e293b),
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          'La décision a été enregistrée avec succès dans le système national.',
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

  Widget _buildMotifCard() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: const Border(
          left: BorderSide(
            color: Color(0xFF991b1b),
            width: 4,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'MOTIF DU REJET',
              style: GoogleFonts.publicSans(
                color: const Color(0xFF94a3b8),
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 14),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFf8fafc),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                '"$motifRejet"',
                style: GoogleFonts.publicSans(
                  color: const Color(0xFF1e293b),
                  fontSize: 14,
                  height: 1.7,
                ),
              ),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                const Icon(
                  Icons.calendar_today_outlined,
                  color: Color(0xFF94a3b8),
                  size: 14,
                ),
                const SizedBox(width: 6),
                Text(
                  'Enregistré le ${_getCurrentDateTime()}',
                  style: GoogleFonts.publicSans(
                    color: const Color(0xFF94a3b8),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ],
        ),
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
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          elevation: 0,
        ),
        icon: const Icon(Icons.arrow_back_rounded, size: 20),
        label: Text(
          'Retour à la liste',
          style: GoogleFonts.publicSans(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ),
    );
  }

  Widget _buildConsulterButton(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.pop(context),
      child: Center(
        child: Text(
          'Consulter les détails du dossier',
          style: GoogleFonts.publicSans(
            color: const Color(0xFF1e293b),
            fontSize: 15,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  String _getCurrentDateTime() {
    final now = DateTime.now();
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ];
    return '${now.day} ${months[now.month - 1]} ${now.year} à ${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
  }

  String _getInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }
}
