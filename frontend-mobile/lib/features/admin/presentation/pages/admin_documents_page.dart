import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:egov_mobile/features/shared/presentation/widgets/admin_bottom_nav.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/providers/document_provider.dart';
import '../../../../features/catalogue/domain/models/document_model.dart';
import 'admin_ajouter_document_page.dart';
import 'admin_edition_document_page.dart';
import 'gestion_services_page.dart';

// ─── Couleurs ─────────────────────────────────────────────────────────────────
const _kNavy    = Color(0xFF1a237e);
const _kBg      = Color(0xFFf0f4f8);
const _kDark    = Color(0xFF1e293b);
const _kGray    = Color(0xFF94a3b8);
const _kMuted   = Color(0xFF64748b);
const _kBorder  = Color(0xFFe2e8f0);
const _kGreen   = Color(0xFF16a34a);
const _kRed     = Color(0xFF991b1b);

// ─── Config par service ────────────────────────────────────────────────────────
const _serviceOrder = ['mairie', 'justice', 'police', 'sante'];

const _serviceConfig = {
  'mairie':   _ServiceCfg('MAIRIE',   Color(0xFF1a237e), Icons.account_balance_rounded),
  'justice':  _ServiceCfg('JUSTICE',  Color(0xFF8b1a1a), Icons.balance_rounded),
  'police':   _ServiceCfg('POLICE',   Color(0xFF1565c0), Icons.shield_rounded),
  'sante':    _ServiceCfg('SANTÉ',    Color(0xFF16a34a), Icons.local_hospital_rounded),
};

class _ServiceCfg {
  final String  label;
  final Color   color;
  final IconData icon;
  const _ServiceCfg(this.label, this.color, this.icon);
}

// ─── Page principale ───────────────────────────────────────────────────────────
class AdminDocumentsPage extends StatefulWidget {
  const AdminDocumentsPage({super.key});
  static const routeName = '/admin-documents';

  @override
  State<AdminDocumentsPage> createState() => _AdminDocumentsPageState();
}

class _AdminDocumentsPageState extends State<AdminDocumentsPage> {
  String _searchQuery = '';
  final _searchCtrl   = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchCtrl.addListener(
        () => setState(() => _searchQuery = _searchCtrl.text));

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final token = context.read<AuthProvider>().token ?? '';
      context.read<DocumentProvider>().loadDocuments(token);
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  // ── Filtrage ──────────────────────────────────────────────────────────────
  List<DocumentModel> _filterDocs(List<DocumentModel> docs) {
    if (_searchQuery.isEmpty) return docs;
    final q = _searchQuery.toLowerCase();
    return docs.where((d) =>
        d.title.toLowerCase().contains(q) ||
        d.code.toLowerCase().contains(q)).toList();
  }

  Map<String, List<DocumentModel>> _byService(List<DocumentModel> all) {
    final map = <String, List<DocumentModel>>{};
    for (final s in _serviceOrder) {
      final list = _filterDocs(
          all.where((d) => d.service.toLowerCase() == s).toList());
      if (list.isNotEmpty) map[s] = list;
    }
    return map;
  }

  // ── Build ──────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    final docProvider = context.watch<DocumentProvider>();
    final grouped     = _byService(docProvider.allDocuments);
    final activeCount = docProvider.allDocuments.where((d) => d.isActive).length;
    final inactiveCount = docProvider.allDocuments.length - activeCount;

