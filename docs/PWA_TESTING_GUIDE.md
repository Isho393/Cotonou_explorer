# Guide de Test PWA - Cotonou Explorer

## 🚀 Préparation

### Prérequis
- Navigateur moderne (Chrome, Edge, Firefox, Safari)
- Connexion internet
- DevTools ouvert (F12)

### Démarrage
```bash
npm run dev
# Ouvrir http://localhost:5173
```

---

## ✅ Tests Essentiels

### Test 1 : Service Worker Enregistré
**Objectif** : Vérifier que le Service Worker est actif

1. Ouvrir DevTools (F12)
2. Aller dans **Application** → **Service Workers**
3. ✅ Voir "sw.js" avec status "activated and is running"
4. ✅ Scope: "/"

**Résultat attendu** : Service Worker actif et fonctionnel

---

### Test 2 : Manifest Chargé
**Objectif** : Vérifier la configuration PWA

1. DevTools → **Application** → **Manifest**
2. ✅ Nom: "Cotonou Explorer"
3. ✅ Short name: "Cotonou"
4. ✅ Theme color: #d4af37 (amber)
5. ✅ Background color: #07070f (noir)
6. ✅ Display: "standalone"
7. ✅ 8 icônes visibles (72px à 512px)

**Résultat attendu** : Manifest complet et valide

---

### Test 3 : Prompt d'Installation
**Objectif** : Tester l'invitation à installer l'app

#### Sur Desktop (Chrome/Edge)
1. Ouvrir l'app
2. ✅ Prompt apparaît en bas à droite
3. ✅ Texte: "Installer l'application"
4. ✅ Boutons: "Installer" et "Plus tard"
5. Cliquer "Plus tard"
6. ✅ Prompt disparaît
7. Recharger la page
8. ✅ Prompt ne réapparaît pas (7 jours)

#### Sur Mobile (Chrome Android)
1. Ouvrir l'app
2. ✅ Prompt apparaît en bas
3. ✅ Design responsive
4. Cliquer "Installer"
5. ✅ Dialog natif Android apparaît
6. Confirmer
7. ✅ Icône sur l'écran d'accueil

**Résultat attendu** : Installation fluide et intuitive

---

### Test 4 : Installation Complète
**Objectif** : Installer et ouvrir l'app

#### Desktop
1. Cliquer sur l'icône ⊕ dans la barre d'adresse
2. Cliquer "Installer"
3. ✅ App s'ouvre dans une fenêtre dédiée
4. ✅ Pas de barre d'adresse
5. ✅ Icône dans le dock/barre des tâches

#### Mobile
1. Menu Chrome → "Installer l'application"
2. Confirmer
3. ✅ Icône sur l'écran d'accueil
4. Ouvrir l'icône
5. ✅ S'ouvre en plein écran
6. ✅ Splash screen au démarrage

**Résultat attendu** : Expérience "app native"

---

### Test 5 : Cache des Ressources
**Objectif** : Vérifier que les ressources sont mises en cache

1. DevTools → **Application** → **Cache Storage**
2. ✅ Voir "cotonou-explorer-v1"
3. ✅ Voir "cotonou-runtime-v1"
4. Ouvrir "cotonou-explorer-v1"
5. ✅ Voir: /, /index.html, /manifest.json, icônes
6. Ouvrir "cotonou-runtime-v1"
7. ✅ Voir: CSS, JS, images chargées

**Résultat attendu** : Ressources en cache

---

### Test 6 : Mode Hors-Ligne
**Objectif** : Tester le fonctionnement sans connexion

#### Préparation
1. Ouvrir l'app
2. Faire une recherche "hôtel"
3. Ajouter 2-3 lieux aux favoris
4. Attendre que tout soit chargé

#### Test Hors-Ligne
1. DevTools → **Network** → Cocher "Offline"
2. ✅ Badge "Vous êtes hors ligne" apparaît en haut
3. Recharger la page (F5)
4. ✅ Page se charge (depuis le cache)
5. ✅ Interface complète visible
6. Cliquer sur "Favoris"
7. ✅ Favoris visibles et accessibles
8. Essayer une nouvelle recherche
9. ✅ Message d'erreur clair

