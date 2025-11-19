# French Regions and Municipalities Search Application

[🇫🇷 Version Française](#version-française) | [🇬🇧 English Version](#english-version)

---

## English Version

### 📋 Project Overview

This is a technical test project for a Frontend Developer position. The application allows users to search for French regions, view their departments, and explore municipalities using the official French government API ([geo.api.gouv.fr](https://geo.api.gouv.fr)).

**Technologies Used:**
- Angular 20.3.0
- TypeScript 5.9.2
- RxJS 7.8.0
- Jasmine/Karma for testing
- Cypress for E2E testing
- Standalone Components
- Angular Signals for state management

### 🎯 Project Requirements

The test required building a web application with the following features:

1. **Region Search Page**
   - Autocomplete search for French regions
   - Display list of departments for selected region
   - Navigate to department's municipalities

2. **Municipality List Page**
   - Display all municipalities of a selected department
   - Pagination functionality
   - Navigation back to region search

### ✨ Implemented Features

#### Core Features (Required)
- ✅ Region search with autocomplete (minimum 2 characters)
- ✅ Display departments by selected region
- ✅ Municipality list with pagination
- ✅ Responsive design
- ✅ Navigation between pages
- ✅ Loading states
- ✅ Error handling

#### Additional Features (Bonus)
- ✅ **Dark Mode Theme** - Toggle between light and dark themes with localStorage persistence
- ✅ **URL-based Navigation** - Direct access to regions and departments via URL
- ✅ **Advanced Pagination** - Configurable page sizes (5, 10, 20, 50, 100 items per page)
- ✅ **Smooth Animations** - Transitions and hover effects
- ✅ **TypeScript Strict Mode** - Type safety throughout the application
- ✅ **Comprehensive Testing** - 49 unit tests with 100% pass rate
- ✅ **Standalone Components** - Modern Angular architecture
- ✅ **Signals-based State** - Reactive state management with Angular Signals

### 🏗️ Architecture

```
src/app/
├── components/
│   ├── region-search-component/     # Region search with autocomplete
│   ├── municipality-component/      # Municipality list with pagination
│   └── theme-component/             # Dark mode toggle
├── services/
│   ├── region/                      # Region API service
│   ├── department/                  # Department API service
│   ├── municipality/                # Municipality API service
│   └── theme/                       # Theme management service
├── models/
│   ├── region.model.ts
│   ├── department.model.ts
│   └── municipality.model.ts
└── app.routes.ts                    # Application routing
```

### 🎨 Design Decisions

1. **Standalone Components**: Used modern Angular standalone components for better tree-shaking and modularity
2. **Signals**: Implemented Angular Signals for reactive state management instead of traditional observables where appropriate
3. **CSS Variables**: Theme system built with CSS custom properties for easy dark mode implementation
4. **Debounced Search**: 300ms debounce on autocomplete to reduce API calls
5. **Smart Pagination**: Ellipsis-based page number display for large datasets
6. **URL State**: Region code in URL allows direct linking and browser back/forward navigation

### 🚀 Getting Started

#### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

#### Installation

```bash
# Clone the repository
git clone [repository-url]
cd testTechniqueFrontendBauchot

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200/`

#### Available Scripts

```bash
# Development server
npm start           # or ng serve

# Build for production
npm run build       # or ng build

# Run unit tests
npm test            # or ng test

# Run E2E tests
npm run e2e         # or ng e2e

# Open Cypress
npm run cypress:open
```

### 🧪 Testing

The application includes comprehensive test coverage:

- **49 Unit Tests** (Jasmine/Karma)
  - Component tests
  - Service tests
  - Integration tests
- **E2E Tests** (Cypress ready)

Run tests with:
```bash
npm test
```

All tests pass with 100% success rate.

### 📱 Features Showcase

#### 1. Region Search
- Type at least 2 characters to trigger autocomplete
- Click on a region to view its departments
- Departments are clickable to view municipalities

#### 2. Dark Mode
- Toggle between light and dark themes
- Preference saved in localStorage
- Smooth transitions between themes
- System preference detection on first load

#### 3. Municipality Pagination
- Configurable page sizes
- Ellipsis-based page navigation
- Page count and item range display
- Responsive pagination controls

#### 4. Navigation
- URL-based routing for shareable links
- Browser back/forward support
- "Back" button to return to department list
- "New Search" button to start over

### API Endpoints (used)
- Regions (autocomplete): https://geo.api.gouv.fr/regions?nom={name}
- Departments by region: https://geo.api.gouv.fr/regions/{regionCode}/departements
- Municipalities by department: https://geo.api.gouv.fr/departements/{deptCode}/communes

### 👤 Author

**Antoine Bauchot**

---

## Version Française

### 📋 Aperçu du Projet

Ceci est un projet de test technique pour un poste de Développeur Frontend. L'application permet aux utilisateurs de rechercher des régions françaises, de visualiser leurs départements et d'explorer les communes en utilisant l'API officielle du gouvernement français ([geo.api.gouv.fr](https://geo.api.gouv.fr)).

**Technologies Utilisées :**
- Angular 20.3.0
- TypeScript 5.9.2
- RxJS 7.8.0
- Jasmine/Karma pour les tests
- Cypress pour les tests E2E
- Composants Standalone
- Angular Signals pour la gestion d'état

### 🎯 Exigences du Projet

Le test nécessitait la création d'une application web avec les fonctionnalités suivantes :

1. **Page de Recherche de Région**
   - Recherche avec autocomplétion pour les régions françaises
   - Affichage de la liste des départements pour la région sélectionnée
   - Navigation vers les communes du département

2. **Page Liste des Communes**
   - Afficher toutes les communes d'un département sélectionné
   - Fonctionnalité de pagination
   - Navigation de retour vers la recherche de région

### ✨ Fonctionnalités Implémentées

#### Fonctionnalités de Base (Requises)
- ✅ Recherche de région avec autocomplétion (minimum 2 caractères)
- ✅ Affichage des départements par région sélectionnée
- ✅ Liste des communes avec pagination
- ✅ Design responsive
- ✅ Navigation entre les pages
- ✅ États de chargement
- ✅ Gestion des erreurs

#### Fonctionnalités Supplémentaires (Bonus)
- ✅ **Mode Sombre** - Basculement entre thèmes clair et sombre avec persistance localStorage
- ✅ **Navigation basée sur URL** - Accès direct aux régions et départements via URL
- ✅ **Pagination Avancée** - Tailles de page configurables (5, 10, 20, 50, 100 éléments par page)
- ✅ **Animations Fluides** - Transitions et effets au survol
- ✅ **Mode Strict TypeScript** - Sécurité des types dans toute l'application
- ✅ **Tests Complets** - 49 tests unitaires avec 100% de réussite
- ✅ **Composants Standalone** - Architecture Angular moderne
- ✅ **État basé sur Signals** - Gestion d'état réactive avec Angular Signals

### 🏗️ Architecture

```
src/app/
├── components/
│   ├── region-search-component/     # Recherche de région avec autocomplétion
│   ├── municipality-component/      # Liste des communes avec pagination
│   └── theme-component/             # Bouton de basculement du mode sombre
├── services/
│   ├── region/                      # Service API Région
│   ├── department/                  # Service API Département
│   ├── municipality/                # Service API Commune
│   └── theme/                       # Service de gestion du thème
├── models/
│   ├── region.model.ts
│   ├── department.model.ts
│   └── municipality.model.ts
└── app.routes.ts                    # Routage de l'application
```

### 🎨 Décisions de Conception

1. **Composants Standalone** : Utilisation de composants Angular standalone modernes pour un meilleur tree-shaking et modularité
2. **Signals** : Implémentation des Signals Angular pour la gestion d'état réactive au lieu des observables traditionnels
3. **Variables CSS** : Système de thème construit avec des propriétés personnalisées CSS pour une implémentation facile du mode sombre
4. **Recherche avec Debounce** : Debounce de 300ms sur l'autocomplétion pour réduire les appels API
5. **Pagination Intelligente** : Affichage des numéros de page avec ellipses pour les grands ensembles de données
6. **État URL** : Code de région dans l'URL permet les liens directs et la navigation navigateur avant/arrière

### 🚀 Démarrage

#### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn

#### Installation

```bash
# Cloner le dépôt
git clone [repository-url]
cd testTechniqueFrontendBauchot

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

L'application sera disponible à `http://localhost:4200/`

#### Scripts Disponibles

```bash
# Serveur de développement
npm start           # ou ng serve

# Build pour la production
npm run build       # ou ng build

# Exécuter les tests unitaires
npm test            # ou ng test

# Exécuter les tests E2E
npm run e2e         # ou ng e2e

# Ouvrir Cypress
npm run cypress:open
```

### 🧪 Tests

L'application inclut une couverture de tests complète :

- **49 Tests Unitaires** (Jasmine/Karma)
  - Tests de composants
  - Tests de services
  - Tests d'intégration
- **Tests E2E** (Cypress prêt)

Exécuter les tests avec :
```bash
npm test
```

Tous les tests réussissent avec un taux de 100%.

### 📱 Présentation des Fonctionnalités

#### 1. Recherche de Région
- Saisir au moins 2 caractères pour déclencher l'autocomplétion
- Cliquer sur une région pour voir ses départements
- Les départements sont cliquables pour voir les communes

#### 2. Mode Sombre
- Basculer entre les thèmes clair et sombre
- Préférence sauvegardée dans localStorage
- Transitions fluides entre les thèmes
- Détection de la préférence système au premier chargement

#### 3. Pagination des Communes
- Tailles de page configurables
- Navigation par numéros de page avec ellipses
- Affichage du nombre de pages et de la plage d'éléments
- Contrôles de pagination responsive

#### 4. Navigation
- Routage basé sur URL pour les liens partageables
- Support de la navigation navigateur avant/arrière
- Bouton "Retour" pour revenir à la liste des départements
- Bouton "Nouvelle recherche" pour recommencer


### API Endpoints (used)
- Regions (autocomplete): https://geo.api.gouv.fr/regions?nom={name}
- Departments by region: https://geo.api.gouv.fr/regions/{regionCode}/departements
- Municipalities by department: https://geo.api.gouv.fr/departements/{deptCode}/communes

### 👤 Auteur

**Antoine Bauchot**

---
