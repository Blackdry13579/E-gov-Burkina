import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../../../shared/presentation/widgets/egov_app_bar.dart';
import '../../../home/presentation/pages/home_page.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/providers/auth_provider.dart';

class CitizenAuthPage extends StatefulWidget {
  const CitizenAuthPage({super.key});

  static const routeName = '/citizen-auth';

  @override
  State<CitizenAuthPage> createState() => _CitizenAuthPageState();
}

class _CitizenAuthPageState extends State<CitizenAuthPage>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  bool _acceptedTerms = false;
  bool _obscurePassword = true;

  final _identifierCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _fullNameCtrl = TextEditingController();
  final _cnibCtrl = TextEditingController();
  final _dobCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _regPasswordCtrl = TextEditingController();

  int _currentStep = 1; // Pour gérer les 3 étapes d'inscription

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this, initialIndex: 0);
    _tabController.addListener(() {
      if (_tabController.indexIsChanging) {
        setState(() {});
      }
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final args = ModalRoute.of(context)?.settings.arguments;
      if (args is Map<String, dynamic> && args.containsKey('initialIndex')) {
        _tabController.animateTo(args['initialIndex'] as int);
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _identifierCtrl.dispose();
    _passwordCtrl.dispose();
    _fullNameCtrl.dispose();
    _cnibCtrl.dispose();
    _dobCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    _regPasswordCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const EgovAppBar(
        backgroundColor: AppColors.cardBg,
        actions: [],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    _HeroHeader(),
                    Container(
                      color: AppColors.cardBg,
                      child: Column(
                        children: [
                          TabBar(
                            controller: _tabController,
                            labelColor: AppColors.primary,
                            unselectedLabelColor: AppColors.textLight,
                            labelStyle: GoogleFonts.outfit(
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                            ),
                            unselectedLabelStyle: GoogleFonts.outfit(
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                            ),
                            indicatorColor: AppColors.primary,
                            indicatorWeight: 3,
                            tabs: const [
                              Tab(text: 'Se Connecter'),
                              Tab(text: 'Créer un compte'),
                            ],
                          ),
                          // Utilisation d'un switch simple au lieu de TabBarView 
                          // pour éviter les problèmes de hauteur fixe (scroll bug)
                          if (_tabController.index == 0)
                            _LoginForm(
                              identifierCtrl: _identifierCtrl,
                              passwordCtrl: _passwordCtrl,
                              obscurePassword: _obscurePassword,
                              onToggleObscure: () => setState(
                                () => _obscurePassword = !_obscurePassword,
                              ),
                              onForgotPassword: () {},
                              onLogin: _handleLogin,
                              onNeedHelp: () {},
                            )
                          else
                            _buildRegisterContent(),
                        ],
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

  Widget _buildRegisterContent() {
    switch (_currentStep) {
      case 1:
        return _RegisterStep1(
          acceptedTerms: _acceptedTerms,
          onAcceptedTermsChanged: (v) => setState(() => _acceptedTerms = v),
          fullNameCtrl: _fullNameCtrl,
          cnibCtrl: _cnibCtrl,
          dobCtrl: _dobCtrl,
          phoneCtrl: _phoneCtrl,
          onPickDate: _pickDate,
          onContinue: () => setState(() => _currentStep = 2),
        );
      case 2:
        return _RegisterStep2(
          emailCtrl: _emailCtrl,
          passwordCtrl: _regPasswordCtrl,
          onBack: () => setState(() => _currentStep = 1),
          onContinue: () => setState(() => _currentStep = 3),
        );
      case 3:
        return _RegisterStep3(
          onBack: () => setState(() => _currentStep = 2),
          onFinish: _handleRegister,
        );
      default:
        return const SizedBox.shrink();
    }
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(now.year - 18, now.month, now.day),
      firstDate: DateTime(1900),
      lastDate: now,
      helpText: 'Date de naissance',
    );
    if (picked == null) return;
    _dobCtrl.text =
        '${picked.month.toString().padLeft(2, '0')}/${picked.day.toString().padLeft(2, '0')}/${picked.year}';
  }

  Future<void> _handleLogin() async {
    final email = _identifierCtrl.text.trim();
    final password = _passwordCtrl.text;

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez remplir tous les champs.')),
      );
      return;
    }

    try {
      await context.read<AuthProvider>().loginCitoyen(email, password);
      if (!mounted) return;
      Navigator.of(context).pushReplacementNamed(HomePage.routeName);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red.shade700,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Future<void> _handleRegister() async {
    final fullName = _fullNameCtrl.text.trim();
    final phone = _phoneCtrl.text.trim();
    final email = _emailCtrl.text.trim();
    final password = _regPasswordCtrl.text;

    // Nom / Prénom : on sépare sur l'espace
    final parts = fullName.split(' ');
    final prenom = parts.isNotEmpty ? parts.first : fullName;
    final nom = parts.length > 1 ? parts.sublist(1).join(' ') : '';

    if (email.isEmpty || password.isEmpty || phone.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez remplir tous les champs obligatoires.')),
      );
      return;
    }

    try {
      await context.read<AuthProvider>().register(
        nom: nom.isEmpty ? prenom : nom,
        prenom: prenom,
        email: email,
        telephone: phone,
        password: password,
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Compte créé avec succès !'), backgroundColor: Colors.green),
      );
      Navigator.of(context).pushReplacementNamed(HomePage.routeName);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red.shade700,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }
}


class _HeroHeader extends StatelessWidget {
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
                Text(
                  'Bienvenue',
                  style: GoogleFonts.outfit(
                    fontSize: 30,
                    fontWeight: FontWeight.w700,
                    color: AppColors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Accédez à vos services administratifs en un clic.',
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

class _RegisterStep1 extends StatelessWidget {
  final bool acceptedTerms;
  final ValueChanged<bool> onAcceptedTermsChanged;
  final TextEditingController fullNameCtrl;
  final TextEditingController cnibCtrl;
  final TextEditingController dobCtrl;
  final TextEditingController phoneCtrl;
  final VoidCallback onPickDate;
  final VoidCallback onContinue;

  const _RegisterStep1({
    required this.acceptedTerms,
    required this.onAcceptedTermsChanged,
    required this.fullNameCtrl,
    required this.cnibCtrl,
    required this.dobCtrl,
    required this.phoneCtrl,
    required this.onPickDate,
    required this.onContinue,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Étape 1 sur 3',
            style: GoogleFonts.outfit(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 12),
          const _ProgressBar(value: 1 / 3),
          const SizedBox(height: 18),
          const _FieldLabel('Nom complet'),
          const SizedBox(height: 8),
          _Input(
            controller: fullNameCtrl,
            hintText: 'Ex: Jean-Baptiste Ouedraogo',
            prefixIcon: Icons.person_outline_rounded,
            keyboardType: TextInputType.name,
          ),
          const SizedBox(height: 16),
          const _FieldLabel('Numéro CNIB'),
          const SizedBox(height: 8),
          _Input(
            controller: cnibCtrl,
            hintText: 'BXXXXXXXX',
            prefixIcon: Icons.badge_outlined,
            keyboardType: TextInputType.text,
          ),
          const SizedBox(height: 16),
          const _FieldLabel('Date de naissance'),
          const SizedBox(height: 8),
          _Input(
            controller: dobCtrl,
            hintText: 'mm/dd/yyyy',
            prefixIcon: Icons.calendar_month_outlined,
            readOnly: true,
            onTap: onPickDate,
            suffix: IconButton(
              onPressed: onPickDate,
              icon: const Icon(Icons.calendar_today_outlined, size: 18),
              color: AppColors.textLight,
            ),
          ),
          const SizedBox(height: 16),
          const _FieldLabel('Téléphone'),
          const SizedBox(height: 8),
          _Input(
            controller: phoneCtrl,
            hintText: '+226 XX XX XX XX',
            prefixIcon: Icons.phone_outlined,
            keyboardType: TextInputType.phone,
          ),
          const SizedBox(height: 12),
          _TermsRow(
            value: acceptedTerms,
            onChanged: onAcceptedTermsChanged,
          ),
          const SizedBox(height: 18),
          _PrimaryButton(
            label: 'Continuer',
            onPressed: acceptedTerms ? onContinue : null,
          ),
          const SizedBox(height: 14),
          Center(
            child: Text.rich(
              TextSpan(
                style: GoogleFonts.outfit(
                  fontSize: 12.5,
                  color: AppColors.textLight,
                ),
                children: [
                  const TextSpan(text: 'Déjà un compte ?  '),
                  TextSpan(
                    text: 'Se connecter',
                    style: GoogleFonts.outfit(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
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
}

class _LoginForm extends StatelessWidget {
  final TextEditingController identifierCtrl;
  final TextEditingController passwordCtrl;
  final bool obscurePassword;
  final VoidCallback onToggleObscure;
  final VoidCallback onForgotPassword;
  final VoidCallback onLogin;
  final VoidCallback onNeedHelp;

  const _LoginForm({
    required this.identifierCtrl,
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
      padding: const EdgeInsets.fromLTRB(18, 22, 18, 22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const _FieldLabel('Email ou Identifiant Unique'),
          const SizedBox(height: 8),
          _InputNoPrefix(
            controller: identifierCtrl,
            hintText: 'Ex: mon.email@domaine.bf',
            keyboardType: TextInputType.emailAddress,
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

class _Input extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;
  final IconData prefixIcon;
  final TextInputType? keyboardType;
  final bool readOnly;
  final VoidCallback? onTap;
  final Widget? suffix;

  const _Input({
    required this.controller,
    required this.hintText,
    required this.prefixIcon,
    this.keyboardType,
    this.readOnly = false,
    this.onTap,
    this.suffix,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      readOnly: readOnly,
      onTap: onTap,
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
        fillColor: AppColors.cardBg,
        prefixIcon: Icon(prefixIcon, color: AppColors.textLight, size: 20),
        suffixIcon: suffix,
        contentPadding: const EdgeInsets.symmetric(vertical: 16),
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
        fillColor: AppColors.cardBg,
        contentPadding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: AppColors.divider.withOpacity(0.9)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
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
        fillColor: AppColors.cardBg,
        contentPadding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
        suffixIcon: IconButton(
          onPressed: onToggle,
          icon: Icon(
            obscureText ? Icons.visibility_outlined : Icons.visibility_off_outlined,
            size: 20,
            color: AppColors.textLight,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: AppColors.divider.withOpacity(0.9)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.4),
        ),
      ),
    );
  }
}

class _ProgressBar extends StatelessWidget {
  final double value;
  const _ProgressBar({required this.value});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(999),
      child: SizedBox(
        height: 6,
        child: LinearProgressIndicator(
          value: value,
          backgroundColor: AppColors.divider,
          valueColor: const AlwaysStoppedAnimation(AppColors.primary),
        ),
      ),
    );
  }
}

class _TermsRow extends StatelessWidget {
  final bool value;
  final ValueChanged<bool> onChanged;

  const _TermsRow({required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 2),
          child: SizedBox(
            width: 22,
            height: 22,
            child: Checkbox(
              value: value,
              onChanged: (v) => onChanged(v ?? false),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(4),
              ),
              activeColor: AppColors.primary,
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Text.rich(
            TextSpan(
              style: GoogleFonts.outfit(
                fontSize: 12.5,
                color: AppColors.textLight,
                height: 1.4,
              ),
              children: [
                const TextSpan(text: 'J\'accepte les '),
                TextSpan(
                  text: 'conditions d\'utilisation',
                  style: GoogleFonts.outfit(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                    decoration: TextDecoration.underline,
                  ),
                ),
                const TextSpan(text: ' et la politique\n'),
                const TextSpan(text: 'de confidentialité.'),
              ],
            ),
          ),
        ),
      ],
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
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
        child: isLoading
            ? const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 2,
                ),
              )
            : Text(
                label,
                style: GoogleFonts.outfit(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
      ),
    );
  }
}

class _RegisterStep2 extends StatelessWidget {
  final TextEditingController emailCtrl;
  final TextEditingController passwordCtrl;
  final VoidCallback onBack;
  final VoidCallback onContinue;

  const _RegisterStep2({
    required this.emailCtrl,
    required this.passwordCtrl,
    required this.onBack, 
    required this.onContinue
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Étape 2 sur 3',
            style: GoogleFonts.outfit(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 12),
          const _ProgressBar(value: 2 / 3),
          const SizedBox(height: 24),
          const _FieldLabel('Adresse E-mail'),
          const SizedBox(height: 8),
          _InputNoPrefix(
            controller: emailCtrl,
            hintText: 'votre@email.com',
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 16),
          const _FieldLabel('Mot de passe'),
          const SizedBox(height: 8),
          _PasswordInput(
            controller: passwordCtrl,
            hintText: '••••••••',
            obscureText: true,
            onToggle: () {}, // À améliorer si besoin
          ),
          const SizedBox(height: 32),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: onBack,
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    side: const BorderSide(color: AppColors.divider),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: Text(
                    'Retour',
                    style: GoogleFonts.outfit(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textDark,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _PrimaryButton(
                  label: 'Continuer',
                  onPressed: onContinue,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _RegisterStep3 extends StatelessWidget {
  final VoidCallback onBack;
  final VoidCallback onFinish;

  const _RegisterStep3({required this.onBack, required this.onFinish});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Étape 3 sur 3',
            style: GoogleFonts.outfit(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 12),
          const _ProgressBar(value: 3 / 3),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.primary.withOpacity(0.2)),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline, color: AppColors.primary),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Veuillez vérifier vos informations avant de finaliser.',
                    style: GoogleFonts.outfit(
                      fontSize: 13,
                      color: AppColors.primary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: onBack,
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    side: const BorderSide(color: AppColors.divider),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: Text(
                    'Retour',
                    style: GoogleFonts.outfit(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textDark,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _PrimaryButton(
                  label: 'Terminer',
                  onPressed: onFinish,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