#### Retour en Ligne
1. Décocher "Offline"
2. ✅ Badge "Connexion rétablie" apparaît (3 sec)
3. Faire une recherche
4. ✅ Fonctionne normalement

**Résultat attendu** : App utilisable hors-ligne (favoris)

---

### Test 7 : Performance Cache
**Objectif** : Mesurer l'amélioration de vitesse

#### Premier Chargement
1. Vider le cache (DevTools → Application → Clear storage)
2. Recharger la page
3. DevTools → **Network** → Regarder le temps
4. ✅ ~2-3 secondes

#### Rechargements (avec cache)
1. Recharger la page (F5)
2. DevTools → **Network** → Regarder le temps
3. ✅ <500ms (beaucoup plus rapide)
4. Regarder la colonne "Size"
5. ✅ Beaucoup de "(disk cache)" ou "(ServiceWorker)"

**Résultat attendu** : 80-90% plus rapide

---

### Test 8 : Lighthouse Score
**Objectif** : Vérifier la qualité PWA

1. DevTools → **Lighthouse**
2. Cocher "Progressive Web App"
3. Cliquer "Analyze page load"
4. Attendre le rapport
5. ✅ PWA score > 90
6. ✅ "Installable" ✓
7. ✅ "Works offline" ✓
8. ✅ "Configured for a custom splash screen" ✓

**Résultat attendu** : Score PWA > 90

---

### Test 9 : Indicateur Hors-Ligne
**Objectif** : Tester les indicateurs visuels

1. Ouvrir l'app (en ligne)
2. ✅ Pas d'indicateur visible
3. Activer le mode avion (ou Offline dans DevTools)
4. ✅ Badge orange "Vous êtes hors ligne" apparaît en haut
5. ✅ Icône WifiOff visible
6. Désactiver le mode avion
7. ✅ Badge vert "Connexion rétablie" apparaît
8. ✅ Icône Wifi visible
9. Attendre 3 secondes
10. ✅ Badge vert disparaît

**Résultat attendu** : Feedback visuel clair

---

### Test 10 : Shortcuts (Raccourcis)
**Objectif** : Tester les raccourcis de l'app installée

#### Desktop
1. Installer l'app
2. Clic droit sur l'icône dans le dock
3. ✅ Voir "Rechercher" et "Favoris"
4. Cliquer "Favoris"
5. ✅ App s'ouvre sur la vue Favoris

#### Android
1. Installer l'app
2. Appui long sur l'icône
3. ✅ Voir "Rechercher" et "Favoris"
4. Cliquer "Rechercher"
5. ✅ App s'ouvre avec focus sur la recherche

**Résultat attendu** : Raccourcis fonctionnels

---

## 🔧 Tests Avancés

### Test 11 : Mise à Jour du Service Worker
**Objectif** : Tester la mise à jour automatique

1. Modifier `public/sw.js` (changer la version)
2. Recharger la page
3. DevTools → **Application** → **Service Workers**
4. ✅ Voir "waiting to activate"
5. Cliquer "skipWaiting"
6. ✅ Nouveau SW activé
7. Recharger la page
8. ✅ Nouvelle version active

**Résultat attendu** : Mise à jour fluide

---

### Test 12 : Gestion des Erreurs Réseau
**Objectif** : Tester les erreurs gracieuses

1. Activer "Offline"
2. Faire une recherche
3. ✅ Message d'erreur clair (pas de crash)
4. Aller dans Favoris
5. ✅ Fonctionne normalement
6. Essayer de charger une nouvelle image
7. ✅ Placeholder ou image en cache

**Résultat attendu** : Pas de crash, messages clairs

---

### Test 13 : Économie de Data
**Objectif** : Mesurer l'économie de bande passante

1. DevTools → **Network** → Vider
2. Recharger la page
3. Regarder le total en bas
4. ✅ Noter la taille (ex: 500 KB)
5. Recharger à nouveau
6. ✅ Noter la nouvelle taille (ex: 50 KB)
7. Calculer l'économie
8. ✅ ~90% d'économie

**Résultat attendu** : 80-90% moins de data

---

### Test 14 : Multi-Onglets
**Objectif** : Tester avec plusieurs onglets

