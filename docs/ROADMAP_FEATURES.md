# 🗺️ Roadmap des fonctionnalités - Cotonou Explorer

## ✅ Phase 1 : Optimisation Performance (EN COURS)

### 1.1 Cache et optimisation ✅ FAIT
- [x] Cache sessionStorage pour les recherches (5 min)
- [x] Désactivation de Suspense i18n
- [x] Code splitting avec Vite
- [x] Chunks séparés pour vendors

### 1.2 Optimisations supplémentaires (À FAIRE)
- [ ] Lazy loading des images
- [ ] Compression des assets
- [ ] Service Worker pour cache HTTP
- [ ] Préchargement des catégories populaires

---

## 🖼️ Phase 2 : Images des lieux (PROCHAINE)

### Approche : Unsplash API + Cache

**Étapes :**
1. Créer compte Unsplash Developer
2. Ajouter clé API dans `.env`
3. Créer service `src/services/unsplash.ts`
4. Ajouter colonne `image_url` dans table `places`
5. Fonction pour récupérer images par catégorie
6. Cache des URLs dans Supabase
7. Lazy loading des images dans les cartes

**Estimation :** 2-3 heures

**Dépendances :**
```bash
npm install unsplash-js
```

---

## 🗺️ Phase 3 : Carte interactive

### Approche : Leaflet (plus léger que Mapbox)

**Étapes :**
1. Installer Leaflet + React Leaflet
2. Créer composant `MapView.tsx`
3. Afficher tous les résultats sur la carte
4. Markers cliquables avec popup
5. Centrage automatique sur les résultats
6. Toggle vue liste/carte

**Estimation :** 3-4 heures

**Dépendances :**
```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

**Tiles gratuits :** OpenStreetMap

---

## 🔍 Phase 4 : Filtres avancés

### 4.1 Filtre par distance
- Géolocalisation utilisateur
- Calcul distance avec Haversine
- Slider de distance (1-50 km)
- Tri par proximité

### 4.2 Filtre par horaires
- Parser `opening_hours` OSM
- Afficher "Ouvert maintenant"
- Filtre "Ouvert 24h/24"

### 4.3 Filtre par note
- Slider de note (1-5 étoiles)
- Tri par note (déjà fait)

**Estimation :** 4-5 heures

---

## ⭐ Phase 5 : Système de favoris

### Approche : localStorage + Supabase (optionnel)

**Étapes :**
1. Créer store de favoris (localStorage)
2. Bouton cœur sur chaque carte
3. Page "Mes favoris"
4. Export/Import favoris
5. (Optionnel) Sync avec Supabase si authentifié

**Estimation :** 2-3 heures

---

## 📱 Phase 6 : PWA (Progressive Web App)

### Fonctionnalités :
- Installation sur mobile/desktop
- Mode hors-ligne
- Cache des recherches récentes
- Notifications (optionnel)

**Étapes :**
1. Créer `manifest.json`
2. Configurer Service Worker
3. Stratégie de cache (Network First + Cache Fallback)
4. Icônes PWA (différentes tailles)
5. Splash screen

**Estimation :** 3-4 heures

**Plugin Vite :**
```bash
npm install vite-plugin-pwa -D
```

---

## 🔊 Phase 7 : Audio TTS (Text-to-Speech)

### Approche : Web Speech API + Fallback cloud

**Étapes :**
1. Utiliser Web Speech API (gratuit, natif)
2. Bouton "Écouter" sur chaque carte
3. Lecture du nom + description + adresse
4. Support FR/EN
5. (Optionnel) Fallback Google Cloud TTS pour meilleure qualité

**Estimation :** 2-3 heures

**Note :** Pas de support Fon natif, nécessite enregistrements audio

---

## 🇧🇯 Phase 8 : Support du Fon

### Approche : Traduction manuelle + Audio pré-enregistré

**Étapes :**
1. Créer `src/i18n/locales/fon.json`
2. Traduire l'interface (collaboration avec locuteurs natifs)
3. Ajouter sélecteur de langue (FR/EN/FON)
4. Pour TTS : enregistrements audio pré-faits
5. Traduction des descriptions de lieux (optionnel)

**Estimation :** 10-15 heures (dépend de la disponibilité des traducteurs)

**Ressources nécessaires :**
- Traducteur Fon natif
- Enregistrements audio (si TTS)

---

## 📊 Estimation totale

| Phase | Temps estimé | Priorité |
|-------|--------------|----------|
| 1. Performance | 1-2h | 🔥 Critique |
| 2. Images | 2-3h | 🔥 Haute |
| 3. Carte | 3-4h | 🔥 Haute |
| 4. Filtres | 4-5h | 🟡 Moyenne |
| 5. Favoris | 2-3h | 🟡 Moyenne |
| 6. PWA | 3-4h | 🟢 Basse |
| 7. TTS | 2-3h | 🟢 Basse |
| 8. Fon | 10-15h | 🟢 Basse |

**Total :** 27-39 heures de développement

---

## 🎯 Ordre recommandé

### Sprint 1 (Urgent - 1 semaine)
1. ✅ Performance (cache, optimisation)
2. 🖼️ Images des lieux
3. 🗺️ Carte interactive

### Sprint 2 (Important - 1 semaine)
4. 🔍 Filtres avancés
5. ⭐ Système de favoris

### Sprint 3 (Nice to have - 1 semaine)
6. 📱 PWA
7. 🔊 Audio TTS

### Sprint 4 (Long terme - 2 semaines)
8. 🇧🇯 Support du Fon

---

## ✅ Fonctionnalités Complétées

### 🔔 Notifications In-App
- Système de notifications avec badge
- 6 types de notifications
- Centre de notifications
- Persistance localStorage
- **Statut :** ✅ TERMINÉ

### 🔊 Audio TTS (Text-to-Speech)
- Lecture des résultats avec Web Speech API
- Lecture individuelle et globale
- Contrôles (play/pause/resume/stop)
- Paramètres (vitesse, volume, voix)
- Support FR/EN
- **Statut :** ✅ TERMINÉ

### 📍 Détails des Lieux
- Modal full-screen avec toutes les infos
- Carte Leaflet intégrée
- Boutons d'action (Itinéraire, Partager, Appeler)
- Audio et favoris intégrés
- **Statut :** ✅ TERMINÉ

### 🌙 Mode Sombre
- Toggle entre mode clair et sombre
- Persistance dans localStorage
- Transitions fluides
- Styles adaptés pour tous les composants
- **Statut :** ✅ TERMINÉ

---

## 📝 Notes importantes

### Images (Unsplash)
- **Limite gratuite :** 50 requêtes/heure
- **Solution :** Cache permanent des URLs dans Supabase
- **Alternative :** Pexels API (200 req/heure)

### Carte (Leaflet)
- **Avantage :** Gratuit, léger (38 KB)
- **Tiles :** OpenStreetMap (gratuit, pas de clé API)
- **Alternative :** Mapbox (nécessite clé API, 50k vues/mois gratuit)

### PWA
- **Nécessite HTTPS** en production
- **Taille cache :** Limiter à 50 MB
- **Stratégie :** Cache-first pour assets, Network-first pour API

### Fon
- **Complexité :** Langue peu documentée
- **Ressources :** Peu d'outils de traduction automatique
- **Solution :** Traduction manuelle + communauté

---

## 🚀 Prochaine action

**Commencer par Phase 2 : Images des lieux**

Voulez-vous que je commence l'implémentation ?
