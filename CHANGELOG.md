# 📝 Changelog - Cotonou Explorer

## [Version 1.2.0] - 2026-05-16

### ✨ Nouvelles fonctionnalités

#### 🔊 Audio TTS (Text-to-Speech)
- **Lecture individuelle** : Bouton 🔊 sur chaque carte de lieu
- **Lecture globale** : Bouton ▶️ dans le header pour lire tous les résultats
- **Contrôles complets** :
  - ▶️ Play : Lancer la lecture
  - ⏸️ Pause : Mettre en pause
  - ▶️ Resume : Reprendre après pause
  - ⏹️ Stop : Arrêter complètement
  - ⚙️ Settings : Ouvrir les paramètres
- **Paramètres audio** :
  - Sélection de la voix (parmi les voix disponibles)
  - Vitesse ajustable (0.5x - 2.0x)
  - Volume ajustable (0% - 100%)
  - Sauvegarde automatique dans localStorage
- **Support multilingue** :
  - Détection automatique de la langue (FR/EN)
  - Voix françaises pour interface FR
  - Voix anglaises pour interface EN
- **Indicateurs visuels** :
  - Bordure dorée sur la carte en cours de lecture
  - Animation pulse sur le bouton audio actif
  - Icône dynamique (Volume2/VolumeX)
- **Web Speech API** : Solution native, gratuite, et hors-ligne

### 🔧 Améliorations techniques

#### Nouveaux composants
- `AudioButton.tsx` : Bouton audio sur chaque carte
- `AudioControls.tsx` : Contrôles globaux dans le header
- `AudioSettings.tsx` : Panneau de paramètres audio

#### Nouveau hook
- `useSpeech.ts` : Gestion complète du TTS
  - Lecture individuelle et globale
  - Contrôles (play, pause, resume, stop)
  - Gestion des paramètres
  - Support multilingue

#### Utilitaires
- `speech.ts` : Fonctions utilitaires TTS
  - Génération du texte à lire
  - Gestion des voix
  - Persistance des paramètres

#### Intégration
- Ajout des contrôles audio dans le header (conditionnels)
- Ajout du bouton audio sur chaque PlaceCard
- Indicateur visuel sur la carte en cours de lecture
- Mise à jour de PlaceCard avec props audio

### 📦 Nouvelles traductions
```json
{
  "audio": {
    "playAll": "Lire tous les résultats",
    "play": "Lire",
    "pause": "Pause",
    "resume": "Reprendre",
    "stop": "Arrêter",
    "settings": "Paramètres audio",
    "voice": "Voix",
    "defaultVoice": "Voix par défaut",
    "noVoicesAvailable": "Aucune voix disponible pour cette langue",
    "speed": "Vitesse",
    "volume": "Volume",
    "settingsInfo": "Les paramètres sont sauvegardés automatiquement...",
    "notSupported": "La lecture audio n'est pas supportée...",
    "readAloud": "Lire à voix haute",
    "stopReading": "Arrêter la lecture"
  }
}
```

### 📄 Nouveaux fichiers

#### Utils
- `src/utils/speech.ts` - Utilitaires TTS

#### Hooks
- `src/hooks/useSpeech.ts` - Hook de gestion TTS

#### Composants
- `src/components/AudioButton.tsx` - Bouton audio sur carte
- `src/components/AudioControls.tsx` - Contrôles globaux
- `src/components/AudioSettings.tsx` - Panneau de paramètres

#### Documentation
- `docs/FEATURES_AUDIO_TTS.md` - Documentation complète du système TTS

### 📊 Performance

#### Bundle Size
- **Avant** : 232.51 KB (gzip: 70.82 KB)
- **Après** : 246.66 KB (gzip: 74.42 KB)
- **Augmentation** : +14.15 KB (+3.60 KB gzip)

#### Optimisations
- Aucune dépendance externe (Web Speech API native)
- Code léger et optimisé
- localStorage pour persistance (pas de requêtes réseau)
- Consommation batterie/CPU faible

### 🎯 Statistiques

- **Lignes ajoutées** : ~600
- **Composants créés** : 3
- **Hooks créés** : 1
- **Utilitaires créés** : 1
- **Traductions ajoutées** : 26 (13 × 2 langues)

### 🎨 Cas d'Usage

1. **Accessibilité** ♿ : Personnes malvoyantes
2. **Conduite** 🚗 : Écouter sans quitter la route des yeux
3. **Multitâche** 🏃 : Écouter en faisant autre chose
4. **Fatigue visuelle** 😴 : Reposer les yeux
5. **Apprentissage** 📚 : Entendre la prononciation

### 🌍 Compatibilité

- ✅ Chrome/Edge (Windows, Android, macOS)
- ✅ Safari (iOS, macOS)
- ✅ Firefox (Windows, Android, macOS)
- ❌ Internet Explorer (non supporté)

### 🚀 Évolutions possibles

#### Court terme
- [ ] Raccourcis clavier (Espace, Esc)
- [ ] Barre de progression visuelle
- [ ] Temps restant estimé
- [ ] Vitesse rapide (2x, 3x)

