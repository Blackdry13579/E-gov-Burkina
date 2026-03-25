import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../../core/providers/auth_provider.dart';

import 'package:egov_mobile/features/shared/presentation/widgets/egov_app_bar.dart';
import 'package:egov_mobile/scaffolds/agent_main_scaffold.dart';
import 'package:egov_mobile/features/agent/domain/models/agent_config.dart';
import 'package:egov_mobile/features/admin/presentation/pages/admin_login_page.dart';
import '../../../../core/constants/app_colors.dart';

class AgentAuthPage extends StatefulWidget {
  const AgentAuthPage({super.key});

  static const routeName = '/agent-auth';

  @override
  State<AgentAuthPage> createState() => _AgentAuthPageState();
}

class _AgentAuthPageState extends State<AgentAuthPage> {
  bool _obscurePassword = true;

  final _matriculeCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();

  @override
  void dispose() {
    _matriculeCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: EgovAppBar(
        backgroundColor: AppColors.cardBg,
        leading: InkWell(
          onTap: () => Navigator.of(context).maybePop(),
          borderRadius: BorderRadius.circular(999),
          child: Container(
            margin: const EdgeInsets.only(left: 16, top: 4, bottom: 4),
            decoration: BoxDecoration(
              color: AppColors.sectionBg,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.divider),
            ),
            child: const Icon(
              Icons.arrow_back_rounded,
              size: 18,
              color: AppColors.primary,
            ),
          ),
        ),
        actions: const [],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    const _AgentHeroHeader(),
                    Container(
                      color: AppColors.cardBg,
                      child: _AgentLoginForm(
                        matriculeCtrl: _matriculeCtrl,
                        passwordCtrl: _passwordCtrl,
                        obscurePassword: _obscurePassword,
                        onToggleObscure: () => setState(
                          () => _obscurePassword = !_obscurePassword,
                        ),
                        onForgotPassword: () {},
                        onLogin: _handleLogin,
                        onNeedHelp: () {},
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _handleLogin() async {
    final identifier = _matriculeCtrl.text.trim();
    final password = _passwordCtrl.text;

    if (identifier.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez saisir votre identifiant/matricule et mot de passe.')),
      );
      return;
    }

    try {
      // 1. Appel de l'authentification réelle
      await context.read<AuthProvider>().loginAgent(identifier, password);
      
      if (!mounted) return;

      // 2. Récupération du profil pour déterminer le service
      final user = context.read<AuthProvider>().currentUser;
      
      // On détermine le rôle basé sur le champ 'service' ou le 'role' renvoyé par le backend
      AgentRole role = AgentRole.mairie;
      if (user?.service?.toLowerCase() == 'justice' || user?.role == 'AGENT_JUSTICE') {
        role = AgentRole.justice;
      }

      debugPrint("Connexion réussie pour ${user?.email} - Service identifié: ${role.name}");

      // 3. Navigation vers le portail agent avec le bon rôle
      Navigator.of(context).pushReplacementNamed(
        AgentMainScaffold.routeName,
        arguments: {'role': role},
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Échec de connexion : ${e.toString()}"),
          backgroundColor: Colors.red.shade700,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }
}

class _AgentHeroHeader extends StatelessWidget {
  const _AgentHeroHeader();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 210,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(
            'assets/images/building.png',
            fit: BoxFit.cover,
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withOpacity(0.2),
                  Colors.black.withOpacity(0.6),
                ],
              ),
            ),
          ),
          Positioned(
            top: 24,
            left: 18,
            child: Image.asset(
              'assets/images/embleme.png',
              height: 48,
              fit: BoxFit.contain,
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.white.withOpacity(0.18),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: AppColors.white.withOpacity(0.28)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.lock_outline_rounded, color: AppColors.white.withOpacity(0.9), size: 11),
                      const SizedBox(width: 5),
                      Text(
                        'ESPACE SÉCURISÉ',
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: AppColors.white.withOpacity(0.92),
                          letterSpacing: 0.6,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'Espace Agent',
                  style: GoogleFonts.outfit(
                    fontSize: 30,
                    fontWeight: FontWeight.w700,
                    color: AppColors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Portail sécurisé des agents de l\'État.',
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: AppColors.white.withOpacity(0.85),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AgentLoginForm extends StatelessWidget {
  final TextEditingController matriculeCtrl;
  final TextEditingController passwordCtrl;
  final bool obscurePassword;
  final VoidCallback onToggleObscure;
  final VoidCallback onForgotPassword;
  final VoidCallback onLogin;
  final VoidCallback onNeedHelp;

  const _AgentLoginForm({
    required this.matriculeCtrl,
    required this.passwordCtrl,
    required this.obscurePassword,
    required this.onToggleObscure,
    required this.onForgotPassword,
    required this.onLogin,
    required this.onNeedHelp,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(18, 26, 18, 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Title
          Text(
            'Authentification',
            style: GoogleFonts.outfit(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Accédez à votre compte professionnel',
            style: GoogleFonts.outfit(
              fontSize: 13,
              color: AppColors.textLight,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 28),

          const _FieldLabel('Identifiant / Matricule'),
          const SizedBox(height: 8),
          _InputNoPrefix(
            controller: matriculeCtrl,
            hintText: 'Ex: 1234567A',
            keyboardType: TextInputType.text,
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              const Expanded(child: _FieldLabel('Mot de passe')),
              GestureDetector(
                onTap: onForgotPassword,
                child: Text(
                  'Mot de passe oublié ?',
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          _PasswordInput(
            controller: passwordCtrl,
            hintText: '••••••••',
            obscureText: obscurePassword,
            onToggle: onToggleObscure,
          ),
          const SizedBox(height: 22),
          _PrimaryButton(
            label: 'Se connecter',
            isLoading: context.watch<AuthProvider>().isLoading,
            onPressed: onLogin,
          ),
          const SizedBox(height: 44),
          Center(
            child: GestureDetector(
              onTap: onNeedHelp,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 18,
                    height: 18,
                    decoration: BoxDecoration(
                      color: AppColors.sectionBg,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.divider),
                    ),
                    child: const Icon(
                      Icons.question_mark_rounded,
                      size: 12,
                      color: AppColors.textLight,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Besoin d\'aide ? Contacter le support',
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textLight,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),
          Center(
            child: GestureDetector(
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const AdminLoginPage(),
                  ),
                );
              },
              child: Text(
                'RÉPUBLIQUE DU BURKINA FASO - PORTAIL OFFICIEL',
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  fontSize: 9,
                  letterSpacing: 0.3,
                  color: AppColors.divider.withOpacity(0.9),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FieldLabel extends StatelessWidget {
  final String text;
  const _FieldLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: GoogleFonts.outfit(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: AppColors.textDark,
      ),
    );
  }
}

class _InputNoPrefix extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;
  final TextInputType? keyboardType;

  const _InputNoPrefix({
    required this.controller,
    required this.hintText,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      style: GoogleFonts.outfit(
        fontSize: 13,
        color: AppColors.textDark,
        fontWeight: FontWeight.w500,
      ),
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: GoogleFonts.outfit(
          fontSize: 13,
          color: AppColors.textLight,
          fontWeight: FontWeight.w500,
        ),
        filled: true,
        fillColor: AppColors.background,
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: AppColors.divider.withOpacity(0.9)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.4),
        ),
      ),
    );
  }
}

class _PasswordInput extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;
  final bool obscureText;
  final VoidCallback onToggle;

  const _PasswordInput({
    required this.controller,
    required this.hintText,
    required this.obscureText,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      style: GoogleFonts.outfit(
        fontSize: 13,
        color: AppColors.textDark,
        fontWeight: FontWeight.w500,
      ),
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: GoogleFonts.outfit(
          fontSize: 13,
          color: AppColors.textLight,
          fontWeight: FontWeight.w500,
        ),
        filled: true,
        fillColor: AppColors.background,
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        suffixIcon: IconButton(
          onPressed: onToggle,
          icon: Icon(
            obscureText ? Icons.visibility_outlined : Icons.visibility_off_outlined,
            size: 20,
            color: AppColors.textLight,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: AppColors.divider.withOpacity(0.9)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.4),
        ),
      ),
    );
  }
}

class _PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;

  const _PrimaryButton({
    required this.label,
    this.onPressed,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(999),
          ),
          disabledBackgroundColor: AppColors.primary.withOpacity(0.5),
        ),
        child: isLoading
            ? const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  color: AppColors.white,
                  strokeWidth: 2.5,
                ),
              )
            : Text(
                label,
                style: GoogleFonts.outfit(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.3,
                ),
              ),
      ),
    );
  }
}
