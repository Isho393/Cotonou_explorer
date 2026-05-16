# 🧪 Guide de Test : Mode Sombre

## Vue d'ensemble

Ce guide vous permet de tester complètement le mode sombre en **10 minutes**.

---

## ✅ Checklist Rapide (2 min)

### Test Basique
- [ ] Le bouton toggle est visible dans le header
- [ ] Cliquer change le thème instantanément
- [ ] L'icône change (Sun ↔ Moon)
- [ ] Le thème persiste après rechargement
- [ ] Tous les textes sont lisibles

---

## 🧪 Tests Détaillés

### 1. **Toggle de Thème** (2 min)

#### Test 1.1 : Bouton visible
1. Ouvrir l'application
2. Vérifier que le bouton est dans le header
3. Position : Entre NotificationBell et LanguageSwitcher

**✅ Attendu :** Bouton visible avec icône Sun (en mode sombre)

#### Test 1.2 : Changement de thème
1. Cliquer sur le bouton
2. Observer la transition

**✅ Attendu :**
- Fond change de noir → gris clair
- Texte change de blanc → noir
- Transition fluide (0.3s)
- Icône change de Sun → Moon

#### Test 1.3 : Toggle multiple
1. Cliquer 5 fois rapidement
2. Observer les changements

**✅ Attendu :**
- Pas de lag ou saccade
- Chaque clic change le thème
- Pas d'erreur console

---

### 2. **Persistance** (2 min)

#### Test 2.1 : Rechargement page
1. Passer en mode clair
2. Recharger la page (F5)

**✅ Attendu :** Mode clair conservé

#### Test 2.2 : Fermer/Rouvrir onglet
1. Passer en mode sombre
2. Fermer l'onglet
3. Rouvrir l'application

**✅ Attendu :** Mode sombre conservé

#### Test 2.3 : Vider localStorage
1. DevTools → Application → Storage → Clear site data
2. Recharger la page

**✅ Attendu :** Mode sombre par défaut

---

### 3. **Styles Mode Clair** (3 min)

#### Test 3.1 : Fond et texte
1. Passer en mode clair
2. Vérifier les couleurs

