import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/providers/notification_provider.dart';
import '../../../../core/models/notification_model.dart';
import '../../../shared/presentation/widgets/citizen_bottom_nav.dart';
import '../../../shared/presentation/widgets/egov_sub_app_bar.dart';

class NotificationsPage extends StatefulWidget {
  final String? role; // 'citizen', 'agent', 'admin'
  const NotificationsPage({super.key, this.role});

  static const routeName = '/notifications';

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  int _filter = 0; // 0=tout,1=Demandes,2=Services

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      context.read<NotificationProvider>().fetchNotifications(auth.token);
    });
  }

  @override
  Widget build(BuildContext context) {
    final effectiveRole = widget.role ?? 'citizen';
    final notifProvider = context.watch<NotificationProvider>();
    final auth = context.read<AuthProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: EgovSubAppBar(
        title: 'Notifications',
        subtitle: effectiveRole == 'admin' ? 'ADMINISTRATION' : (effectiveRole == 'agent' ? 'PORTAIL AGENT' : 'MON COMPTE'),
        actions: [
          IconButton(
            icon: const Icon(Icons.done_all_rounded, color: AppColors.primary),
            onPressed: () => notifProvider.markAllAsRead(auth.token),
            tooltip: 'Tout marquer comme lu',
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: notifProvider.isLoading 
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: () => notifProvider.fetchNotifications(auth.token),
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.fromLTRB(16, 10, 16, 18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              _FilterChip(
                                label: 'Tout',
                                selected: _filter == 0,
                                onTap: () => setState(() => _filter = 0),
                              ),
                              const SizedBox(width: 10),
                              _FilterChip(
                                label: effectiveRole == 'citizen' ? 'Dossiers' : 'Important',
                                selected: _filter == 1,
                                onTap: () => setState(() => _filter = 1),
                              ),
                              const SizedBox(width: 10),
                              _FilterChip(
                                label: effectiveRole == 'admin' ? 'Système' : (effectiveRole == 'agent' ? 'Urgences' : 'Services'),
                                selected: _filter == 2,
                                onTap: () => setState(() => _filter = 2),
                              ),
                            ],
                          ),
                          const SizedBox(height: 18),
                          
                          if (notifProvider.notifications.isEmpty)
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 60),
                              child: Center(
                                child: Column(
                                  children: [
                                    Icon(Icons.notifications_none_rounded, size: 48, color: AppColors.textLight.withOpacity(0.5)),
                                    const SizedBox(height: 12),
                                    Text(
                                      'Aucune notification pour le moment',
                                      style: GoogleFonts.outfit(color: AppColors.textLight),
                                    ),
                                  ],
                                ),
                              ),
                            )
                          else ...[
                            const _SectionLabel('RÉCENTES'),
                            const SizedBox(height: 10),
                            ..._buildNotifications(notifProvider.notifications, auth.token),
                          ],
                        ],
                      ),
                    ),
                  ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: effectiveRole == 'citizen' ? const CitizenBottomNav(currentIndex: 2) : null,
    );
  }

  List<Widget> _buildNotifications(List<NotificationModel> notifications, String? token) {
    // Filtrage simple pour la démo (on pourrait filtrer par type sur le backend)
    final filtered = notifications.where((n) {
      if (_filter == 0) return true;
      if (_filter == 1) return n.type.contains('DEMANDE') || n.type.contains('VALID') || n.type.contains('REJET');
      return !n.type.contains('DEMANDE'); // Services/Système
    }).toList();

    return filtered.map((notif) {
      return Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: GestureDetector(
          onTap: () {
            if (!notif.lue) {
              context.read<NotificationProvider>().markAsRead(notif.id, token);
            }
          },
          child: _NotificationTile(
            lue: notif.lue,
            iconBg: _getIconBg(notif.type),
            iconColor: _getIconColor(notif.type),
            icon: _getIcon(notif.type),
            title: notif.titre,
            time: _formatTime(notif.createdAt),
            body: notif.message,
            badgeLabel: notif.statut,
            badgeColor: _getStatusColor(notif.statut),
            badgeBg: _getStatusColor(notif.statut).withOpacity(0.1),
          ),
        ),
      );
    }).toList();
  }

  Color _getIconBg(String type) {
    if (type.contains('VALID')) return const Color(0xFFDCFCE7);
    if (type.contains('REJET')) return const Color(0xFFFEE2E2);
    if (type.contains('PAIEMENT')) return const Color(0xFFFFFAEB);
    return const Color(0xFFE0F2FE);
  }

  Color _getIconColor(String type) {
    if (type.contains('VALID')) return const Color(0xFF16A34A);
    if (type.contains('REJET')) return const Color(0xFFB91C1C);
    if (type.contains('PAIEMENT')) return const Color(0xFFD97706);
    return const Color(0xFF0369A1);
  }

  IconData _getIcon(String type) {
    if (type.contains('VALID')) return Icons.check_circle_rounded;
    if (type.contains('REJET')) return Icons.cancel_rounded;
    if (type.contains('PAIEMENT')) return Icons.payments_rounded;
    if (type.contains('DOCUMENTS')) return Icons.file_present_rounded;
    return Icons.notifications_active_rounded;
  }

  Color _getStatusColor(String? statut) {
    if (statut == 'VALIDEE') return const Color(0xFF16A34A);
    if (statut == 'REJETEE') return const Color(0xFFB91C1C);
    if (statut == 'EN_COURS') return const Color(0xFF0369A1);
    return AppColors.textLight;
  }

  String _formatTime(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m';
    if (diff.inHours < 24) return '${diff.inHours}h';
    return '${date.day}/${date.month}';
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(999),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : AppColors.cardBg,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: AppColors.divider),
        ),
        child: Text(
          label,
          style: GoogleFonts.outfit(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            color: selected ? AppColors.white : AppColors.textDark,
          ),
        ),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String text;
  const _SectionLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: GoogleFonts.outfit(
        fontSize: 11,
        fontWeight: FontWeight.w800,
        letterSpacing: 0.6,
        color: AppColors.textLight.withOpacity(0.8),
      ),
    );
  }
}

