import 'dart:io';

void main() async {
  final result = await Process.run('flutter', ['build', 'apk', '--debug']);
  File('build_debug.txt').writeAsStringSync(result.stdout.toString() + '\n' + result.stderr.toString());
}
