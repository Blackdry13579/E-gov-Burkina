import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../constants/api_config.dart';
import 'package:flutter/foundation.dart';

Map<String, dynamic>? _decodeJsonMap(String body) {
  final decoded = jsonDecode(body);
  if (decoded is Map<String, dynamic>) return decoded;
  return null;
}

dynamic _decodeJson(String body) => jsonDecode(body);

class ApiService {
  static String get baseUrl => ApiConfig.baseUrl;

  static const Duration _timeout = Duration(seconds: 90);

  Map<String, String> _headers({String? token}) => {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Pour éviter l'écran d'avertissement de ngrok
        if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
      };

  Future<dynamic> get(String endpoint, {String? token}) async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl$endpoint'), headers: _headers(token: token))
          .timeout(_timeout);
      return await _handleResponse(response);
    } on SocketException {
      throw Exception('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } on TimeoutException {
      throw Exception('Délai dépassé. Le serveur ne répond pas.');
    }
  }

  Future<dynamic> post(String endpoint, dynamic body, {String? token}) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl$endpoint'),
            headers: _headers(token: token),
            body: jsonEncode(body),
          )
          .timeout(_timeout);
      return await _handleResponse(response);
    } on SocketException {
      throw Exception('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } on TimeoutException {
      throw Exception('Délai dépassé. Le serveur ne répond pas.');
    }
  }

  Future<dynamic> postMultipart(
    String endpoint,
    Map<String, String> fields,
    Map<String, File> files, {
    String? token,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final request = http.MultipartRequest('POST', uri);

      // Headers
      request.headers.addAll(_headers(token: token));
      // Multipart needs its own content-type handled by the request object
      request.headers.remove('Content-Type');

      // Fields
      request.fields.addAll(fields);

      // Files
      for (var entry in files.entries) {
        final stream = http.ByteStream(entry.value.openRead());
        final length = await entry.value.length();
        final multipartFile = http.MultipartFile(
          entry.key,
          stream,
          length,
          filename: entry.value.path.split('/').last,
        );
        request.files.add(multipartFile);
      }

      final streamedResponse = await request.send().timeout(_timeout);
      final response = await http.Response.fromStream(streamedResponse);
      return await _handleResponse(response);
    } on SocketException {
      throw Exception('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } on TimeoutException {
      throw Exception('Délai dépassé. Le serveur ne répond pas.');
    }
  }

  Future<dynamic> put(String endpoint, dynamic body, {String? token}) async {
    try {
      final response = await http
          .put(
            Uri.parse('$baseUrl$endpoint'),
            headers: _headers(token: token),
            body: jsonEncode(body),
          )
          .timeout(_timeout);
      return await _handleResponse(response);
    } on SocketException {
      throw Exception('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } on TimeoutException {
      throw Exception('Délai dépassé. Le serveur ne répond pas.');
    }
  }

  Future<dynamic> patch(String endpoint, dynamic body, {String? token}) async {
    try {
      final response = await http
          .patch(
            Uri.parse('$baseUrl$endpoint'),
            headers: _headers(token: token),
            body: jsonEncode(body),
          )
          .timeout(_timeout);
      return await _handleResponse(response);
    } on SocketException {
      throw Exception('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } on TimeoutException {
      throw Exception('Délai dépassé. Le serveur ne répond pas.');
    }
  }

  Future<dynamic> delete(String endpoint, {String? token}) async {
    try {
      final response = await http
          .delete(Uri.parse('$baseUrl$endpoint'), headers: _headers(token: token))
          .timeout(_timeout);
      return await _handleResponse(response);
    } on SocketException {
      throw Exception('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } on TimeoutException {
      throw Exception('Délai dépassé. Le serveur ne répond pas.');
    }
  }

  Future<dynamic> _handleResponse(http.Response response) async {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return {'success': true};
      // Decode en isolate pour éviter de bloquer le main thread.
      return await compute(_decodeJson, response.body);
    }

    String message = 'Erreur ${response.statusCode}';
    try {
      // Decode en isolate puis extraire le message.
      final decodedMap = await compute(_decodeJsonMap, response.body);
      message = decodedMap?['message']?.toString() ?? message;
    } catch (_) {}

    if (response.statusCode == 401) {
      throw ApiUnauthorizedException(message);
    }
    if (response.statusCode == 403) {
      throw ApiForbiddenException(message);
    }
    throw ApiException(message, response.statusCode);
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;
  ApiException(this.message, this.statusCode);
  @override
  String toString() => message;
}

class ApiUnauthorizedException extends ApiException {
  ApiUnauthorizedException(String message) : super(message, 401);
}

class ApiForbiddenException extends ApiException {
  ApiForbiddenException(String message) : super(message, 403);
}
