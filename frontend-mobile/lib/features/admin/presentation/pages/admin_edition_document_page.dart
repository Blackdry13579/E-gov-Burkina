import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/providers/document_provider.dart';
import '../../../../features/catalogue/domain/models/document_model.dart';

// ─── Couleurs ─────────────────────────────────────────────────────────────────
const _kNavy   = Color(0xFF1a237e);
const _kBg     = Color(0xFFf0f4f8);
const _kDark   = Color(0xFF1e293b);
const _kGray   = Color(0xFF94a3b8);
const _kMuted  = Color(0xFF64748b);
const _kBorder = Color(0xFFe2e8f0);
const _kGreen  = Color(0xFF16a34a);
const _kRed    = Color(0xFF991b1b);
const _kRedBg  = Color(0xFFfee2e2);

// ─── Options dropdown ──────────────────────────────────────────────────────────
const _livraisonOptions = ['PDF', 'Retrait guichet', 'Email + Retrait'];
const _serviceOptions   = ['Mairie', 'Justice', 'Police', 'Santé'];

// ─── Page ──────────────────────────────────────────────────────────────────────
class AdminEditionDocumentPage extends StatefulWidget {
  final DocumentModel document;
  const AdminEditionDocumentPage({super.key, required this.document});

  @override
  State<AdminEditionDocumentPage> createState() =>
      _AdminEditionDocumentPageState();
}

