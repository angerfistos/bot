# Mon Projet React avec Vite et Tailwind CSS

Ce projet est un modèle de base pour une application React utilisant Vite et Tailwind CSS. Il est organisé de manière à faciliter le développement et la maintenance du code.

## Installation

1. **Cloner le dépôt**
   ```sh
   git clone <url_du_repository>
   cd mon-projet
   ```

2. **Installer les dépendances**
   ```sh
   npm install
   ```

3. **Lancer le serveur de développement**
   ```sh
   npm run dev
   ```

## Structure du Projet

```
.
├── README.md              # Documentation du projet
├── eslint.config.js       # Configuration ESLint pour linting du code
├── index.html             # Fichier principal HTML, contient la div root
├── package-lock.json      # Verrouillage des dépendances
├── package.json           # Liste des dépendances et scripts
├── postcss.config.js      # Configuration de PostCSS pour Tailwind CSS
├── public/                # Fichiers publics accessibles directement
│   └── vite.svg           # Exemple d'asset public
├── src/                   # Dossier principal contenant le code source
│   ├── App.jsx            # Composant principal de l'application
│   ├── assets/            # Dossier pour stocker les ressources (images, icônes, etc.)
│   │   └── react.svg      # Exemple d'icône React
│   ├── components/        # Composants réutilisables
│   │   ├── Button.jsx     # Bouton réutilisable
│   │   ├── Header.jsx     # En-tête global
│   │   ├── Footer.jsx     # Pied de page global
│   ├── hooks/             # Hooks personnalisés
│   │   ├── useFetch.js    # Hook personnalisé pour fetcher des données
│   ├── layouts/           # Composants de mise en page
│   │   ├── MainLayout.jsx # Mise en page principale avec Header/Footer
│   ├── pages/             # Pages principales de l'application
│   │   ├── Home.jsx       # Page d'accueil
│   │   ├── About.jsx      # Page "À propos"
│   ├── services/          # Gestion des requêtes API
│   │   ├── ApiRequest.js  # Fonctions pour interagir avec l'API
│   ├── styles/            # Dossier contenant les styles CSS globaux
│   │   ├── tailwind.css   # Fichier principal Tailwind CSS
│   ├── index.css          # Fichier CSS global
│   ├── main.jsx           # Point d'entrée principal React
├── structure.txt          # Fichier listant la structure du projet
├── tailwind.config.js     # Configuration Tailwind CSS
└── vite.config.js         # Configuration de Vite
```

## Bibliothèques utilisées

### **Dépendances principales**
- **@hookform/resolvers** : Gestion de la validation des formulaires avec `react-hook-form` et `yup`.
- **axios** : Client HTTP pour les appels API.
- **react** : Bibliothèque principale pour la création d'interfaces utilisateur.
- **react-dom** : Intégration de React avec le DOM.
- **react-hook-form** : Gestion avancée des formulaires avec React.
- **react-router-dom** : Gestion de la navigation entre les pages.
- **yup** : Bibliothèque de validation de formulaires.

### **Dépendances de développement**
- **@eslint/js** : ESLint pour la qualité du code.
- **@types/react** & **@types/react-dom** : Types pour TypeScript (utile même si le projet est en JS pur).
- **@vitejs/plugin-react** : Plugin Vite pour React.
- **autoprefixer** : Ajout automatique des préfixes CSS pour la compatibilité des navigateurs.
- **eslint** : Outil d'analyse statique du code.
- **eslint-plugin-react** : Règles ESLint spécifiques à React.
- **eslint-plugin-react-hooks** : Vérification des hooks React.
- **eslint-plugin-react-refresh** : Amélioration du rechargement à chaud avec React.
- **globals** : Bibliothèque de gestion des variables globales en JS.
- **postcss** : Outil de transformation CSS avancée.
- **tailwindcss** : Framework CSS utilitaire.
- **vite** : Outil de build rapide pour les projets frontend.

## Lancement et développement

1. **Démarrer le projet**
   ```sh
   npm run dev
   ```

2. **Générer un build de production**
   ```sh
   npm run build
   ```

3. **Prévisualiser le build**
   ```sh
   npm run preview
   ```

## Technologies utilisées
- **React** : Bibliothèque principale pour l'interface utilisateur.
- **Vite** : Outil de développement rapide pour React.
- **Tailwind CSS** : Framework CSS utilitaire.
- **ESLint** : Analyse du code pour respecter les bonnes pratiques.
- **PostCSS** : Transformations CSS avancées.

🚀 **Prêt à coder !**
