import 'package:egov_mobile/features/shared/presentation/widgets/egov_sub_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_colors.dart';
import '../../domain/models/document_model.dart';
import 'formulaire_etape2_page.dart';

class FormulaireEtape1Page extends StatefulWidget {
  final DocumentModel document;

  const FormulaireEtape1Page({super.key, required this.document});

  @override
  State<FormulaireEtape1Page> createState() => _FormulaireEtape1PageState();
}

class _FormulaireEtape1PageState extends State<FormulaireEtape1Page> {
  final _formKey = GlobalKey<FormState>();

  final _nomController = TextEditingController();
  final _prenomController = TextEditingController();
  final _dateNaissanceController = TextEditingController();
  final _lieuNaissanceController = TextEditingController();
  final _nomPereController = TextEditingController();
  final _nomMereController = TextEditingController();
  String _sexe = 'Masculin';

  @override
  void dispose() {
    _nomController.dispose();
    _prenomController.dispose();
    _dateNaissanceController.dispose();
    _lieuNaissanceController.dispose();
    _nomPereController.dispose();
    _nomMereController.dispose();
    super.dispose();
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
          _buildProgressBar(),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  _buildForm(),
                  _buildSuivantButton(),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // STEP INDICATOR
  // ──────────────────────────────────────────────────────────────────
  Widget _buildStepIndicator() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        children: [
          _buildStep(number: '1', label: 'INFOS', isActive: true),
          _buildStepLine(isActive: false),
          _buildStep(number: '2', label: 'DOCUMENTS', isActive: false),
          _buildStepLine(isActive: false),
          _buildStep(number: '3', label: 'PAIEMENT', isActive: false),
        ],
      ),
    );
  }

  Widget _buildStep({
    required String number,
    required String label,
    required bool isActive,
  }) {
    return Column(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: isActive ? AppColors.primary : const Color(0xFFe2e8f0),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
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
            color: isActive ? AppColors.primary : const Color(0xFF94a3b8),
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

  // ──────────────────────────────────────────────────────────────────
  // PROGRESS BAR
  // ──────────────────────────────────────────────────────────────────
  Widget _buildProgressBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Étape 1: Informations Personnelles',
                  style: GoogleFonts.publicSans(
                    color: const Color(0xFF1e293b),
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Text(
                '33% complété',
                style: GoogleFonts.publicSans(
                  color: const Color(0xFF64748b),
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: const LinearProgressIndicator(
              value: 0.33,
              backgroundColor: Color(0xFFe2e8f0),
              valueColor: AlwaysStoppedAnimation(AppColors.primary),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // FORM
  // ──────────────────────────────────────────────────────────────────
  Widget _buildForm() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            _buildField(
              label: 'Nom de naissance',
              hint: 'Entrez votre nom',
              controller: _nomController,
              validator: (v) => v!.isEmpty ? 'Champ requis' : null,
            ),
            const SizedBox(height: 16),
            _buildField(
              label: 'Prénom(s)',
              hint: 'Entrez vos prénoms',
              controller: _prenomController,
              validator: (v) => v!.isEmpty ? 'Champ requis' : null,
            ),
            const SizedBox(height: 16),
            _buildSexeField(),
            const SizedBox(height: 16),
            _buildDateField(),
            const SizedBox(height: 16),
            _buildField(
              label: 'Lieu de naissance',
              hint: 'Ville ou commune',
              controller: _lieuNaissanceController,
              validator: (v) => v!.isEmpty ? 'Champ requis' : null,
            ),
            const SizedBox(height: 16),
            _buildField(
              label: 'Nom du père',
              hint: 'Nom complet du père',
              controller: _nomPereController,
            ),
            const SizedBox(height: 16),
            _buildField(
              label: 'Nom de la mère',
              hint: 'Nom complet de la mère',
              controller: _nomMereController,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField({
    required String label,
    required String hint,
    required TextEditingController controller,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.publicSans(
            color: const Color(0xFF1e293b),
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          validator: validator,
          style: GoogleFonts.publicSans(
            color: const Color(0xFF1e293b),
            fontSize: 14,
          ),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: GoogleFonts.publicSans(
              color: const Color(0xFFcbd5e1),
              fontSize: 14,
            ),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 16,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFe2e8f0)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFe2e8f0)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(
                color: AppColors.primary,
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFdc2626)),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDateField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Date de naissance',
          style: GoogleFonts.publicSans(
            color: const Color(0xFF1e293b),
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: _dateNaissanceController,
          readOnly: true,
          onTap: () async {
            final date = await showDatePicker(
              context: context,
              initialDate: DateTime(1990),
              firstDate: DateTime(1900),
              lastDate: DateTime.now(),
              builder: (context, child) {
                return Theme(
                  data: Theme.of(context).copyWith(
                    colorScheme: const ColorScheme.light(
                      primary: AppColors.primary,
                    ),
                  ),
                  child: child!,
                );
              },
            );
            if (date != null) {
              _dateNaissanceController.text =
                  '${date.day.toString().padLeft(2, '0')}/'
                  '${date.month.toString().padLeft(2, '0')}/'
                  '${date.year}';
            }
          },
          style: GoogleFonts.publicSans(
            color: const Color(0xFF1e293b),
            fontSize: 14,
          ),
          decoration: InputDecoration(
            hintText: 'JJ/MM/AAAA',
            hintStyle: GoogleFonts.publicSans(
              color: const Color(0xFFcbd5e1),
              fontSize: 14,
            ),
            suffixIcon: const Icon(
              Icons.calendar_today_rounded,
              color: Color(0xFF94a3b8),
              size: 20,
            ),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 16,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFe2e8f0)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFe2e8f0)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(
                color: AppColors.primary,
                width: 2,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSexeField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Genre / Sexe',
          style: GoogleFonts.publicSans(
            color: const Color(0xFF1e293b),
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          initialValue: _sexe,
          onChanged: (v) => setState(() => _sexe = v!),
          items: ['Masculin', 'Féminin']
              .map((s) => DropdownMenuItem(value: s, child: Text(s)))
              .toList(),
          style: GoogleFonts.publicSans(
            color: const Color(0xFF1e293b),
            fontSize: 14,
          ),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 16,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFe2e8f0)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFe2e8f0)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(
                color: AppColors.primary,
                width: 2,
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // SUIVANT BUTTON
  // ──────────────────────────────────────────────────────────────────
  Widget _buildSuivantButton() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: SizedBox(
        width: double.infinity,
        height: 56,
        child: ElevatedButton(
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              final etape1Data = {
                'nom': _nomController.text,
                'prenom': _prenomController.text,
                'genre': _sexe,
                'dateNaissance': _dateNaissanceController.text,
                'lieuNaissance': _lieuNaissanceController.text,
                'nomPere': _nomPereController.text,
                'nomMere': _nomMereController.text,
              };
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => FormulaireEtape2Page(
                    document: widget.document,
                    etape1Data: etape1Data,
                  ),
                ),
              );
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            elevation: 0,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Suivant',
                style: GoogleFonts.publicSans(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(width: 8),
              const Icon(Icons.arrow_forward_rounded, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}
