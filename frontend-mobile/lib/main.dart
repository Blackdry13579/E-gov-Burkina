import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/constants/app_theme.dart';
import 'core/providers/auth_provider.dart';
import 'core/providers/demande_provider.dart';
import 'core/providers/document_provider.dart';
import 'core/providers/request_provider.dart';
import 'core/providers/user_management_provider.dart';
import 'core/providers/stats_provider.dart';
import 'core/providers/agent_provider.dart';
import 'core/providers/notification_provider.dart';

import 'features/splash/presentation/pages/splash_page.dart';
import 'features/landing/landing_page.dart';
import 'features/auth/presentation/pages/citizen_auth_page.dart';
import 'features/auth/presentation/pages/agent_auth_page.dart';
import 'features/home/presentation/pages/home_page.dart';
import 'features/agent/presentation/pages/detail_demande_page.dart';
import 'features/agent/presentation/pages/agent_validation_success_page.dart';
import 'scaffolds/agent_main_scaffold.dart';
import 'features/shared/domain/models/demande_model.dart';
import 'features/agent/domain/models/agent_config.dart';
import 'features/notifications/presentation/pages/notifications_page.dart';

import 'scaffolds/citizen_main_scaffold.dart';
import 'features/admin/presentation/pages/admin_home_page.dart';
import 'features/admin/presentation/pages/admin_demandes_page.dart';
import 'features/admin/presentation/pages/admin_users_page.dart';
import 'features/admin/presentation/pages/admin_documents_page.dart';
import 'features/admin/presentation/pages/admin_profile_page.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const EGovApp());
}

class EGovApp extends StatelessWidget {
  const EGovApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => DemandeProvider()),
        ChangeNotifierProvider(create: (_) => DocumentProvider()),
        ChangeNotifierProvider(create: (_) => RequestProvider()),
        ChangeNotifierProvider(create: (_) => UserManagementProvider()),
        ChangeNotifierProvider(create: (_) => StatsProvider()),
        ChangeNotifierProvider(create: (_) => AgentProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
      ],
      child: MaterialApp(
        title: 'E-Gov Burkina',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        initialRoute: SplashPage.routeName,
        routes: {
          SplashPage.routeName: (_) => const SplashPage(),
          LandingPage.routeName: (_) => const LandingPage(),
          CitizenAuthPage.routeName: (_) => const CitizenAuthPage(),
          AgentAuthPage.routeName: (_) => const AgentAuthPage(),
          HomePage.routeName: (_) => const CitizenMainScaffold(initialIndex: 0),
          '/citizen-catalogue': (_) => const CitizenMainScaffold(initialIndex: 1),
          '/citizen-demandes': (_) => const CitizenMainScaffold(initialIndex: 2),
          '/citizen-profile': (_) => const CitizenMainScaffold(initialIndex: 3),
          // AgentMainScaffold.routeName est géré par onGenerateRoute pour supporter les arguments
          AgentDetailDemandePage.routeName: (_) => const AgentDetailDemandePage(),
          NotificationsPage.routeName: (_) => const NotificationsPage(),
          AdminProfilePage.routeName: (_) => const AdminProfilePage(),
          AdminHomePage.routeName: (_) => const AdminHomePage(),
          AdminDemandesPage.routeName: (_) => const AdminDemandesPage(),
          AdminUsersPage.routeName: (_) => const AdminUsersPage(),
          AdminDocumentsPage.routeName: (_) => const AdminDocumentsPage(),
        },
        onGenerateRoute: (settings) {
          if (settings.name == '/agent-validation-success') {
            final args = settings.arguments;
            if (args is! Map<String, dynamic>) {
              return MaterialPageRoute(builder: (_) => const LandingPage());
            }
            final model = DemandeModel.fromMap(args);
            return MaterialPageRoute(
              builder: (context) => AgentValidationSuccessPage(demande: model),
            );
          }
          
          if (settings.name == AgentMainScaffold.routeName) {
            final args = settings.arguments;
            AgentRole role = AgentRole.justice;
            if (args is Map<String, dynamic>) {
              role = args['role'] as AgentRole? ?? AgentRole.justice;
            }
            return MaterialPageRoute(
              builder: (_) => AgentMainScaffold(role: role),
            );
          }
          return null;
        },
      ),
    );
  }
}
