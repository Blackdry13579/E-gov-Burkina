/**
 * Validation des variables d'environnement obligatoires
 * @throws {Error} Si une variable obligatoire est manquante
 */
const validateEnv = () => {
  const requiredEnv = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'NODE_ENV'
  ];

  const missingEnv = requiredEnv.filter((env) => !process.env[env]);

  if (missingEnv.length > 0) {
    throw new Error(
      `Variables d'environnement obligatoires manquantes : ${missingEnv.join(', ')}`
    );
  }
};

module.exports = validateEnv;