1. Ouvrir l'app dans l'onglet 1
2. Ouvrir l'app dans l'onglet 2
3. ✅ Même Service Worker pour les deux
4. Ajouter un favori dans l'onglet 1
5. Aller dans l'onglet 2
6. ✅ Favori visible (localStorage partagé)

**Résultat attendu** : Données synchronisées

---

### Test 15 : iOS Safari
**Objectif** : Tester sur iOS (si disponible)

1. Ouvrir dans Safari iOS
2. ✅ Pas de prompt automatique (normal)
3. Bouton Partager → "Sur l'écran d'accueil"
4. Ajouter
5. ✅ Icône sur l'écran d'accueil
6. Ouvrir l'icône
7. ✅ S'ouvre en plein écran
8. ✅ Splash screen visible
9. Tester hors-ligne
10. ✅ Favoris accessibles

**Résultat attendu** : Fonctionne sur iOS

---

## 📊 Checklist Complète

### Installation
- [ ] Prompt d'installation apparaît
- [ ] Installation desktop fonctionne
- [ ] Installation mobile fonctionne
- [ ] Icône sur écran d'accueil
- [ ] Splash screen au démarrage
- [ ] Mode standalone (plein écran)

### Service Worker
- [ ] SW enregistré et actif
- [ ] Cache créé
- [ ] Ressources en cache
- [ ] Mise à jour automatique

### Mode Hors-Ligne
- [ ] Badge "Hors ligne" apparaît
- [ ] Interface accessible
- [ ] Favoris accessibles
- [ ] Messages d'erreur clairs
- [ ] Badge "Connexion rétablie"

### Performance
- [ ] Premier chargement < 3s
- [ ] Rechargements < 500ms
- [ ] Économie de data > 80%
- [ ] Lighthouse score > 90

### Manifest
- [ ] Manifest chargé
- [ ] Icônes visibles
- [ ] Couleurs correctes
- [ ] Shortcuts fonctionnels

### Compatibilité
- [ ] Chrome desktop ✓
- [ ] Chrome Android ✓
- [ ] Edge desktop ✓
- [ ] Firefox ✓
- [ ] Safari iOS ✓

---

## 🐛 Problèmes Courants

### Prompt d'installation n'apparaît pas
**Causes** :
- Déjà installé
- Déjà refusé (attendre 7 jours)
- Pas en HTTPS (sauf localhost)
- Manifest invalide

**Solution** :
1. Vérifier DevTools → Application → Manifest
2. Vider localStorage : `localStorage.removeItem('pwa_install_declined')`
3. Recharger

### Service Worker ne s'active pas
**Causes** :
- Erreur dans sw.js
- Scope incorrect
- Cache corrompu

**Solution** :
1. DevTools → Application → Service Workers
2. Cliquer "Unregister"
3. Vider le cache
4. Recharger

### Cache ne fonctionne pas
**Causes** :
- SW pas actif
- Stratégie de cache incorrecte
- Quota dépassé

**Solution** :
1. Vérifier DevTools → Application → Cache Storage
2. Vider et recréer
3. Vérifier la console pour erreurs

### Mode hors-ligne ne fonctionne pas
**Causes** :
- Ressources pas en cache
- SW pas actif
- Stratégie Network Only

**Solution** :
1. Vérifier que les ressources sont en cache
2. Vérifier la stratégie dans sw.js
3. Tester avec DevTools Offline

---

## 🎯 Résultat Attendu

**Tous les tests passent** = PWA production-ready ! 🚀

### Scores Lighthouse Attendus
- **Performance** : > 90
- **Accessibility** : > 90
- **Best Practices** : > 90
- **SEO** : > 90
- **PWA** : > 90

### Expérience Utilisateur
- ✅ Installation en 2 clics
- ✅ Chargement ultra-rapide
- ✅ Fonctionne hors-ligne
- ✅ Économie de data
- ✅ Expérience native

---

## 📞 Support

Si un test échoue :
1. Vérifier la console pour erreurs
2. Vérifier DevTools → Application
3. Consulter `FEATURES_PWA.md`
4. Vider cache et réessayer

---

**Bon test !** 🧪
