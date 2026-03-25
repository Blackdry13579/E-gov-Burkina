import 'package:egov_mobile/features/shared/presentation/widgets/egov_main_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/providers/document_provider.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../catalogue/domain/models/document_model.dart';

class AgentDocumentsPage extends StatefulWidget {
  final VoidCallback? onNotificationTap;
  final VoidCallback? onProfileTap;

  const AgentDocumentsPage({
    super.key,
    this.onNotificationTap,
    this.onProfileTap,
  });

  @override
  State<AgentDocumentsPage> createState() => _AgentDocumentsPageState();
}

class _AgentDocumentsPageState extends State<AgentDocumentsPage> {
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final token = context.read<AuthProvider>().token ?? '';
      context.read<DocumentProvider>().loadDocuments(token);
    });
  }

  @override
  Widget build(BuildContext context) {
    final docProvider = context.watch<DocumentProvider>();
    final authProvider = context.read<AuthProvider>();
    final agentService = authProvider.agent?.service ?? '';
    final token = authProvider.token ?? '';

    // Filter by agent's service and search query
    final myDocuments = docProvider.allDocuments.where((d) {
      final matchesService = (agentService == 'admin' || d.service == agentService);
      final matchesSearch = d.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                            d.code.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesService && matchesSearch;
    }).toList();

    final activeCount = myDocuments.where((doc) => doc.isActive).length;
    final inactiveCount = myDocuments.where((doc) => !doc.isActive).length;

    // Handle Error Snackbar
    if (docProvider.error != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error_outline, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Text(
                  'Synchronisation échouée. Réessayez.',
                  style: GoogleFonts.publicSans(color: Colors.white),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF991b1b),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            margin: const EdgeInsets.all(16),
          ),
        );
      });
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: EgovMainAppBar(
        title: 'DOCUMENTS DE SERVICE',
        onNotificationTap: widget.onNotificationTap,
        onProfileTap: widget.onProfileTap,
      ),
      body: docProvider.isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF1a237e)))
          : SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Page Header
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Types de Documents',
                          style: GoogleFonts.publicSans(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textDark,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Activez ou désactivez les documents disponibles pour votre service.',
                          style: GoogleFonts.publicSans(
                            fontSize: 13,
                            color: AppColors.textLight,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Info Banner
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFe8eef7),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline_rounded, color: Color(0xFF1a237e), size: 20),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Seul l\'administrateur peut créer ou modifier les types de documents.',
                              style: GoogleFonts.publicSans(
                                fontSize: 12,
                                color: AppColors.primary,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Search Bar
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Container(
                      height: 48,
                      decoration: BoxDecoration(
                        color: const Color(0xFFf1f5f9),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: TextField(
                        onChanged: (v) => setState(() => _searchQuery = v),
                        decoration: InputDecoration(
                          hintText: 'Rechercher un document...',
                          hintStyle: GoogleFonts.publicSans(color: AppColors.textLight, fontSize: 14),
                          prefixIcon: const Icon(Icons.search_rounded, color: AppColors.textLight, size: 20),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                      ),
                    ),
                  ),

                  // Stats Row
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Row(
                      children: [
                        Expanded(
                          child: _buildStatCard(
                            count: activeCount.toString(),
                            label: 'Actifs',
                            dotColor: const Color(0xFF16a34a),
                            countColor: const Color(0xFF1a237e),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildStatCard(
                            count: inactiveCount.toString(),
                            label: 'Inactifs',
                            dotColor: const Color(0xFF94a3b8),
                            countColor: const Color(0xFF64748b),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Document List Section
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'MES DOCUMENTS',
                      style: GoogleFonts.publicSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: AppColors.primary,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFe2e8f0)),
                    ),
                    child: ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: myDocuments.length,
                      separatorBuilder: (_, __) => const Divider(height: 1, color: Color(0xFFe2e8f0)),
                      itemBuilder: (context, index) {
                        return _buildDocumentItem(myDocuments[index], docProvider, token);
                      },
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                ],
              ),
            ),
    );
  }

  Widget _buildStatCard({
    required String count,
    required String label,
    required Color dotColor,
    required Color countColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFe2e8f0)),
      ),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: dotColor,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                count,
                style: GoogleFonts.publicSans(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: countColor,
                ),
              ),
              Text(
                label,
                style: GoogleFonts.publicSans(
                  fontSize: 12,
                  color: AppColors.textLight,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDocumentItem(DocumentModel doc, DocumentProvider provider, String token) {
    final bool isActive = doc.isActive;
    
    return Opacity(
      opacity: isActive ? 1.0 : 0.6,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            // Icon
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFFe8eef7),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(doc.icon, color: const Color(0xFF1a237e), size: 22),
            ),
            const SizedBox(width: 14),
            
            // Name & Code
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    doc.title,
                    style: GoogleFonts.publicSans(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textDark,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          doc.code,
                          style: const TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 10,
                            color: AppColors.textLight,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        isActive ? 'Actif' : 'Inactif',
                        style: GoogleFonts.publicSans(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: isActive ? const Color(0xFF16a34a) : AppColors.textLight,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            // Toggle
            Switch(
              value: isActive,
              onChanged: (value) {
                provider.toggleDocument(
                  documentId: doc.id,
                  newValue: value,
                  token: token,
                );
              },
              activeThumbColor: AppColors.primary,
              activeTrackColor: AppColors.primary.withOpacity(0.2),
              inactiveThumbColor: Colors.white,
              inactiveTrackColor: AppColors.textLight.withOpacity(0.5),
            ),
          ],
        ),
      ),
    );
  }
}