#### Moyen terme
- [ ] Lecture automatique au survol
- [ ] Mise en évidence du texte
- [ ] Bookmarks audio
- [ ] Playlist de favoris

#### Long terme
- [ ] Voix premium (API cloud en option)
- [ ] Synthèse vocale personnalisée
- [ ] Export audio (MP3)

---

## [Version 1.1.0] - 2026-05-16

### ✨ Nouvelles fonctionnalités

#### 🔔 Système de Notifications In-App
- **Centre de notifications** : Panneau déroulant élégant avec design glassmorphism
- **Badge compteur** : Indicateur rouge avec nombre de notifications non lues
- **6 types de notifications** : info, success, warning, new_place, favorite_update, promo
- **Notifications automatiques** :
  - Message de bienvenue à la première visite
  - Notification lors de l'ajout d'un favori
  - Notification lors du retrait d'un favori
- **Gestion complète** :
  - Marquer comme lu (individuel)
  - Marquer tout comme lu
  - Supprimer une notification
  - Effacer toutes les notifications
- **Horodatage intelligent** : "À l'instant", "Il y a X min", "Il y a Xh", etc.
- **Persistance** : localStorage pour conserver les notifications
- **Icônes personnalisées** : Support des emojis et icônes par type
- **Internationalisation** : Traductions FR/EN complètes
- **Compatible tous appareils** : iOS, Android, Desktop (pas de permissions requises)

### 🔧 Améliorations techniques

#### Nouveaux composants
- `NotificationBell.tsx` : Bouton cloche avec badge compteur
- `NotificationCenter.tsx` : Panneau de notifications avec liste scrollable

#### Nouveau hook
- `useNotifications.ts` : Gestion complète des notifications
  - Chargement/sauvegarde localStorage
  - API complète (add, markAsRead, delete, clear)
  - Compteur de non lues en temps réel

#### Intégration
- Ajout du NotificationBell dans le header (à côté du LanguageSwitcher)
- Wrapper `handleToggleFavorite` pour envoyer des notifications
- Mise à jour de tous les PlaceCard pour utiliser le nouveau wrapper

### 📦 Nouvelles traductions
```json
{
  "notifications": {
    "title": "Notifications",
    "empty": "Aucune notification",
    "markRead": "Marquer comme lu",
    "markAllRead": "Tout marquer comme lu",
    "delete": "Supprimer",
    "clearAll": "Tout effacer",
    "justNow": "À l'instant",
    "minutesAgo": "Il y a {{count}} min",
    "hoursAgo": "Il y a {{count}}h",
    "daysAgo": "Il y a {{count}}j",
    "favoriteAdded": "Favori ajouté",
    "favoriteAddedDesc": "{{name}} a été ajouté à vos favoris",
    "favoriteRemoved": "Favori retiré",
    "favoriteRemovedDesc": "{{name}} a été retiré de vos favoris"
  }
}
```

### 📄 Nouveaux fichiers

#### Hooks
- `src/hooks/useNotifications.ts` - Hook de gestion des notifications

#### Composants
- `src/components/NotificationBell.tsx` - Bouton cloche avec badge
- `src/components/NotificationCenter.tsx` - Panneau de notifications

#### Documentation
- `docs/FEATURES_NOTIFICATIONS.md` - Documentation complète du système
- `docs/NOTIFICATIONS_SESSION_SUMMARY.md` - Résumé de la session d'implémentation

### 📊 Performance

#### Bundle Size
- **Avant** : 221.65 KB (gzip: 68.19 KB)
- **Après** : 232.51 KB (gzip: 70.82 KB)
- **Augmentation** : +10.86 KB (+2.63 KB gzip)

#### Optimisations
- Aucune dépendance externe ajoutée
- Code léger et optimisé
- localStorage pour persistance (pas de requêtes réseau)

### 🎯 Statistiques

- **Lignes ajoutées** : ~350
- **Composants créés** : 2
- **Hooks créés** : 1
- **Traductions ajoutées** : 28 (14 × 2 langues)
- **Types de notifications** : 6
- **Actions utilisateur** : 5

### 🎨 Design

#### Couleurs par type
- `info` : Bleu (informations générales)
- `success` : Vert (actions réussies)
- `warning` : Jaune (avertissements)
- `new_place` : Ambre (nouveaux lieux)
- `favorite_update` : Rouge (favoris)
- `promo` : Violet (promotions)

#### Animations
- Fade-in pour le panneau
- Pulse pour le badge
- Hover effects sur les boutons
- Transitions fluides (200ms)

### 🚀 Évolutions possibles

#### Court terme
- [ ] Filtrer par type de notification
- [ ] Rechercher dans les notifications
- [ ] Grouper par date
- [ ] Son de notification (optionnel)

#### Moyen terme
- [ ] Actions rapides (liens vers lieux)
- [ ] Préférences de notifications
- [ ] Notifications planifiées
- [ ] Statistiques de notifications

