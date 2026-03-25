import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../../core/providers/user_management_provider.dart';
import '../../../../core/providers/auth_provider.dart';
import 'service_model.dart';

class GestionServicesPage extends StatefulWidget {
  const GestionServicesPage({super.key});

  @override
  State<GestionServicesPage> createState() => _GestionServicesPageState();
}

class _GestionServicesPageState extends State<GestionServicesPage> {
  // ── Couleurs imposées ───────────────────────────────────────────────────────
  static const Color primaryBlue     = Color(0xFF1A237E);
  static const Color successGreen    = Color(0xFF27AE60);
  static const Color backgroundLight = Color(0xFFF4F6F9);
  static const Color textPrimary     = Color(0xFF1C1C1E);
  static const Color textSecondary   = Color(0xFF8E8E93);

  final List<Color> serviceColors = const [
    Color(0xFF1A237E),
    Color(0xFF8B1A1A),
    Color(0xFF1565C0),
    Color(0xFF27AE60),
    Color(0xFFE67E22),
    Color(0xFF8E44AD),
  ];

  final List<IconData> serviceIcons = const [
    Icons.account_balance_rounded,
    Icons.work_outline_rounded,
    Icons.star_outline_rounded,
    Icons.local_hospital_outlined,
    Icons.school_outlined,
    Icons.agriculture_outlined,
  ];

  // ── State Bottom Sheet ──────────────────────────────────────────────────────
  final TextEditingController _nomController = TextEditingController();
  int _selectedColorIndex = 0;
  int _selectedIconIndex  = 0;

  @override
  void dispose() {
    _nomController.dispose();
    super.dispose();
  }

  // ── Build principal ─────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    final userProvider = context.watch<UserManagementProvider>();
    final services = userProvider.services;

    return Scaffold(
      backgroundColor: backgroundLight,
      appBar: _buildAppBar(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // En-tête : "Services" + bouton "+ Ajouter"
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Services",
                  style: GoogleFonts.inter(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: textPrimary,
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: () => _showNouveauServiceSheet(context),
                  icon: const Icon(Icons.add, size: 18),
                  label: Text(
                    "Ajouter",
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryBlue,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 10),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(999),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Bandeau info
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: primaryBlue.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded,
                      color: primaryBlue, size: 18),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      "Chaque service regroupe des agents et des types de documents associés.",
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: primaryBlue,
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Cartes service dynamiques
            ...services.map((s) => _buildServiceCard(
              service: s,
              onToggle: (val) {
                userProvider.toggleServiceStatus(s.id);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text("${s.name} ${val ? 'activé' : 'désactivé'}"),
                    duration: const Duration(seconds: 1),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
            )),
          ],
        ),
      ),
    );
  }

  // ── AppBar ──────────────────────────────────────────────────────────────────
  PreferredSizeWidget _buildAppBar() {
    return const EgovMainAppBar(title: 'GESTION DES SERVICES');
  }

  // ── Carte Service ───────────────────────────────────────────────────────────
  Widget _buildServiceCard({
    required ServiceData service,
    required ValueChanged<bool> onToggle,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0C000000),
            blurRadius: 10,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: service.color,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(service.icon, color: Colors.white, size: 26),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      service.name,
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: textPrimary,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: service.isActive ? successGreen : textSecondary.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        service.isActive ? "ACTIF" : "INACTIF",
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: service.isActive ? Colors.white : textSecondary,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.people_outline, size: 14, color: textSecondary),
                    const SizedBox(width: 4),
                    Text("${service.agentCount} Agents", style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
                    const SizedBox(width: 12),
                    const Icon(Icons.description_outlined, size: 14, color: textSecondary),
                    const SizedBox(width: 4),
                    Text("${service.docCount} Docs", style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
                  ],
                ),
              ],
            ),
          ),
          Switch(
            value: service.isActive,
            onChanged: onToggle,
            activeThumbColor: successGreen,
            activeTrackColor: successGreen.withOpacity(0.3),
          ),
        ],
      ),
    );
  }

  // ── Bottom Sheet Nouveau Service ───────────────────────────────────────────
  void _showNouveauServiceSheet(BuildContext context) {
    // On réinitialise l'état local du sheet
    _selectedColorIndex = 0;
    _selectedIconIndex = 0;
    _nomController.clear();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: EdgeInsets.fromLTRB(
              24, 16, 24, MediaQuery.of(context).viewInsets.bottom + 24),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(28),
              topRight: Radius.circular(28),
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Poignée
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFDDDDDD),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Titre
              Text(
                "Nouveau Service",
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: textPrimary,
                ),
              ),

              const SizedBox(height: 24),

              // CHAMP NOM DU SERVICE
              Text(
                "NOM DU SERVICE *",
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: textSecondary,
                  letterSpacing: 0.8,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _nomController,
                style: GoogleFonts.inter(fontSize: 14, color: textPrimary),
                decoration: InputDecoration(
                  hintText: "Ex: Direction des Impôts",
                  hintStyle:
                      GoogleFonts.inter(fontSize: 14, color: textSecondary),
                  prefixIcon: const Icon(Icons.edit_note_rounded,
                      color: textSecondary, size: 20),
                  filled: true,
                  fillColor: const Color(0xFFF5F5F5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 16),
                ),
              ),

              const SizedBox(height: 20),

              // COULEUR D'IDENTIFICATION
              Text(
                "COULEUR D'IDENTIFICATION",
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: textSecondary,
                  letterSpacing: 0.8,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: List.generate(
                  serviceColors.length,
                  (i) => GestureDetector(
                    onTap: () => setModalState(() => _selectedColorIndex = i),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: serviceColors[i],
                        shape: BoxShape.circle,
                        border: _selectedColorIndex == i
                            ? Border.all(
                                color: serviceColors[i]
                                    .withOpacity(0.4),
                                width: 3,
                              )
                            : null,
                      ),
                      child: _selectedColorIndex == i
                          ? const Icon(Icons.check_rounded,
                              color: Colors.white, size: 20)
                          : null,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // ICÔNE
              Text(
                "ICÔNE",
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: textSecondary,
                  letterSpacing: 0.8,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: List.generate(
                  serviceIcons.length,
                  (i) => GestureDetector(
                    onTap: () => setModalState(() => _selectedIconIndex = i),
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: _selectedIconIndex == i
                            ? serviceColors[_selectedColorIndex]
                            : const Color(0xFFEEEEEE),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        serviceIcons[i],
                        color: _selectedIconIndex == i
                            ? Colors.white
                            : textSecondary,
                        size: 24,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // BOUTONS ANNULER + CRÉER
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: textPrimary,
                        side: const BorderSide(color: Color(0xFFDDE2E8)),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(999),
                        ),
                      ),
                      child: Text(
                        "Annuler",
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        if (_nomController.text.trim().isEmpty) return;
                        
                        final newService = ServiceData(
                          id: _nomController.text.trim().toLowerCase().replaceAll(' ', '_'),
                          name: _nomController.text.trim(),
                          description: "Nouveau service administratif - ${_nomController.text.trim()}",
                          icon: serviceIcons[_selectedIconIndex],
                          color: serviceColors[_selectedColorIndex],
                          isActive: true,
                        );

                        final token = context.read<AuthProvider>().token ?? '';
                        context.read<UserManagementProvider>().addService({
                          'nom': newService.name,
                          'description': newService.description,
                          'isActive': newService.isActive,
                        }, token);
                        Navigator.of(context).pop();
                        
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("Nouveau service créé avec succès"),
                            backgroundColor: successGreen,
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryBlue,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(999),
                        ),
                      ),
                      child: Text(
                        "Créer",
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
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
}
