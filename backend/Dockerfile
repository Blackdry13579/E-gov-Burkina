# Utiliser une image Node officielle avec support Chrome
FROM ghcr.io/puppeteer/puppeteer:22.0.0

# Dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Passer en utilisateur root pour les installs si nécessaire
USER root

# Installation des dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Créer le dossier pour les uploads locaux au cas où
RUN mkdir -p uploads/documents && chown -R pptruser:pptruser uploads

# Revenir à l'utilisateur non-privilégié de l'image puppeteer
USER pptruser

# Exposer le port de Render (Render injecte le port via la variable PORT)
EXPOSE 10000

# Commande de démarrage
CMD ["node", "src/server.js"]
