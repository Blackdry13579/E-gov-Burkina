import 'dart:io';
import 'package:egov_mobile/features/shared/presentation/widgets/egov_sub_app_bar.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';





import '../../../../core/constants/app_colors.dart';
import '../../domain/models/document_model.dart';
import 'paiement_page.dart';

class FormulaireEtape2Page extends StatefulWidget {
  final DocumentModel document;
  final Map<String, String> etape1Data;

  const FormulaireEtape2Page({
    super.key,
    required this.document,
    required this.etape1Data,
  });

  @override
  State<FormulaireEtape2Page> createState() => _FormulaireEtape2PageState();
}

class _FormulaireEtape2PageState extends State<FormulaireEtape2Page> {
  // Map pour suivre les fichiers réels uploadés pour chaque document requis
  final Map<String, File?> _uploadedFiles = {};

  @override
  void initState() {
    super.initState();
    // Initialiser la map avec les documents requis
    for (var docName in widget.document.requiredDocs) {
      _uploadedFiles[docName] = null;
    }
  }

  // Utilisation de FilePicker pour sélectionner de vrais fichiers
  Future<void> _pickFile(String docName) async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
      );

      if (result != null && result.files.single.path != null) {
        File file = File(result.files.single.path!);
        
        setState(() {
          _uploadedFiles[docName] = file;
        });

        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Document "$docName" sélectionné.'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erreur lors de la sélection : ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }




  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFf0f4f8),
      appBar: const EgovSubAppBar(
        title: 'SERVICES PUBLICS',
        subtitle: 'BURKINA FASO',
      ),
      body: Column(
        children: [
          _buildStepIndicator(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeader(),
                  const SizedBox(height: 24),
                  if (widget.document.requiredDocs.isEmpty)
                    _buildNoDocsRequired()
                  else
                    ...widget.document.requiredDocs.map((docName) => Padding(
                          padding: const EdgeInsets.only(bottom: 24),
                          child: _buildDynamicDocumentSection(docName),
                        )),
                  const SizedBox(height: 32),
                  _buildBottomButtons(),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNoDocsRequired() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFe2e8f0)),
      ),
      child: Center(
        child: Column(
          children: [
            const Icon(Icons.check_circle_outline_rounded, color: Color(0xFF16a34a), size: 48),
            const SizedBox(height: 16),
            Text(
              'Aucun document justificatif requis pour ce service.',
              textAlign: TextAlign.center,
              style: GoogleFonts.publicSans(
                color: const Color(0xFF1e293b),
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDynamicDocumentSection(String docName) {
    File? file = _uploadedFiles[docName];
    bool isUploaded = file != null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          docName,
          style: GoogleFonts.publicSans(
            color: const Color(0xFF1e293b),
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 12),
        if (isUploaded)
          _buildUploadedFile(
            fileName: file.path.split('/').last,
            onDelete: () => setState(() {
              _uploadedFiles[docName] = null;
            }),
          )
        else
          _buildUploadZone(
            label: 'Ajouter le scan de : $docName',
            hint: 'PNG, JPG ou PDF (Max. 5Mo)',
            icon: Icons.cloud_upload_rounded,
            onTap: () => _pickFile(docName),
          ),
      ],
    );
  }

  Widget _buildStepIndicator() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        children: [
          _buildStep(number: '1', label: 'INFOS', isActive: false, isCompleted: true),
          _buildStepLine(isActive: true),
          _buildStep(number: '2', label: 'DOCUMENTS', isActive: true, isCompleted: false),
          _buildStepLine(isActive: false),
          _buildStep(number: '3', label: 'PAIEMENT', isActive: false, isCompleted: false),
        ],
      ),
    );
  }

  Widget _buildStep({
    required String number,
    required String label,
    required bool isActive,
    required bool isCompleted,
  }) {
    return Column(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: isCompleted
                ? const Color(0xFF16a34a)
                : isActive
                    ? AppColors.primary
                    : const Color(0xFFe2e8f0),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: isCompleted
                ? const Icon(Icons.check_rounded, color: Colors.white, size: 20)
                : Text(
                    number,
                    style: GoogleFonts.publicSans(
                      color: isActive ? Colors.white : const Color(0xFF94a3b8),
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: GoogleFonts.publicSans(
            color: isActive || isCompleted
                ? AppColors.primary
                : const Color(0xFF94a3b8),
            fontSize: 11,
            fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
            letterSpacing: 0.5,
          ),
        ),
      ],
    );
  }

  Widget _buildStepLine({required bool isActive}) {
    return Expanded(
      child: Container(
        height: 2,
        margin: const EdgeInsets.only(bottom: 20),
        color: isActive ? AppColors.primary : const Color(0xFFe2e8f0),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Télécharger les documents',
          style: GoogleFonts.publicSans(
            color: const Color(0xFF1e293b),
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Veuillez fournir les scans originaux pour validation.',
          style: GoogleFonts.publicSans(
            color: const Color(0xFF64748b),
            fontSize: 13,
            height: 1.5,
          ),
        ),
      ],
    );
  }

  Widget _buildBottomButtons() {
    return Row(
      children: [
        Expanded(
          flex: 1,
          child: SizedBox(
            height: 52,
            child: OutlinedButton(
              onPressed: () => Navigator.pop(context),
              style: OutlinedButton.styleFrom(
                foregroundColor: const Color(0xFF475569),
                side: const BorderSide(color: Color(0xFFcbd5e1), width: 1.5),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                backgroundColor: const Color(0xFFf1f5f9),
              ),
              child: const FittedBox(
                fit: BoxFit.scaleDown,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.arrow_back_rounded, size: 18),
                    SizedBox(width: 6),
                    Text('Retour', style: TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          flex: 2,
          child: SizedBox(
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                bool allUploaded = _uploadedFiles.values.every((v) => v != null);
                if (!allUploaded) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Veuillez charger tous les documents requis.')),
                  );
                  return;
                }

                // Collecte des fichiers réels
                final Map<String, File> justificatifs = {};
                _uploadedFiles.forEach((key, value) {
                  if (value != null) justificatifs[key] = value;
                });

                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => PaiementPage(
                      document: widget.document,
                      formData: widget.etape1Data,
                      justificatifs: justificatifs,
                    ),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const FittedBox(
                fit: BoxFit.scaleDown,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Suivant', style: TextStyle(fontWeight: FontWeight.bold)),
                    SizedBox(width: 8),
                    Icon(Icons.arrow_forward_rounded, size: 20),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildUploadedFile({required String fileName, required VoidCallback onDelete}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF16a34a).withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: const Color(0xFF16a34a).withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.image_rounded, color: Color(0xFF16a34a), size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(fileName, style: GoogleFonts.publicSans(color: const Color(0xFF1e293b), fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                const Text('Chargé avec succès', style: TextStyle(color: Color(0xFF16a34a), fontSize: 12)),
              ],
            ),
          ),
          IconButton(icon: const Icon(Icons.delete_outline_rounded), onPressed: onDelete),
        ],
      ),
    );
  }

  Widget _buildUploadZone({required String label, required String hint, required IconData icon, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 20),
        decoration: BoxDecoration(
          color: const Color(0xFFf8fafc),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFcbd5e1), width: 1.5),
        ),
        child: Column(
          children: [
            Container(width: 52, height: 52, decoration: const BoxDecoration(color: Color(0xFFe2e8f0), shape: BoxShape.circle), child: Icon(icon, color: const Color(0xFF94a3b8), size: 26)),
            const SizedBox(height: 12),
            Text(label, style: GoogleFonts.publicSans(color: AppColors.primary, fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text(hint, style: GoogleFonts.publicSans(color: const Color(0xFF94a3b8), fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