class _NotificationTile extends StatelessWidget {
  final bool lue;
  final Color iconBg;
  final Color iconColor;
  final IconData icon;
  final String title;
  final String time;
  final String body;
  final String? badgeLabel;
  final Color? badgeColor;
  final Color? badgeBg;

  const _NotificationTile({
    required this.lue,
    required this.iconBg,
    required this.iconColor,
    required this.icon,
    required this.title,
    required this.time,
    required this.body,
    this.badgeLabel,
    this.badgeColor,
    this.badgeBg,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      decoration: BoxDecoration(
        color: lue ? AppColors.cardBg : AppColors.primary.withOpacity(0.03),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: lue ? AppColors.divider : AppColors.primary.withOpacity(0.2)),
        boxShadow: lue ? null : [
          BoxShadow(color: AppColors.primary.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: iconBg,
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              if (!lue)
                Positioned(
                  right: 0,
                  top: 0,
                  child: Container(
                    width: 10,
                    height: 10,
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: GoogleFonts.outfit(
                          fontSize: 13.5,
                          fontWeight: lue ? FontWeight.w700 : FontWeight.w900,
                          color: AppColors.textDark,
                        ),
                      ),
                    ),
                    Text(
                      time,
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textLight,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  body,
                  style: GoogleFonts.outfit(
                    fontSize: 11.5,
                    height: 1.45,
                    fontWeight: lue ? FontWeight.w500 : FontWeight.w600,
                    color: lue ? AppColors.textLight : AppColors.textDark,
                  ),
                ),
                if (badgeLabel != null &&
                    badgeBg != null &&
                    badgeColor != null) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: badgeBg,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      badgeLabel!,
                      style: GoogleFonts.outfit(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.6,
                        color: badgeColor!,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