class _AdminEditionDocumentPageState
    extends State<AdminEditionDocumentPage> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _nomCtrl;
  late final TextEditingController _prixCtrl;
  late final TextEditingController _delaiCtrl;

  late String _selectedLivraison;
  late String _selectedService;
  late bool   _isActive;
  bool        _isSaving = false;

  @override
  void initState() {
    super.initState();
    _nomCtrl  = TextEditingController(text: widget.document.title);
    _prixCtrl = TextEditingController(
        text: widget.document.price.replaceAll(RegExp(r'\s?FCFA'), '').trim());
    _delaiCtrl = TextEditingController(text: widget.document.delay);

    _selectedLivraison = _livraisonOptions.contains(widget.document.delivery)
        ? widget.document.delivery
        : _livraisonOptions.first;

    final svcRaw = widget.document.service.toLowerCase();
    _selectedService = _serviceOptions.firstWhere(
      (s) => s.toLowerCase() == svcRaw,
      orElse: () => _serviceOptions.first,
    );

    _isActive = widget.document.isActive;
  }

  @override
  void dispose() {
    _nomCtrl.dispose();
    _prixCtrl.dispose();
    _delaiCtrl.dispose();
    super.dispose();
  }

  // ── Build ──────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _kBg,
      appBar: _appBar(),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            children: [
              _identityCard(),
              _formSection(),
              _bottomButtons(),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  // ── AppBar ─────────────────────────────────────────────────────────────────
  PreferredSizeWidget _appBar() {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: _kNavy, size: 24),
        onPressed: () => Navigator.pop(context),
      ),
      title: Text(
        'Modifier le Document',
        style: GoogleFonts.publicSans(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: _kDark,
        ),
      ),
      centerTitle: true,
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 16),
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: _kBorder),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.asset(
                'assets/images/embleme.png',
                fit: BoxFit.contain,
                errorBuilder: (_, __, ___) =>
                    const Icon(Icons.account_balance,
                        color: _kNavy, size: 18),
              ),
            ),
          ),
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(color: _kBorder, height: 1),
      ),
    );
  }

  // ── Carte identité document ────────────────────────────────────────────────
  Widget _identityCard() {
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 28),
      child: Column(
        children: [
          // Icône
          Container(
            width: 80,
            height: 80,
            decoration: const BoxDecoration(
              color: _kNavy,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.description_rounded,
                color: Colors.white, size: 36),
          ),
          const SizedBox(height: 16),
          Text(
            widget.document.title,
            style: GoogleFonts.publicSans(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: _kNavy,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            widget.document.code,
            style: GoogleFonts.jetBrainsMono(
              fontSize: 13,
              color: _kGray,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
            decoration: BoxDecoration(
              color: _kNavy,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              widget.document.service.toUpperCase(),
              style: GoogleFonts.publicSans(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Section formulaire ─────────────────────────────────────────────────────
  Widget _formSection() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 16),
      color: _kBg,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Champ 1 — Nom
          const _FieldLabel('NOM DU DOCUMENT'),
          _fieldBox(
            child: TextFormField(
              controller: _nomCtrl,
              style: GoogleFonts.publicSans(fontSize: 15, color: _kDark),
              decoration: _inputDeco(hint: 'Acte de Naissance'),
              validator: (v) => (v == null || v.isEmpty) ? 'Requis' : null,
            ),
          ),
          const SizedBox(height: 16),

          // Champ 2 — Code (disabled)
          const _FieldLabel('CODE'),
          _fieldBox(
            child: TextFormField(
              initialValue: widget.document.code,
              enabled: false,
              style: GoogleFonts.jetBrainsMono(
                  fontSize: 14, color: _kGray),
              decoration: _inputDeco(
                hint: '',
                suffix: const Icon(Icons.lock_outline,
                    color: _kGray, size: 18),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 6, left: 4),
            child: Text(
              "L'identifiant unique ne peut pas être modifié après création.",
              style: GoogleFonts.publicSans(
                fontSize: 11,
                color: _kGray,
                fontStyle: FontStyle.italic,
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Champs 3 & 4 — Prix + Délai côte à côte
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const _FieldLabel('PRIX (FCFA)'),
                    _fieldBox(
                      child: TextFormField(
                        controller: _prixCtrl,
                        style: GoogleFonts.publicSans(
                            fontSize: 15, color: _kDark),
                        keyboardType: TextInputType.number,
                        decoration: _inputDeco(hint: '500'),
                        validator: (v) =>
                            (v == null || v.isEmpty) ? 'Requis' : null,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const _FieldLabel('DÉLAI'),
                    _fieldBox(
                      child: TextFormField(
                        controller: _delaiCtrl,
                        style: GoogleFonts.publicSans(
                            fontSize: 15, color: _kDark),
                        decoration: _inputDeco(hint: '24h'),
                        validator: (v) =>
                            (v == null || v.isEmpty) ? 'Requis' : null,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Champ 5 — Livraison (dropdown)
          const _FieldLabel('MODE DE LIVRAISON'),
          _DropdownField(
            value: _selectedLivraison,
            options: _livraisonOptions,
            onChanged: (v) => setState(() => _selectedLivraison = v!),
          ),
          const SizedBox(height: 16),

          // Champ 6 — Service (dropdown)
          const _FieldLabel('SERVICE'),
          _DropdownField(
            value: _selectedService,
            options: _serviceOptions,
            onChanged: (v) => setState(() => _selectedService = v!),
          ),
          const SizedBox(height: 16),

          // Champ 7 — Toggle actif
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Actif',
                      style: GoogleFonts.publicSans(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: _kDark,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Visible pour les citoyens',
                      style: GoogleFonts.publicSans(
                          fontSize: 12, color: _kMuted),
                    ),
                  ],
                ),
                Switch(
                  value: _isActive,
                  activeThumbColor: _kGreen,
                  inactiveTrackColor: _kBorder,
                  onChanged: (v) => setState(() => _isActive = v),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Boutons bas de page ────────────────────────────────────────────────────
  Widget _bottomButtons() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
      child: Column(
        children: [
          // Enregistrer
          GestureDetector(
            onTap: _isSaving ? null : _onSave,
            child: Container(
              width: double.infinity,
              height: 56,
              decoration: BoxDecoration(
                color: _kNavy,
                borderRadius: BorderRadius.circular(14),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x4D1a237e),
                    blurRadius: 12,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Center(
                child: _isSaving
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(
                            color: Colors.white, strokeWidth: 2))
                    : Text(
                        'Enregistrer',
                        style: GoogleFonts.publicSans(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Supprimer
          GestureDetector(
            onTap: () => _showDeleteDialog(),
            child: Container(
              width: double.infinity,
              height: 56,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: _kRed, width: 1.5),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.delete_outline_rounded,
                      color: _kRed, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    'Supprimer ce document',
                    style: GoogleFonts.publicSans(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: _kRed,
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

  // ── Logique sauvegarde ─────────────────────────────────────────────────────
  Future<void> _onSave() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);

    final token = context.read<AuthProvider>().token ?? '';
    final ok = await context.read<DocumentProvider>().updateDocument(
          documentId: widget.document.id,
          token: token,
          data: {
            'title':    _nomCtrl.text.trim(),
            'price':    '${_prixCtrl.text.trim()} FCFA',
            'delay':    _delaiCtrl.text.trim(),
            'delivery': _selectedLivraison,
            'service':  _selectedService.toLowerCase(),
            'isActive': _isActive,
          },
        );

    if (!mounted) return;
    setState(() => _isSaving = false);

    if (ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Document mis à jour avec succès',
              style: GoogleFonts.publicSans()),
          backgroundColor: _kGreen,
        ),
      );
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erreur lors de la mise à jour',
              style: GoogleFonts.publicSans()),
          backgroundColor: _kRed,
        ),
      );
    }
  }

  // ── Dialog de suppression ──────────────────────────────────────────────────
  void _showDeleteDialog() {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20)),
        insetPadding:
            const EdgeInsets.symmetric(horizontal: 32),
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: const BoxDecoration(
                    color: _kRedBg, shape: BoxShape.circle),
                child: const Icon(Icons.delete_rounded,
                    color: _kRed, size: 32),
              ),
              const SizedBox(height: 16),
              Text(
                'Supprimer ce document ?',
                style: GoogleFonts.publicSans(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: _kDark,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Cette action est irréversible. Le document sera supprimé définitivement.',
                style: GoogleFonts.publicSans(
                    fontSize: 13, color: _kGray, height: 1.5),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => Navigator.pop(ctx),
                      child: Container(
                        height: 48,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: _kNavy),
                        ),
                        child: Center(
                          child: Text(
                            'Annuler',
                            style: GoogleFonts.publicSans(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: _kNavy,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: GestureDetector(
                      onTap: () async {
                        Navigator.pop(ctx);
                        final token =
                            context.read<AuthProvider>().token ?? '';
                        await context
                            .read<DocumentProvider>()
                            .deleteDocument(
                              documentId: widget.document.id,
                              token: token,
                            );
                        if (!mounted) return;
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Document supprimé',
                                style: GoogleFonts.publicSans()),
                            backgroundColor: _kRed,
                          ),
                        );
                      },
                      child: Container(
                        height: 48,
                        decoration: BoxDecoration(
                          color: _kRed,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: Text(
                            'Supprimer',
                            style: GoogleFonts.publicSans(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  Widget _fieldBox({required Widget child}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: child,
    );
  }

  InputDecoration _inputDeco({
    required String hint,
    Widget? suffix,
  }) {
    return InputDecoration(
      hintText: hint,
      hintStyle: GoogleFonts.publicSans(fontSize: 14, color: _kGray),
      suffixIcon: suffix,
      border: InputBorder.none,
      contentPadding: const EdgeInsets.symmetric(
          horizontal: 16, vertical: 16),
    );
  }
}

// ─── Label de champ ───────────────────────────────────────────────────────────
class _FieldLabel extends StatelessWidget {
  final String text;
  const _FieldLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: GoogleFonts.publicSans(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: const Color(0xFF64748b),
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

// ─── Dropdown réutilisable ────────────────────────────────────────────────────
class _DropdownField extends StatelessWidget {
  final String             value;
  final List<String>       options;
  final ValueChanged<String?> onChanged;

  const _DropdownField({
    required this.value,
    required this.options,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 52,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          isExpanded: true,
          value: value,
          icon: const Icon(Icons.expand_more_rounded,
              color: Color(0xFF94a3b8), size: 22),
          style: GoogleFonts.publicSans(
              fontSize: 15, color: const Color(0xFF1e293b)),
          onChanged: onChanged,
          items: options
              .map((o) => DropdownMenuItem(value: o, child: Text(o)))
              .toList(),
        ),
      ),
    );
  }
}
