import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/providers/demande_provider.dart';
import '../../../../core/providers/notification_provider.dart';
import '../../domain/models/document_model.dart';
import 'confirmation_page.dart';

class PaiementPage extends StatefulWidget {
  final DocumentModel document;
  final Map<String, dynamic> formData;
  final Map<String, File> justificatifs;

  const PaiementPage({
    super.key,
    required this.document,
    required this.formData,
    required this.justificatifs,
  });

  @override
  State<PaiementPage> createState() => _PaiementPageState();
}

class _PaiementPageState extends State<PaiementPage> {
  bool _isLoading = false;
  String _selectedPayment = 'orange';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'Finalisation & Paiement',
          style: GoogleFonts.publicSans(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: const Color(0xFF1e293b),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildStepIndicator(),
            const SizedBox(height: 32),
            _buildRecapCard(),
            const SizedBox(height: 32),
            Text(
              'Mode de paiement',
              style: GoogleFonts.publicSans(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF1e293b),
              ),
            ),
            const SizedBox(height: 16),
            _buildPaymentOption(
              id: 'orange',
              label: 'Orange Money',
              image: 'assets/images/om_logo.png', // Assurez-vous que l'image existe ou utilisez une icône
              color: const Color(0xFFff6600),
            ),
            const SizedBox(height: 12),
            _buildPaymentOption(
              id: 'mobi',
              label: 'Moov Money',
              image: 'assets/images/moov_logo.png',
              color: const Color(0xFF0066cc),
            ),
            const SizedBox(height: 32),
            _buildOTPField(),
            const SizedBox(height: 40),
            _buildBottomButtons(),
            const SizedBox(height: 24),
            _buildSecurityNote(),
          ],
        ),
      ),
    );
  }

  Widget _buildStepIndicator() {
    return Row(
      children: [
        _stepCircle('1', true),
        _stepLine(true),
        _stepCircle('2', true),
        _stepLine(true),
        _stepCircle('3', true),
      ],
    );
  }

  Widget _stepCircle(String text, bool active) {
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(
        color: active ? AppColors.primary : const Color(0xFFe2e8f0),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Text(
          text,
          style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _stepLine(bool active) {
    return Expanded(
      child: Container(
        height: 2,
        color: active ? AppColors.primary : const Color(0xFFe2e8f0),
      ),
    );
  }

  Widget _buildRecapCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFf8fafc),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFe2e8f0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.receipt_long_rounded, color: Color(0xFF64748b), size: 20),
              const SizedBox(width: 8),
              Text(
                'Récapitulatif',
                style: GoogleFonts.publicSans(
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF64748b),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _recapRow('Document', widget.document.title),
          _recapRow('Frais de timbre', '500 FCFA'),
          _recapRow('Frais de service', '100 FCFA'),
          const Divider(height: 32),
          _recapRow('TOTAL À PAYER', '600 FCFA', isTotal: true),
        ],
      ),
    );
  }

  Widget _recapRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: isTotal ? const Color(0xFF1e293b) : const Color(0xFF64748b), fontWeight: isTotal ? FontWeight.bold : FontWeight.normal)),
          Text(value, style: TextStyle(fontWeight: FontWeight.bold, color: isTotal ? AppColors.primary : const Color(0xFF1e293b), fontSize: isTotal ? 18 : 14)),
        ],
      ),
    );
  }

  Widget _buildPaymentOption({required String id, required String label, required String image, required Color color}) {
    bool isSelected = _selectedPayment == id;
    return GestureDetector(
      onTap: () => setState(() => _selectedPayment = id),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.05) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? color : const Color(0xFFe2e8f0), width: isSelected ? 2 : 1),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
              child: Icon(Icons.phone_android_rounded, color: color),
            ),
            const SizedBox(width: 16),
            Text(label, style: GoogleFonts.publicSans(fontWeight: FontWeight.bold, color: const Color(0xFF1e293b))),
            const Spacer(),
            if (isSelected) Icon(Icons.check_circle, color: color) else Container(width: 24, height: 24, decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: const Color(0xFFcbd5e1)))),
          ],
        ),
      ),
    );
  }

  Widget _buildOTPField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Code de validation (OTP)',
          style: GoogleFonts.publicSans(fontWeight: FontWeight.bold, color: const Color(0xFF1e293b)),
        ),
        const SizedBox(height: 8),
        TextField(
          decoration: InputDecoration(
            hintText: 'Entrez le code reçu par SMS',
            filled: true,
            fillColor: const Color(0xFFf8fafc),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            contentPadding: const EdgeInsets.all(16),
          ),
          keyboardType: TextInputType.number,
        ),
      ],
    );
  }

  Widget _buildBottomButtons() {
    return Row(
      children: [
        Expanded(
          child: SizedBox(
            height: 56,
            child: OutlinedButton(
              onPressed: () => Navigator.pop(context),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFFcbd5e1)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text('RETOUR', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF64748b))),
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          flex: 2,
          child: SizedBox(
            height: 56,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _handlePaiement,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1e293b),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: _isLoading 
                ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('CONFIRMER LE PAIEMENT', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _handlePaiement() async {
    setState(() => _isLoading = true);
    try {
      final auth = context.read<AuthProvider>();
      final p = context.read<DemandeProvider>();
      
      final res = await p.createDemande(
        token: auth.token ?? 'mock_token',
        documentTypeId: widget.document.id,
        donnees: widget.formData,
        justificatifs: widget.justificatifs,
      );

      if (!mounted) return;

      if (res != null) {
        // Rafraîchir
         context.read<NotificationProvider>().fetchNotifications(auth.token);
         
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => ConfirmationPage(
              document: widget.document,
              reference: res['data']?['reference'] ?? 'CDB-2026-XXXX',
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(p.error ?? 'Erreur lors du paiement')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Widget _buildSecurityNote() {
    return Center(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.shield_outlined, color: Color(0xFF94a3b8), size: 14),
          const SizedBox(width: 6),
          Text(
            'TRANSACTION SÉCURISÉE PAR LE TRÉSOR PUBLIC',
            style: GoogleFonts.publicSans(color: const Color(0xFF94a3b8), fontSize: 10, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}