    return Scaffold(
      backgroundColor: _kBg,
      appBar: const EgovMainAppBar(title: 'CATALOGUE DOCUMENTS'),
      body: docProvider.isLoading
          ? const Center(child: CircularProgressIndicator(color: _kNavy))
          : ListView(
              padding: const EdgeInsets.only(bottom: 32),
              children: [
                _headerCard(docProvider.allDocuments.length, activeCount, inactiveCount),
                _gererServicesCard(),
                _searchBar(),
                if (grouped.isEmpty)
                  Padding(
                    padding: const EdgeInsets.all(32),
                    child: Center(
                      child: Text(
                        'Aucun document trouvé',
                        style: GoogleFonts.publicSans(
                            fontSize: 16, color: _kGray),
                      ),
                    ),
                  )
                else
                  for (final entry in grouped.entries)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                      child: _ServiceSection(
                        serviceKey: entry.key,
                        docs: entry.value,
                      ),
                    ),
              ],
            ),
      bottomNavigationBar: const AdminBottomNav(currentIndex: 3),
    );
  }

  // ── AppBar ─────────────────────────────────────────────────────────────────
  // ── Header card ────────────────────────────────────────────────────────────
  Widget _headerCard(int total, int active, int inactive) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Titre + bouton
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Documents',
                  style: GoogleFonts.publicSans(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: _kDark,
                  ),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminAjouterDocumentPage()));
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 20, vertical: 12),
                  decoration: BoxDecoration(
                    color: _kNavy,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x4D1a237e),
                        blurRadius: 12,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.description_rounded,
                          color: Colors.white, size: 18),
                      const SizedBox(width: 6),
                      Text(
                        'AJOUTER',
                        style: GoogleFonts.publicSans(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Stats row
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFFf8fafc),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _kBorder),
            ),
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: IntrinsicHeight(
              child: Row(
                children: [
                  Expanded(child: _StatCell('TOTAL', '$total', _kDark)),
                  const VerticalDivider(width: 1, color: _kBorder, thickness: 1),
                  Expanded(child: _StatCell('ACTIFS', '$active', _kGreen)),
                  const VerticalDivider(width: 1, color: _kBorder, thickness: 1),
                  Expanded(child: _StatCell('INACTIFS', '$inactive', _kRed)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Gérer services card ────────────────────────────────────────────────────
  Widget _gererServicesCard() {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const GestionServicesPage()),
        );
      },
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 0),
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0D000000),
              blurRadius: 6,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: _kBg,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.settings_rounded,
                  color: _kMuted, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Gérer les Services',
                    style: GoogleFonts.publicSans(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: _kDark,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    '4 services configurés',
                    style: GoogleFonts.publicSans(
                      fontSize: 13,
                      color: _kMuted,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: _kGray, size: 24),
          ],
        ),
      ),
    );
  }

  // ── Search bar ─────────────────────────────────────────────────────────────
  Widget _searchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Container(
        height: 50,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: _kBorder),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0A000000),
              blurRadius: 4,
              offset: Offset(0, 1),
            ),
          ],
        ),
        child: Row(
          children: [
            const SizedBox(width: 16),
            const Icon(Icons.search_rounded, color: _kGray, size: 20),
            const SizedBox(width: 10),
            Expanded(
              child: TextField(
                controller: _searchCtrl,
                style: GoogleFonts.publicSans(fontSize: 14, color: _kDark),
                decoration: InputDecoration(
                  hintText: 'Rechercher un document...',
                  hintStyle: GoogleFonts.publicSans(
                      fontSize: 13, color: _kGray),
                  border: InputBorder.none,
                  isCollapsed: true,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Cellule stat ──────────────────────────────────────────────────────────────
class _StatCell extends StatelessWidget {
  final String label;
  final String value;
  final Color  color;

  const _StatCell(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          label,
          style: GoogleFonts.publicSans(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: color,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          value,
          style: GoogleFonts.publicSans(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }
}

// ─── Section par service ──────────────────────────────────────────────────────
class _ServiceSection extends StatelessWidget {
  final String             serviceKey;
  final List<DocumentModel> docs;

  const _ServiceSection({
    required this.serviceKey,
    required this.docs,
  });

  @override
  Widget build(BuildContext context) {
    final cfg = _serviceConfig[serviceKey] ??
        const _ServiceCfg('SERVICE', _kNavy, Icons.description_rounded);

    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Column(
        children: [
          // En-tête coloré arrondi en haut
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(color: cfg.color),
            child: Row(
              children: [
                Icon(cfg.icon, color: Colors.white, size: 20),
                const SizedBox(width: 10),
                 Expanded(
                  child: Text(
                    cfg.label,
                    style: GoogleFonts.publicSans(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 1.5,
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '${docs.length}',
                    style: GoogleFonts.publicSans(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: cfg.color,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Liste documents arrondie en bas
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: _kBorder),
              borderRadius: const BorderRadius.vertical(
                  bottom: Radius.circular(12)),
            ),
            child: Column(
              children: [
                for (int i = 0; i < docs.length; i++) ...[
                  if (i > 0)
                    const Divider(
                        height: 1,
                        thickness: 1,
                        color: Color(0xFFf0f4f8),
                        indent: 16,
                        endIndent: 16),
                  _DocumentItem(
                      doc: docs[i], serviceColor: cfg.color),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Item document ────────────────────────────────────────────────────────────
class _DocumentItem extends StatelessWidget {
  final DocumentModel doc;
  final Color         serviceColor;

  const _DocumentItem({
    required this.doc,
    required this.serviceColor,
  });

  @override
  Widget build(BuildContext context) {
    final isActive = doc.isActive;

    return Opacity(
      opacity: isActive ? 1.0 : 0.6,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            // Icône service
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: serviceColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(doc.icon, color: serviceColor, size: 22),
            ),

            const SizedBox(width: 14),

            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Opacity(
                    opacity: isActive ? 1.0 : 0.45,
                    child: Text(
                        doc.title,
                        style: GoogleFonts.publicSans(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: _kDark,
                        ),
                        overflow: TextOverflow.ellipsis,
                        maxLines: 1,
                      ),
                  ),
                  const SizedBox(height: 5),
                  Opacity(
                    opacity: isActive ? 1.0 : 0.45,
                    child: Row(
                      children: [
                         Flexible(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: _kBg,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              doc.code,
                              style: GoogleFonts.jetBrainsMono(
                                fontSize: 11,
                                color: _kMuted,
                              ),
                              overflow: TextOverflow.ellipsis,
                              maxLines: 1,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          doc.price,
                          style: GoogleFonts.publicSans(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: serviceColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 14),

            // Toggle + édition
            Row(
              children: [
                Switch(
                  value: isActive,
                  activeThumbColor: _kGreen,
                  inactiveTrackColor: _kBorder,
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  onChanged: (val) {
                    final token = context
                            .read<AuthProvider>()
                            .token ??
                        '';
                    context.read<DocumentProvider>().toggleDocument(
                          documentId: doc.id,
                          newValue: val,
                          token: token,
                        );
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text("${doc.title} ${val ? 'activé' : 'désactivé'}"),
                        duration: const Duration(seconds: 1),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                ),
                const SizedBox(width: 6),
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => AdminEditionDocumentPage(document: doc),
                      ),
                    );
                  },
                  child: const Icon(Icons.edit_outlined,
                      color: _kGray, size: 18),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
