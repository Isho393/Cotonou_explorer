# 🗺️ Cotonou Explorer

**Application web de recherche locale intelligente pour Cotonou** - Progressive Web App avec IA, cartes interactives, et mode hors-ligne.

[![PWA](https://img.shields.io/badge/PWA-Ready-success)](https://web.dev/progressive-web-apps/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com/)

---

## ✨ Fonctionnalités

### 🔍 Recherche Intelligente
- Recherche en langage naturel avec IA
- 1789 lieux réels (OpenStreetMap)
- 19 catégories complètes
- Cache intelligent (sessionStorage)
- Historique des recherches

### 📱 Progressive Web App
- **Installation** : Icône sur l'écran d'accueil
- **Mode hors-ligne** : Favoris accessibles sans connexion
- **Performance** : Rechargements <200ms ⚡
- **Économie data** : 80-90% moins de consommation
- **Service Worker** : Cache intelligent

### 🗺️ Carte Interactive
- Leaflet + react-leaflet
- Marqueurs colorés par catégorie
- Popups riches avec détails
- Auto-centrage intelligent

### 🔧 Filtres Avancés
- **Note minimale** : slider 0-5 ⭐
- **Distance** : slider 1-50 km 📍
- **Ouvert maintenant** : toggle en temps réel
- **Tri** : Pertinence / Note / Distance

### ⭐ Favoris
- Bouton cœur sur chaque lieu
- Vue Favoris dédiée
- Persistance localStorage
- Accessible hors-ligne

### 🔔 Notifications In-App
- Centre de notifications élégant
- Badge compteur en temps réel
- 6 types de notifications
- Notifications automatiques (favoris)
- Persistance localStorage
- Compatible tous appareils (iOS inclus)

### 🔊 Audio TTS (Text-to-Speech)
- Lecture individuelle (bouton sur chaque carte)
- Lecture globale (tous les résultats)
- Contrôles complets (play/pause/stop)
- Paramètres ajustables (vitesse, volume, voix)
- Support FR/EN automatique
- Web Speech API native (gratuit, hors-ligne)
- Indicateurs visuels pendant lecture

### 🌙 Mode Sombre
- Toggle entre mode clair et sombre
- Persistance dans localStorage
- Transitions fluides
- Styles adaptés pour tous les composants
- Icônes dynamiques (Sun/Moon)
- Accessible et performant

### 🌍 Multilingue
- Français (par défaut)
- English
- Détection automatique
- 120+ clés traduites

### 🖼️ Images
- Images par catégorie (Unsplash)
- Lazy loading optimisé
- Cache localStorage

### 📄 Pagination
- 12 résultats par page
- Navigation élégante
- Auto-scroll

---

## 📋 Catégories (19)

🏨 Hôtels • 🍽️ Restaurants • 🏥 Hôpitaux • 💊 Pharmacies • 🏦 Banques • 🛒 Marchés • 🎓 Écoles • 🛍️ Supermarchés • 🚌 Transport • 🏛️ Services publics • ⛪ Culte • 🏖️ Tourisme • 💇 Beauté • ⛽ Carburant • 🏠 Immobilier • 📱 Télécom • 🌳 Loisirs • 💼 Services pro • 🎭 Divertissement

**Couverture** : Cotonou, Abomey-Calavi, Sèmè-Kpodji

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : React 18.3 + TypeScript 5.6
- **Build** : Vite 5.4
- **Styling** : Tailwind CSS 3.4
- **Icons** : Lucide React
- **Maps** : Leaflet 1.9 + react-leaflet 4.2
- **i18n** : react-i18next 15.1

### Backend
- **BaaS** : Supabase
- **Database** : PostgreSQL
- **Edge Functions** : Deno
- **Auth** : Supabase Auth (prêt)

### PWA
- **Service Worker** : Cache API
- **Manifest** : Configuration complète
- **Offline** : localStorage + SW cache

### Data
- **Places** : OpenStreetMap (Overpass API)
- **Images** : Unsplash (URLs statiques)

---

## 📦 Installation

```bash
# Cloner le repo
git clone <repo-url>
cd Cotonou_Explorer

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase
```

---

## 🔑 Configuration

Créez un fichier `.env` à la racine :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 🗄️ Configuration Base de Données

### 1. Créer les tables

```bash
# Via Supabase CLI
supabase db push

# Ou manuellement dans le SQL Editor
# Exécuter : supabase/migrations/20260515140000_create_places_table.sql
# Exécuter : supabase/migrations/20260515122325_create_search_history.sql
```

### 2. Importer les données OSM

```bash
npm run import-osm
```

**Résultat** : ~1789 lieux importés

---

## 🚀 Développement

```bash
# Serveur de dev
npm run dev

# Build production
npm run build

# Prévisualiser build
npm run preview

# Générer icônes PWA
node scripts/generate-icons.js
```

Ouvrir : **http://localhost:5173**

---

## 📊 Performance

### Bundle Size
- **Total** : 221.65 KB (gzip: 68.19 KB)
- **React vendor** : 141.46 KB
- **Supabase vendor** : 125.87 KB
- **i18n vendor** : 57.26 KB

### Temps de Chargement
- **Premier chargement** : 2-3s
- **Rechargements (cache)** : <200ms ⚡
- **Recherches (cache)** : <500ms

### Lighthouse Scores (Attendus)
- **Performance** : > 90
- **PWA** : > 90
- **Accessibility** : > 90
- **Best Practices** : > 90
- **SEO** : > 90

---

## 📱 Test Rapide PWA (5 min)

```bash
npm run dev
```

1. ✅ **Service Worker** : DevTools → Application → Service Workers
2. ✅ **Installation** : Cliquer sur le prompt en bas à droite
3. ✅ **Hors-ligne** : Network → Offline → Favoris accessibles
4. ✅ **Cache** : Rechargement <500ms
5. ✅ **Lighthouse** : Score PWA > 90

**Guide complet** : `QUICK_TEST_PWA.md`

---

## 📚 Documentation

### Guides Principaux
- `README.md` - Ce fichier
- `QUICK_TEST_PWA.md` - Test rapide (5 min)
- `docs/QUICK_START.md` - Démarrage rapide
- `docs/SETUP.md` - Installation détaillée

### Fonctionnalités
- `docs/FEATURES_COMPLETE.md` - Vue d'ensemble
- `docs/FEATURES_PWA.md` - PWA complète
- `docs/FEATURES_FILTERS.md` - Filtres avancés
- `docs/FEATURES_FAVORITES.md` - Système de favoris
- `docs/FEATURES_NOTIFICATIONS.md` - Notifications in-app
- `docs/FEATURES_AUDIO_TTS.md` - Audio TTS (lecture vocale)
- `docs/FEATURES_DARK_MODE.md` - Mode sombre
- `docs/FEATURES_MAP.md` - Carte interactive
- `docs/FEATURES_PAGINATION.md` - Pagination
- `docs/FEATURES_IMAGES.md` - Images

### Tests
- `docs/TESTING_GUIDE.md` - 35 tests
- `docs/PWA_TESTING_GUIDE.md` - 15 tests PWA

### Résumés
- `docs/PROJECT_SUMMARY.md` - Résumé complet
- `docs/PWA_SESSION_SUMMARY.md` - Session PWA

---

## 🌍 Périmètre Géographique

**Bounding box** : `[6.2, 2.3, 6.5, 2.5]`

Couvre :
- ✅ Cotonou (centre)
- ✅ Abomey-Calavi (ouest)
- ✅ Sèmè-Kpodji (est)
- ✅ Zones périphériques

---

## 🚧 Roadmap

### Implémenté ✅
- [x] Recherche intelligente avec IA
- [x] 19 catégories complètes
- [x] Traduction FR/EN
- [x] Images des lieux
- [x] Carte interactive
- [x] Filtres avancés
- [x] Système de favoris
- [x] Pagination
- [x] **PWA complète**
- [x] **Notifications in-app**
- [x] **Audio TTS (lecture vocale)**
- [x] **Mode sombre**

### À Venir 🔜
- [ ] **Amélioration PWA** (cache avancé, offline complet)
- [ ] Support du Fon (3ème langue)
- [ ] Notifications Push (Android)
- [ ] Avis utilisateurs
- [ ] Photos utilisateurs

---

## 🎯 Avantages Clés

### Pour les Utilisateurs
✅ **Gratuit** et accessible à tous
✅ **Hors-ligne** : favoris toujours accessibles
✅ **Rapide** : rechargements <200ms
✅ **Économie data** : 80-90% moins
✅ **Installation** : 2 clics, pas de store

### Pour le Contexte Béninois
✅ **Connexion instable** → Mode hors-ligne
✅ **Data coûteuse** → Économie 80-90%
✅ **Pas de stores** → Installation directe (PWA)
✅ **Multilingue** → FR/EN (Fon à venir)

---

## 🏆 Statistiques

- **Lieux** : 1789
- **Catégories** : 19
- **Villes** : 3
- **Langues** : 2 (FR, EN)
- **Composants** : 18
- **Hooks** : 5
- **Tests** : 60+
- **Documentation** : 22 fichiers

---

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Déployer le dossier dist/
```

### Variables d'environnement
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 📝 Licence

MIT

---

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📞 Support

- **Documentation** : Voir dossier `docs/`
- **Issues** : Créer une issue sur GitHub
- **Email** : contact@ishola.co

---

**Fait avec ❤️ pour Cotonou 🇧🇯**

**Powered by Ishola & CO** ✨

---

## 🎉 Statut

✅ **Production-Ready**
✅ **PWA Complète**
✅ **12 Fonctionnalités Majeures**
✅ **1789 Lieux Réels**
✅ **Documentation Complète**

**Version** : 1.3.0
**Date** : Mai 2026
