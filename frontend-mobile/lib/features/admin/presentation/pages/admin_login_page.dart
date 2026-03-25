import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/constants/app_colors.dart';
import 'admin_home_page.dart';

class AdminLoginPage extends StatefulWidget {
  const AdminLoginPage({super.key});

  @override
  State<AdminLoginPage> createState() => _AdminLoginPageState();
}

class _AdminLoginPageState extends State<AdminLoginPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _pinController = TextEditingController();
  bool _obscurePassword = true;
  bool _isPinRequested = false;
  bool _isLoading = false;

  // Colors
  static const Color primaryNavy = Color(0xFF1a237e);
  static const Color adminRed = Color(0xFF991b1b);
  static const Color lightRed = Color(0xFFfef2f2);
  static const Color goldColor = Color(0xFFd4af37);
  static const Color inputBorder = Color(0xFFe2e8f0);
  static const Color labelDark = Color(0xFF1e293b);
  static const Color textGray = Color(0xFF64748b);
  static const Color warningBg = Color(0xFFfef3c7);
  static const Color warningOrange = AppColors.warning;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: primaryNavy),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 8),
              _buildHeader(),
              const SizedBox(height: 32),
              _buildAdminBadge(),
              const SizedBox(height: 32),
              _buildLoginForm(),
              const SizedBox(height: 32),
              _buildSecurityWarning(),
              const SizedBox(height: 48),
              _buildFooter(),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
              ),
              child: Image.asset(
                'assets/images/embleme.png',
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) =>
                    const Icon(Icons.account_balance, color: primaryNavy, size: 32),
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "E-Gov Burkina",
                  style: GoogleFonts.publicSans(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: primaryNavy,
                  ),
                ),
                Text(
                  "PORTAIL OFFICIEL",
                  style: GoogleFonts.publicSans(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: textGray,
                    letterSpacing: 2,
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          width: 60,
          height: 2,
          color: goldColor,
        ),
      ],
    );
  }

  Widget _buildAdminBadge() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: lightRed,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: adminRed.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: const BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.admin_panel_settings_rounded, color: adminRed, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Espace Administrateur",
                  style: GoogleFonts.publicSans(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: adminRed,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  "Accès restreint et sécurisé",
                  style: GoogleFonts.publicSans(
                    fontSize: 12,
                    color: textGray,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoginForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel("Email administrateur"),
        const SizedBox(height: 8),
        _buildInputField(
          controller: _emailController,
          hint: "admin@egov.bf",
          icon: Icons.email_outlined,
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 20),
        _buildLabel("Mot de passe"),
        const SizedBox(height: 8),
        _buildInputField(
          controller: _passwordController,
          hint: "••••••••",
          icon: Icons.lock_outline_rounded,
          isPassword: true,
          obscureText: _obscurePassword,
          onTogglePassword: () => setState(() => _obscurePassword = !_obscurePassword),
        ),
        if (_isPinRequested) ...[
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildLabel("Code PIN (4 chiffres)"),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              const Icon(Icons.info_outline_rounded, color: textGray, size: 14),
              const SizedBox(width: 4),
              Text(
                "Code valable 5 minutes.",
                style: GoogleFonts.publicSans(fontSize: 11, color: textGray),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildPinInputField(),
        ],
        const SizedBox(height: 32),
        if (!_isPinRequested)
          _buildActionButton(
            label: "Recevoir le code PIN par email",
            icon: Icons.sms_outlined,
            isOutlined: true,
            isLoading: _isLoading,
            onPressed: () async {
              final email = _emailController.text.trim();
              final password = _passwordController.text;
              if (email.isEmpty || password.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Veuillez remplir l\'email et le mot de passe.')),
                );
                return;
              }
              setState(() => _isLoading = true);
              try {
                await context.read<AuthProvider>().requestAdminPin(email, password);
                if (mounted) {
                  setState(() { _isPinRequested = true; _isLoading = false; });
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Code PIN envoyé à votre email.'), backgroundColor: Colors.green),
                  );
                  // Bypass test : pré-remplir si admin@egov.bf
                  if (email == 'admin@egov.bf') _pinController.text = '0000';
                }
              } catch (e) {
                if (mounted) {
                  setState(() => _isLoading = false);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(e.toString()), backgroundColor: Colors.red.shade700),
                  );
                }
              }
            },
          )
        else
          _buildActionButton(
            label: "Accéder au panneau admin",
            icon: Icons.admin_panel_settings_rounded,
            isLoading: _isLoading,
            onPressed: _pinController.text.length == 4 ? () async {
              final email = _emailController.text.trim();
              final password = _passwordController.text;
              final pin = _pinController.text;
              setState(() => _isLoading = true);
              try {
                await context.read<AuthProvider>().loginAdmin(email, password, pin);
                if (mounted) {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const AdminHomePage()),
                    (route) => false,
                  );
                }
              } catch (e) {
                if (mounted) {
                  setState(() => _isLoading = false);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(e.toString()), backgroundColor: Colors.red.shade700),
                  );
                }
              }
            } : null,
          ),
      ],
    );
  }

  Widget _buildLabel(String text) {
    return Text(
      text,
      style: GoogleFonts.publicSans(
        fontSize: 14,
        fontWeight: FontWeight.bold,
        color: labelDark,
      ),
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    bool isPassword = false,
    bool obscureText = false,
    VoidCallback? onTogglePassword,
    TextInputType? keyboardType,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      style: GoogleFonts.publicSans(color: labelDark, fontSize: 15),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.publicSans(color: textGray.withOpacity(0.5), fontSize: 15),
        prefixIcon: Icon(icon, color: primaryNavy, size: 20),
        suffixIcon: isPassword
            ? IconButton(
                icon: Icon(
                  obscureText ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                  color: textGray,
                  size: 20,
                ),
                onPressed: onTogglePassword,
              )
            : null,
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(vertical: 16),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: inputBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primaryNavy, width: 2),
        ),
      ),
    );
  }

  Widget _buildPinInputField() {
    return TextField(
      controller: _pinController,
      maxLength: 4,
      keyboardType: TextInputType.number,
      textAlign: TextAlign.center,
      onChanged: (v) => setState(() {}),
      style: GoogleFonts.publicSans(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: primaryNavy,
        letterSpacing: 12,
      ),
      decoration: InputDecoration(
        counterText: "",
        hintText: "• • • •",
        hintStyle: GoogleFonts.publicSans(
          fontSize: 24,
          color: textGray.withOpacity(0.3),
          letterSpacing: 12,
        ),
        filled: true,
        fillColor: const Color(0xFFf8fafc),
        contentPadding: const EdgeInsets.symmetric(vertical: 16),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: inputBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primaryNavy, width: 2),
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required String label,
    required IconData icon,
    bool isOutlined = false,
    bool isLoading = false,
    VoidCallback? onPressed,
  }) {
    if (isOutlined) {
      return SizedBox(
        width: double.infinity,
        height: 50,
        child: OutlinedButton.icon(
          onPressed: onPressed,
          icon: Icon(icon, size: 20),
          label: Text(label),
          style: OutlinedButton.styleFrom(
            foregroundColor: primaryNavy,
            side: const BorderSide(color: primaryNavy),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            textStyle: GoogleFonts.publicSans(fontSize: 14, fontWeight: FontWeight.bold),
          ),
        ),
      );
    }

    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: isLoading ? const SizedBox.shrink() : Icon(icon, size: 20),
        label: isLoading
            ? const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
              )
            : Text(label),
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryNavy,
          foregroundColor: Colors.white,
          disabledBackgroundColor: const Color(0xFFe2e8f0),
          disabledForegroundColor: textGray,
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: GoogleFonts.publicSans(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _buildSecurityWarning() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: warningBg,
        borderRadius: BorderRadius.circular(12),
        border: const Border(left: BorderSide(color: warningOrange, width: 4)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.warning_amber_rounded, color: warningOrange, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              "Toute tentative d'accès non autorisée est enregistrée et peut faire l'objet de poursuites judiciaires.",
              style: GoogleFonts.publicSans(
                fontSize: 11,
                color: warningOrange.withOpacity(0.9),
                fontStyle: FontStyle.italic,
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    return Center(
      child: Text(
        "© 2026 GOUVERNEMENT DU BURKINA FASO",
        style: GoogleFonts.publicSans(
          fontSize: 10,
          color: textGray,
          letterSpacing: 1.5,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
