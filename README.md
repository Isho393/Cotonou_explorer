# 🗺️ Cotonou Explorer

Application web de recherche locale intelligente pour Cotonou et ses communes limitrophes (Abomey-Calavi, Sèmè-Kpodji).

## 🚀 Fonctionnalités

- 🔍 **Recherche intelligente** : Trouvez rapidement des lieux par catégorie ou mots-clés
- 🤖 **Assistant IA** : Réponses contextuelles personnalisées
- 🗺️ **Données OSM** : Base de données complète via OpenStreetMap
- 🌍 **Multilingue** : Support FR/EN (à venir)
- 📱 **Responsive** : Interface moderne et adaptative
- ⚡ **Rapide** : Recherche optimisée avec Supabase

## 📋 Catégories disponibles

- 🏨 Hôtels
- 🍽️ Restaurants
- 🏥 Hôpitaux & Cliniques
- 💊 Pharmacies
- 🏦 Banques
- 🛒 Marchés & Supermarchés
- 🎓 Écoles & Universités
- 🚌 Transport
- ⛽ Stations-service
- 🏛️ Services publics
- ⛪ Lieux de culte
- 🏖️ Tourisme
- 💇 Beauté & Bien-être
- 🏠 Immobilier
- 🎭 Loisirs
- 💼 Services professionnels

## 🛠️ Stack technique

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Edge Functions)
- **Données** : OpenStreetMap (Overpass API)
- **Déploiement** : Vercel / Netlify (à venir)

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

## 🔑 Configuration

Créez un fichier `.env` à la racine avec :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🗄️ Configuration de la base de données

### 1. Créer la table `places`

Exécutez la migration dans Supabase :

```bash
# Via Supabase CLI
supabase db push

# Ou manuellement dans le SQL Editor de Supabase
# Copiez le contenu de supabase/migrations/20260515140000_create_places_table.sql
```

### 2. Importer les données OSM

```bash
# Installer tsx si nécessaire
npm install

# Lancer l'import (peut prendre 1-2 minutes)
npm run import-osm
```

Le script va :
- ✅ Récupérer tous les lieux de Cotonou et environs depuis OSM
- ✅ Transformer et normaliser les données
- ✅ Importer dans Supabase (table `places`)
- ✅ Afficher des statistiques par catégorie et ville

**Note** : L'import peut récupérer entre 500 et 2000+ lieux selon la richesse des données OSM.

## 🚀 Développement

```bash
# Lancer le serveur de dev
npm run dev

# Ouvrir http://localhost:5173
```

## 📊 Structure du projet

```
Cotonou_Explorer/
├── src/
│   ├── App.tsx              # Composant principal
│   ├── types.ts             # Types TypeScript
│   ├── lib/
│   │   └── supabase.ts      # Client Supabase
│   └── index.css            # Styles globaux
├── supabase/
│   ├── functions/
│   │   └── search-places/   # Edge Function de recherche
│   └── migrations/          # Migrations SQL
├── scripts/
│   └── import-osm-data.ts   # Script d'import OSM
└── package.json
```

## 🔄 Mise à jour des données

Pour rafraîchir les données OSM :

```bash
npm run import-osm
```

**Recommandation** : Mettre à jour mensuellement ou après des événements majeurs (nouveaux établissements, etc.)

## 🌍 Périmètre géographique

**Bounding box** : `[6.2, 2.3, 6.5, 2.5]`

Couvre :
- ✅ Cotonou (centre)
- ✅ Abomey-Calavi (ouest)
- ✅ Sèmè-Kpodji (est)
- ✅ Zones périphériques

## 🚧 Roadmap

- [ ] Traduction FR/EN avec i18next
- [ ] Images pour chaque lieu (Unsplash API)
- [ ] Carte interactive (Mapbox/Leaflet)
- [ ] Filtres avancés (note, distance, horaires)
- [ ] Favoris utilisateur
- [ ] Itinéraires (Google Maps integration)
- [ ] Mode hors-ligne (PWA)
- [ ] Audio TTS (Text-to-Speech)
- [ ] Support du Fon

## 📝 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une PR.

---

Fait avec ❤️ pour Cotonou 🇧🇯