#### Long terme
- [ ] Push notifications (Android uniquement)
- [ ] Synchronisation backend
- [ ] Notifications personnalisées
- [ ] Analytics

---

## [Version 2.0.0] - 2026-05-15

### ✨ Nouvelles fonctionnalités

#### 🗺️ Intégration OpenStreetMap
- **Base de données complète** : Import automatique des lieux depuis OpenStreetMap
- **Couverture étendue** : Cotonou + Abomey-Calavi + Sèmè-Kpodji + communes limitrophes
- **Script d'import** : `npm run import-osm` pour mettre à jour les données
- **Données structurées** : Table PostgreSQL avec indexation optimisée

#### 📂 Nouvelles catégories
Ajout de 10 nouvelles catégories :
- 🚌 Transport (gares, taxis, aéroport)
- 🏛️ Services publics (mairies, commissariats, ambassades)
- ⛪ Lieux de culte (églises, mosquées)
- 🏖️ Tourisme (monuments, musées, plages)
- 💇 Beauté & Bien-être (salons, spas)
- ⛽ Stations-service
- 🏠 Immobilier (agences)
- 📱 Télécommunications (boutiques opérateurs)
- 🎭 Loisirs (parcs, centres sportifs)
- 💼 Services professionnels (avocats, comptables)

**Total : 19 catégories** (contre 9 auparavant)

#### 🌍 Traduction multilingue (FR/EN)
- **i18next** : Système de traduction complet
- **Sélecteur de langue** : Bouton FR/EN dans l'interface
- **Détection automatique** : Langue du navigateur détectée
- **Persistance** : Préférence sauvegardée dans localStorage
- **Traductions complètes** :
  - Interface utilisateur
  - Catégories
  - Messages système
  - Suggestions

### 🔧 Améliorations techniques

#### Base de données
- **Table `places`** : Structure optimisée pour les données OSM
- **Indexes** : Recherche full-text, filtres par catégorie/ville
- **RLS (Row Level Security)** : Sécurité au niveau des lignes
- **Migration SQL** : Versionnée et reproductible

#### Fonction Edge
- **Recherche intelligente** : Matching par catégorie + recherche fuzzy
- **Fallback** : Données de secours si la DB échoue
- **Performance** : Limite de 50 résultats, tri par note

#### Frontend
- **Composant LanguageSwitcher** : Sélecteur de langue élégant
- **Hooks i18n** : `useTranslation()` dans tous les composants
- **Responsive** : Design adaptatif pour mobile/desktop

### 📦 Nouvelles dépendances
```json
{
  "react-i18next": "^14.0.0",
  "i18next": "^23.0.0",
  "i18next-browser-languagedetector": "^7.0.0",
  "tsx": "^4.7.1"
}
```

### 📄 Nouveaux fichiers

#### Configuration
- `src/i18n/config.ts` - Configuration i18next
- `src/i18n/locales/fr.json` - Traductions françaises
- `src/i18n/locales/en.json` - Traductions anglaises

#### Composants
- `src/components/LanguageSwitcher.tsx` - Sélecteur de langue

#### Scripts
- `scripts/import-osm-data.ts` - Import automatique depuis OSM

#### Migrations
- `supabase/migrations/20260515140000_create_places_table.sql`

#### Documentation
- `README.md` - Documentation complète du projet
- `SETUP.md` - Guide d'installation pas à pas
- `CHANGELOG.md` - Ce fichier
- `.env.example` - Template de configuration

### 🎯 Données

#### Avant (v1.0)
- 35 lieux codés en dur
- 9 catégories
- Données statiques

#### Après (v2.0)
- 500-2000+ lieux (selon OSM)
- 19 catégories
- Données dynamiques et actualisables
- Couverture géographique étendue

### 🚀 Prochaines étapes (Roadmap)

#### Phase 1 (Court terme)
- [ ] Déploiement sur Vercel/Netlify
- [ ] Tests automatisés
- [ ] CI/CD avec GitHub Actions

#### Phase 2 (Moyen terme)
- [ ] Images pour chaque lieu (Unsplash API)
- [ ] Carte interactive (Mapbox/Leaflet)
- [ ] Filtres avancés (distance, horaires, note)
- [ ] Système de favoris

#### Phase 3 (Long terme)
- [ ] Mode hors-ligne (PWA)
- [ ] Audio TTS (Text-to-Speech)
- [ ] Support du Fon
- [ ] Contribution communautaire (ajout de lieux)
- [ ] Application mobile (React Native)

### 📊 Statistiques

- **Lignes de code** : ~2000+
- **Composants React** : 5
- **Fichiers de traduction** : 2 langues
- **Catégories** : 19
- **Lieux potentiels** : 500-2000+

---

## [Version 1.0.0] - 2026-05-14

### 🎉 Version initiale
- Interface de recherche basique
- 35 lieux codés en dur
- 9 catégories
- Design glassmorphism
- Recherche par mots-clés
- Messages IA contextuels
