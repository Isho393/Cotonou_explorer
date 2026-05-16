# 🚀 Quick Start - Cotonou Explorer

## Installation

```bash
# Cloner le projet
git clone <repo-url>
cd Cotonou_Explorer

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase
```

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier les clés dans `.env` :
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   ```
3. Exécuter les migrations :
   ```bash
   # Dans Supabase SQL Editor
   # Exécuter : supabase/migrations/20260515140000_create_places_table.sql
   # Exécuter : supabase/migrations/20260515122325_create_search_history.sql
   ```
4. Importer les données OSM :
   ```bash
   npm run import-osm
   ```
5. Déployer l'Edge Function :
   ```bash
   # Installer Supabase CLI
   npm install -g supabase
   
   # Login
   supabase login
   
   # Déployer
   supabase functions deploy search-places
   ```

## Développement

```bash
# Démarrer le serveur de dev
npm run dev

# Ouvrir http://localhost:5173
```

## Build de Production

```bash
# Build
npm run build

# Prévisualiser
npm run preview
```

## 🎯 Fonctionnalités Principales

### 1. 🔍 Recherche Intelligente
- Recherche en langage naturel
- 1789 lieux réels (OSM)
- Messages IA contextuels
- Cache sessionStorage

### 2. 🗂️ 19 Catégories
Hôtels, Restaurants, Hôpitaux, Pharmacies, Banques, Marchés, Écoles, Supermarchés, Transport, Services publics, Culte, Tourisme, Beauté, Carburant, Immobilier, Télécom, Loisirs, Services pro, Divertissement

### 3. 🌍 Traduction FR/EN
- Toggle élégant
- Détection automatique
- Persistance localStorage

### 4. 🖼️ Images
- Lazy loading
- Images par catégorie (Unsplash)
- Cache localStorage

### 5. 🗺️ Carte Interactive
- Leaflet + react-leaflet
- Marqueurs colorés par catégorie
- Popups riches
- Auto-centrage intelligent

### 6. 📄 Pagination
- 12 résultats par page
- Navigation élégante
- Auto-scroll

### 7. 🔧 Filtres Avancés
- **Note minimale** : slider 0-5 ⭐
- **Distance** : slider 1-50 km 📍
- **Ouvert maintenant** : toggle 🕐
- **Tri** : Pertinence / Note / Distance

### 8. ⭐ Favoris
- Bouton cœur sur chaque carte
- Vue Favoris dédiée
- Persistance localStorage
- Badge compteur

## 📱 Utilisation

### Recherche Simple
1. Taper "hôtel" dans la barre de recherche
2. Appuyer sur Enter ou cliquer sur "Rechercher"
3. Voir les résultats

### Recherche par Catégorie
1. Cliquer sur une chip catégorie (ex: "Restaurants")
2. Les résultats s'affichent automatiquement

### Filtrer les Résultats
1. Faire une recherche
2. Cliquer sur "Filtres"
3. Ajuster les filtres (note, distance, ouvert maintenant)
4. Cliquer "Appliquer"

### Ajouter aux Favoris
1. Cliquer sur le cœur en haut à droite d'une carte
2. Le lieu est ajouté aux favoris
3. Voir tous les favoris dans l'onglet "Favoris"

### Vue Carte
1. Faire une recherche
2. Cliquer sur "Carte"
3. Voir tous les lieux sur la carte
4. Cliquer sur un marqueur pour voir les détails

### Changer de Langue
1. Cliquer sur le toggle FR/EN en haut à droite
2. Toute l'interface change de langue

## 🛠️ Stack Technique

### Frontend
- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Lucide React (icons)
- Leaflet (maps)
- i18next (traductions)

### Backend
- Supabase (BaaS)
- PostgreSQL
- Edge Functions (Deno)

### Data
- OpenStreetMap (Overpass API)
- Unsplash (images)

## 📊 Performance

- **Bundle size** : 215.74 KB (gzip: 66.59 KB)
- **First load** : ~2-3s
- **Recherches suivantes** : <500ms (cache)
- **Images** : lazy load progressif

## 🧪 Tests

Voir `TESTING_GUIDE.md` pour 35 tests détaillés.

Tests rapides :
```bash
# 1. Recherche
npm run dev
# Rechercher "hôtel" → ✅ Résultats

# 2. Filtres
# Ouvrir filtres → Ajuster note → Appliquer → ✅ Filtrés

# 3. Favoris
# Cliquer cœur → Aller dans Favoris → ✅ Visible

# 4. Carte
# Cliquer "Carte" → ✅ Marqueurs visibles

# 5. Traduction
# Cliquer FR/EN → ✅ Interface traduite
```

## 📚 Documentation

- `README.md` - Vue d'ensemble
- `SETUP.md` - Installation détaillée
- `FEATURES_COMPLETE.md` - Toutes les fonctionnalités
- `FEATURES_FILTERS.md` - Filtres avancés
- `FEATURES_FAVORITES.md` - Système de favoris
- `TESTING_GUIDE.md` - Guide de test complet
- `SESSION_SUMMARY.md` - Résumé de session

## 🐛 Dépannage

### Erreur "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur Supabase
- Vérifier les clés dans `.env`
- Vérifier que les migrations sont exécutées
- Vérifier que l'Edge Function est déployée

### Images ne chargent pas
- Vérifier la connexion internet
- Vérifier la console pour erreurs CORS

### Géolocalisation ne fonctionne pas
- Vérifier les permissions du navigateur
- Utiliser HTTPS (localhost OK)

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel

# Variables d'environnement
# Ajouter VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist

# Variables d'environnement
# Ajouter VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
```

## 📞 Support

- **Documentation** : Voir les fichiers `.md`
- **Issues** : Créer une issue sur GitHub
- **Email** : contact@ishola.co

## 🎉 Prêt !

Votre application Cotonou Explorer est prête à l'emploi !

```bash
npm run dev
```

Ouvrir http://localhost:5173 et profiter ! 🚀

---

**Powered by Ishola & CO** ✨
