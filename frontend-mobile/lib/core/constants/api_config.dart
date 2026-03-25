
class ApiConfig {
  // URL Ngrok pour test externe stable
  static const String tunnelUrl = 'https://nonmicrobic-lorean-nonhabitually.ngrok-free.dev/api';

  static String get baseUrl {
    // Si on utilise Localtunnel, on renvoie l'URL du tunnel directement
    return tunnelUrl;
  }
}
