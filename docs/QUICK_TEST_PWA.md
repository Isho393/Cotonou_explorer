# 🚀 Test Rapide PWA - 5 Minutes

## Démarrage

```bash
npm run dev
```

Ouvrir : **http://localhost:5173**

---

## ✅ Test 1 : Service Worker (30 secondes)

1. Ouvrir **DevTools** (F12)
2. Aller dans **Application** → **Service Workers**
3. ✅ Voir "sw.js" avec status **"activated and is running"**

**Résultat** : Service Worker actif ✅

---

## ✅ Test 2 : Prompt d'Installation (30 secondes)

1. Regarder en bas à droite de l'écran
2. ✅ Voir le prompt "Installer l'application"
3. Cliquer **"Plus tard"**
4. ✅ Le prompt disparaît

**Résultat** : Prompt fonctionne ✅

---

## ✅ Test 3 : Mode Hors-Ligne (1 minute)

### Préparation
1. Faire une recherche : **"hôtel"**
2. Ajouter **2 favoris** (cliquer sur les cœurs)
3. Aller dans l'onglet **"Favoris"**
4. ✅ Voir les 2 favoris

### Test Hors-Ligne
1. DevTools → **Network** → Cocher **"Offline"**
2. ✅ Badge orange **"Vous êtes hors ligne"** apparaît en haut
3. Recharger la page (F5)
4. ✅ Page se charge (depuis le cache)
5. Aller dans **"Favoris"**
6. ✅ Les favoris sont toujours là !

### Retour en Ligne
1. Décocher **"Offline"**
2. ✅ Badge vert **"Connexion rétablie"** apparaît (3 sec)

**Résultat** : Mode hors-ligne fonctionne ✅

---

## ✅ Test 4 : Performance Cache (1 minute)

### Premier Chargement
1. DevTools → **Application** → **Clear storage** → **Clear site data**
2. Recharger la page
3. DevTools → **Network** → Regarder le temps en bas
4. ✅ ~2-3 secondes

### Rechargements (avec cache)
1. Recharger la page (F5)
2. DevTools → **Network** → Regarder le temps
3. ✅ **<500ms** (beaucoup plus rapide !)
4. Regarder la colonne **"Size"**
5. ✅ Beaucoup de **(disk cache)** ou **(ServiceWorker)**

**Résultat** : Cache fonctionne, 80-90% plus rapide ✅

---

## ✅ Test 5 : Installation (2 minutes)

### Desktop (Chrome/Edge)
1. Cliquer sur l'icône **⊕** dans la barre d'adresse
2. Cliquer **"Installer"**
3. ✅ App s'ouvre dans une fenêtre dédiée
4. ✅ Pas de barre d'adresse
5. ✅ Icône dans le dock/barre des tâches

### Mobile (Chrome Android)
1. Menu Chrome (⋮) → **"Installer l'application"**
2. Confirmer
3. ✅ Icône sur l'écran d'accueil
4. Ouvrir l'icône
5. ✅ S'ouvre en plein écran

**Résultat** : Installation fonctionne ✅

---

## 🎯 Résultat Final

**5/5 tests passent** = PWA fonctionnelle ! 🎉

### Ce qui fonctionne
✅ Service Worker actif
✅ Prompt d'installation
✅ Mode hors-ligne (favoris accessibles)
✅ Cache ultra-rapide (<500ms)
✅ Installation sur écran d'accueil

---

## 🐛 Si un test échoue

### Service Worker ne s'active pas
```bash
# Vérifier la console pour erreurs
# Vider le cache et réessayer
DevTools → Application → Clear storage → Clear site data
```

### Prompt n'apparaît pas
```javascript
// Dans la console
localStorage.removeItem('pwa_install_declined')
// Recharger la page
```

### Mode hors-ligne ne fonctionne pas
```bash
# Vérifier que les ressources sont en cache
DevTools → Application → Cache Storage
# Doit voir "cotonou-explorer-v1" et "cotonou-runtime-v1"
```

---

## 📊 Lighthouse (Optionnel - 2 minutes)

1. DevTools → **Lighthouse**
2. Cocher **"Progressive Web App"**
3. Cliquer **"Analyze page load"**
4. Attendre le rapport
5. ✅ PWA score > 90

---

## 🎉 Félicitations !

Votre PWA est **production-ready** ! 🚀

### Prochaines Étapes
1. Déployer sur Vercel/Netlify
2. Tester sur mobile réel
3. Partager avec des utilisateurs

---

**Temps total** : 5 minutes
**Tests** : 5/5 ✅
**Statut** : Production-ready 🚀