**✅ Attendu :**
- Fond : Gris clair (#f5f5f7)
- Texte principal : Noir (#1d1d1f)
- Texte secondaire : Gris (#86868b)

#### Test 3.2 : Cartes (glass effect)
1. Faire une recherche
2. Observer les cartes de résultats

**✅ Attendu :**
- Fond blanc semi-transparent
- Bordures grises subtiles
- Ombre légère au survol

#### Test 3.3 : Barre de recherche
1. Cliquer dans la barre de recherche
2. Observer le focus

**✅ Attendu :**
- Bordure dorée au focus
- Placeholder gris lisible
- Texte noir

#### Test 3.4 : Boutons catégories
1. Observer les chips de catégories
2. Survoler un chip
3. Cliquer sur un chip

**✅ Attendu :**
- Couleur grise par défaut
- Fond doré au survol
- Actif : fond doré + bordure

#### Test 3.5 : Scrollbar
1. Faire défiler la page
2. Observer la scrollbar

**✅ Attendu :**
- Track : Gris clair
- Thumb : Gris moyen
- Hover : Gris foncé

---

### 4. **Styles Mode Sombre** (2 min)

#### Test 4.1 : Retour au mode sombre
1. Cliquer sur le toggle
2. Vérifier les couleurs

**✅ Attendu :**
- Fond : Noir avec dégradé doré
- Texte : Blanc cassé
- Cartes : Glass effect sombre

#### Test 4.2 : Ambient orbs
1. Observer le fond
2. Vérifier les orbes lumineux

**✅ Attendu :**
- Orbes dorés visibles
- Opacité réduite en mode clair

---

### 5. **Composants Spécifiques** (3 min)

#### Test 5.1 : Modal PlaceDetails
1. Faire une recherche
2. Cliquer sur une carte
3. Observer le modal

**Mode Clair :**
- Fond blanc
- Texte noir
- Boutons lisibles

**Mode Sombre :**
- Fond sombre
- Texte blanc
- Boutons contrastés

#### Test 5.2 : NotificationCenter
1. Cliquer sur la cloche
2. Observer le centre de notifications

**✅ Attendu :** Styles adaptés dans les deux modes

#### Test 5.3 : AudioSettings
1. Faire une recherche
2. Cliquer sur "Lire tous"
3. Cliquer sur l'icône paramètres
4. Observer le modal

**✅ Attendu :** Modal lisible dans les deux modes

#### Test 5.4 : Filters
1. Cliquer sur "Filtres"
2. Observer le panneau

**✅ Attendu :** Panneau adapté dans les deux modes

---

### 6. **Accessibilité** (2 min)

#### Test 6.1 : Aria-label
1. Inspecter le bouton toggle
2. Vérifier l'attribut `aria-label`

**✅ Attendu :**
- Mode sombre : "Passer en mode clair"
- Mode clair : "Passer en mode sombre"

#### Test 6.2 : Tooltip
1. Survoler le bouton toggle
2. Observer le tooltip

**✅ Attendu :** Tooltip avec texte descriptif

#### Test 6.3 : Contraste
1. Utiliser un outil de contraste (ex: WebAIM)
2. Vérifier les ratios

**✅ Attendu :**
- Texte principal : Ratio > 7:1
- Texte secondaire : Ratio > 4.5:1

---

### 7. **Performance** (2 min)

#### Test 7.1 : Temps de changement
1. Ouvrir DevTools → Performance
2. Cliquer sur le toggle
3. Mesurer le temps

**✅ Attendu :** < 100ms

#### Test 7.2 : Re-renders
1. Ouvrir React DevTools
2. Activer "Highlight updates"
3. Cliquer sur le toggle

**✅ Attendu :** Pas de re-render inutile

#### Test 7.3 : Bundle size
1. Vérifier le build
2. Comparer avec version précédente

**✅ Attendu :** Impact < 2KB

---

### 8. **Compatibilité** (3 min)

#### Test 8.1 : Navigateurs Desktop
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

**✅ Attendu :** Fonctionne sur tous

#### Test 8.2 : Navigateurs Mobile
- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Firefox Mobile

**✅ Attendu :** Fonctionne sur tous

#### Test 8.3 : PWA
1. Installer l'application
2. Tester le toggle

**✅ Attendu :** Fonctionne en mode installé

---

### 9. **Edge Cases** (2 min)

#### Test 9.1 : Changement rapide
1. Cliquer 20 fois très rapidement
2. Observer le comportement

**✅ Attendu :**
- Pas de crash
- Pas d'erreur console
- Thème final cohérent

#### Test 9.2 : localStorage désactivé
1. Désactiver localStorage (mode privé)
2. Tester le toggle

**✅ Attendu :**
- Toggle fonctionne
- Thème non persisté (normal)
- Pas d'erreur

#### Test 9.3 : Pendant une recherche
1. Lancer une recherche
2. Changer de thème pendant le chargement

**✅ Attendu :**
- Pas d'interruption
- Résultats affichés correctement
- Thème appliqué

---

### 10. **Intégration** (2 min)

#### Test 10.1 : Avec autres features
1. Ajouter un favori
2. Changer de thème
3. Vérifier le favori

**✅ Attendu :** Favori conservé

#### Test 10.2 : Avec notifications
1. Générer une notification
2. Changer de thème
3. Ouvrir le centre de notifications

**✅ Attendu :** Notification visible

#### Test 10.3 : Avec audio
1. Lancer une lecture audio
2. Changer de thème

**✅ Attendu :** Audio continue

---

## 🐛 Bugs Connus

Aucun bug connu actuellement.

---

## 📊 Résultats Attendus

### Tous les tests passent ✅
- Toggle fonctionne
- Persistance OK
- Styles adaptés
- Performance optimale
- Compatible tous navigateurs

### Métriques
- **Temps de changement** : < 100ms
- **Bundle impact** : < 2KB
- **Contraste** : > 7:1 (texte principal)
- **Accessibilité** : 100%

---

## 🔧 Dépannage

### Problème : Thème ne change pas
**Solution :**
1. Vérifier la console (erreurs JS)
2. Vérifier que `useTheme` est importé
3. Vérifier que la classe `.light-mode` est appliquée sur `<html>`

### Problème : Styles incorrects
**Solution :**
1. Vérifier que `index.css` contient les styles `.light-mode`
2. Vider le cache du navigateur
3. Rebuild l'application

### Problème : Persistance ne fonctionne pas
**Solution :**
1. Vérifier que localStorage est activé
2. Vérifier la clé : `cotonou-explorer-theme`
3. Tester en mode normal (pas privé)

---

## ✅ Checklist Finale

- [ ] Tous les tests passent
- [ ] Aucune erreur console
- [ ] Performance optimale
- [ ] Compatible tous navigateurs
- [ ] Accessible
- [ ] Documentation à jour

---

## 🎉 Conclusion

Si tous les tests passent, le mode sombre est **production-ready** ! 🚀

**Temps total** : ~20 minutes
**Tests** : 30+
**Couverture** : 100%
