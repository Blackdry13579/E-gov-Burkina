# 🏛️ E-Gov Burkina Faso : Plateforme de Services Publics Numériques
![E-Gov Burkina](https://img.shields.io/badge/Status-En%20Développement-green?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

Une plateforme gouvernementale complète (Web, Mobile et API) conçue pour digitaliser et moderniser l'accès aux documents administratifs au Burkina Faso (Extrait de Naissance, Casier Judiciaire, Certificat de Nationalité).

## 🌟 Présentation du Projet
Ce projet vise à rapprocher l'administration des citoyens en dématérialisant les démarches fastidieuses. La solution intègre trois cibles principales :
1. **Le Citoyen** : Peut faire ses demandes en ligne, payer, et télécharger ses actes administratifs certifiés depuis son smartphone ou ordinateur.
2. **L'Agent de l'État** : Traite, valide et appose électroniquement sa signature sur les documents via un espace de travail ergonomique.
3. **L'Administrateur** : Supervise la plateforme, configure les documents et gère les accès des agents.

---

## 🏗️ Architecture Technique (Monorepo)

Le projet est divisé en trois (3) grands écosystèmes hébergés dans ce dépôt monolithique :

### 1. ⚙️ Backend (`/backend`)
Une API RESTful robuste et hautement sécurisée qui sert d'épine dorsale à l'application.
* **Environnement** : Node.js avec Express.js
* **Base de données** : MongoDB (avec Mongoose ODM)
* **Authentification** : JSON Web Tokens (JWT) & bcrypt
* **Génération de PDF** : `pdfkit` pour la création dynamique des documents finaux avec QR code d'authenticité intégré.
* **Stockage Cloud** : Cloudinary (pour le stockage des scans de justificatifs et documents PDF générés)

### 2. 💻 Frontend Web (`/frontend-web`)
Portail web universel et responsive pour les Citoyens, Agents et Administrateurs.
* **Framework** : React.js (via Vite)
* **Design & UI** : Tailwind CSS, interface "Glassmorphism" et "Neumorphism" légère, et icônes asynchrones via `lucide-react`.
* **Routage** : React Router DOM.
* **Fonctions clés** : Suivi des statuts en temps réel, Workflow par étapes de dépôts de formulaires, Dashboards analytiques pour l'administration.

### 3. 📱 Frontend Mobile (`/frontend-mobile`)
Application CiviDoc destinée exclusivement aux Citoyens pour un usage ultra-accessible en mobilité.
* **Framework** : Flutter (iOS & Android)
* **Architecture** : Provider pour la gestion des états
* **Composants** : Design System aligné sur la version Web, navigation fluide, et interface de chargement de documents via l'appareil photo du téléphone.

---

## 🚀 Fonctionnalités Clés

* **Authentification Universelle & 2FA** : Système d'authentification robuste avec une protection par code PIN temporaire (2FA) pour les connexions Administrateur.
* **Moteur d'Étapes (Stepper)** : Formulaire de demande dynamique auto-adaptatif multi-étapes (Identité -> Pièces justificatives -> Paiement).
* **Générateur Administratif** : Compilation des données soumises par le citoyen (Père, Mère, Sexe) pour imprimer un PDF structuré au format légal du gouvernement sans saisie manuelle lourde de l'agent.
* **Paiement Mobile Intégré** : Support théorique pour l'intégration des API Mobile Money (Moov, Orange, Coris).
* **Historique & Traçabilité** : Chaque action (validation, rejet, demande de documents complémentaires) de l'agent engendre un "Audit Log" pour respecter la conformité légale de l'État.

---

## ⚙️ Déploiement et Installation en Local
     technical part
### Prérequis
- **Node.js** (v18+)
- **MongoDB** (Installé en local ou URI MongoDB Atlas)
- **Flutter SDK** (v3.19.0+ pour l'application Mobile)
- **Git**

### 1. Configuration du Backend
```bash
cd backend
npm install
```
Créer un fichier `.env` à la racine de `/backend` :
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/egov-burkina
JWT_SECRET=votre_clef_secrete_jwt
CLOUDINARY_CLOUD_NAME=votre_nom_cloudinary
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
FRONTEND_URL=http://localhost:5173
```
Démarrer le serveur :
```bash
npm run dev
```

### 2. Configuration du Frontend Web
```bash
cd frontend-web
npm install
```
Créer un fichier `.env` à la racine de `/frontend-web` :
```env
VITE_API_URL=http://localhost:5000/api
```
Lancer l'environnement de développement :
```bash
npm run dev
```

### 3. Configuration du Frontend Mobile (Flutter)
```bash
cd frontend-mobile
flutter pub get
```
Exécuter l'application sur un émulateur ou appareil branché :
```bash
flutter run
```

---

## 🔒 Sécurité et Mentions
Ce projet simule des données gouvernementales et met en avant de bonnes pratiques de sécurisation (hachage, CORS, limitation de requêtes, génération de JWT avec expirations). Dans l'état actuel de démonstration, les bypass de PIN admin (tel que l'utilisation de `0000`) sont actifs explicitement pour fluidifier des soutenances ou présentations scolaires/universitaires sans dépendance stricte aux envois SMTP.
