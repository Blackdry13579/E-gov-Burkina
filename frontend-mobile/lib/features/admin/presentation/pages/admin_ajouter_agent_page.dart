import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

const _kNavy   = Color(0xFF1a237e);
const _kBg     = Color(0xFFf0f4f8);
const _kText   = Color(0xFF475569);
const _kBorder = Color(0xFFe2e8f0);

class AdminAjouterAgentPage extends StatefulWidget {
  const AdminAjouterAgentPage({super.key});

  @override
  State<AdminAjouterAgentPage> createState() => _AdminAjouterAgentPageState();
}

class _AdminAjouterAgentPageState extends State<AdminAjouterAgentPage> {
  final _formKey = GlobalKey<FormState>();
  
  final _nomCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _matriculeCtrl = TextEditingController();
  
  String _selectedService = 'Service Général';
  final _services = [
    'Service Général',
    'État Civil',
    'Ressources Humaines',
    'Police / Sécurité',
  ];

  @override
  void dispose() {
    _nomCtrl.dispose();
    _emailCtrl.dispose();
    _matriculeCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      // Simulate API Call
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Agent ajouté avec succès !', style: GoogleFonts.publicSans()),
          backgroundColor: const Color(0xFF16a34a),
          behavior: SnackBarBehavior.floating,
        ),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _kBg,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: _kNavy),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Ajouter un agent',
          style: GoogleFonts.publicSans(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: _kNavy,
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(color: _kBorder, height: 1),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Informations personnelles',
                style: GoogleFonts.publicSans(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: _kNavy,
                ),
              ),
              const SizedBox(height: 16),
              _buildTextField(
                label: 'Nom complet',
                hint: 'Ex: Kaboré Alassane',
                icon: Icons.person_outline_rounded,
                controller: _nomCtrl,
                validator: (v) => v!.isEmpty ? 'Requis' : null,
              ),
              const SizedBox(height: 16),
              _buildTextField(
                label: 'Email professionnel',
                hint: 'Ex: a.kabore@egov.bf',
                icon: Icons.email_outlined,
                controller: _emailCtrl,
                keyboardType: TextInputType.emailAddress,
                validator: (v) => v!.isEmpty || !v.contains('@') ? 'Email invalide' : null,
              ),
              const SizedBox(height: 32),
              
              Text(
                'Affectation & Rôle',
                style: GoogleFonts.publicSans(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: _kNavy,
                ),
              ),
              const SizedBox(height: 16),
              _buildTextField(
                label: 'Matricule',
                hint: 'Ex: AGT-2026-001',
                icon: Icons.badge_outlined,
                controller: _matriculeCtrl,
                validator: (v) => v!.isEmpty ? 'Requis' : null,
              ),
              const SizedBox(height: 16),
              _buildDropdownField(
                label: 'Service Affilié',
                icon: Icons.business_outlined,
                value: _selectedService,
                items: _services,
                onChanged: (val) {
                  if (val != null) setState(() => _selectedService = val);
                },
              ),
              const SizedBox(height: 40),
              
              // Bouton
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _kNavy,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Enregistrer l\'agent',
                    style: GoogleFonts.publicSans(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required String hint,
    required IconData icon,
    required TextEditingController controller,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.publicSans(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: _kText,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          validator: validator,
          style: GoogleFonts.publicSans(fontSize: 14),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: GoogleFonts.publicSans(color: Colors.grey.shade400, fontSize: 14),
            prefixIcon: Icon(icon, color: Colors.grey.shade400, size: 20),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.all(16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: _kBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: _kBorder),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: _kNavy, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Colors.red),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDropdownField({
    required String label,
    required IconData icon,
    required String value,
    required List<String> items,
    required void Function(String?) onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.publicSans(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: _kText,
          ),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          initialValue: value,
          onChanged: onChanged,
          items: items.map((e) => DropdownMenuItem(value: e, child: Text(e, style: GoogleFonts.publicSans(fontSize: 14)))).toList(),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: Colors.grey.shade400, size: 20),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.all(16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: _kBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: _kBorder),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: _kNavy, width: 2),
            ),
          ),
        ),
      ],
    );
  }
}
