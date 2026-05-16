# Guide de Test - Cotonou Explorer

## 🚀 Démarrage

```bash
npm run dev
```

Ouvrir : http://localhost:5173

---

## ✅ Tests du Système de Favoris

### Test 1 : Ajouter un Favori
1. Faire une recherche (ex: "hôtel")
2. Cliquer sur le cœur en haut à droite d'une carte
3. ✅ Le cœur devient rouge et rempli
4. ✅ Le badge "Favoris" affiche "1"

### Test 2 : Voir les Favoris
1. Cliquer sur l'onglet "Favoris"
2. ✅ Le lieu ajouté apparaît
3. ✅ Le cœur est rempli

### Test 3 : Retirer un Favori
1. Dans la vue Favoris, cliquer sur le cœur rouge
2. ✅ Le lieu disparaît
3. ✅ Le badge revient à "0"
4. ✅ Message "Aucun favori" s'affiche

### Test 4 : Persistance
1. Ajouter 2-3 favoris
2. Recharger la page (F5)
3. ✅ Les favoris sont toujours là
4. ✅ Le compteur est correct

### Test 5 : Favoris depuis la Carte
1. Faire une recherche
2. Passer en vue "Carte"
3. Cliquer sur un marqueur
4. Dans le popup, le cœur devrait être visible (si implémenté)

---

## ✅ Tests des Filtres Avancés

### Test 6 : Filtre par Note
1. Rechercher "restaurant"
2. Cliquer sur "Filtres"
3. Déplacer le slider "Note minimale" à 4.0
4. Cliquer "Appliquer"
5. ✅ Seuls les restaurants 4+ étoiles s'affichent
6. ✅ Le compteur de résultats est mis à jour

### Test 7 : Filtre par Distance
1. Rechercher "pharmacie"
2. Ouvrir les filtres
3. Cliquer "Activer la géolocalisation"
4. Accepter la demande du navigateur
5. Déplacer le slider "Distance maximale" à 5 km
6. Cliquer "Appliquer"
7. ✅ Seules les pharmacies à moins de 5 km s'affichent
8. ✅ La distance est affichée sur chaque carte

### Test 8 : Filtre "Ouvert Maintenant"
1. Rechercher "banque"
2. Ouvrir les filtres
3. Activer "Ouvert maintenant"
4. Cliquer "Appliquer"
5. ✅ Seules les banques ouvertes s'affichent
6. (Note : dépend de l'heure actuelle et des données OSM)

### Test 9 : Tri par Note
1. Rechercher "hôtel"
2. Ouvrir les filtres
3. Sélectionner "Trier par : Note"
4. Cliquer "Appliquer"
5. ✅ Les hôtels sont triés du meilleur au moins bon

### Test 10 : Tri par Distance
1. Rechercher "supermarché"
2. Activer la géolocalisation
3. Ouvrir les filtres
4. Sélectionner "Trier par : Distance"
5. Cliquer "Appliquer"
6. ✅ Les supermarchés sont triés du plus proche au plus loin

### Test 11 : Réinitialiser les Filtres
1. Appliquer plusieurs filtres
2. Cliquer "Réinitialiser"
3. ✅ Tous les filtres reviennent à leur état par défaut
4. ✅ Tous les résultats réapparaissent

---

## ✅ Tests de la Carte Interactive

### Test 12 : Affichage de la Carte
1. Rechercher "restaurant"
2. Cliquer sur "Carte"
3. ✅ La carte s'affiche avec tous les marqueurs
4. ✅ Les marqueurs ont des couleurs différentes par catégorie

### Test 13 : Popup de Marqueur
1. En vue Carte, cliquer sur un marqueur
2. ✅ Un popup s'ouvre avec :
   - Nom du lieu
   - Catégorie
   - Description
   - Note (étoiles)
   - Adresse
   - Téléphone (si disponible)
   - Horaires (si disponibles)

### Test 14 : Auto-centrage (1 lieu)
1. Rechercher un lieu spécifique (ex: "Hôtel du Port")
2. Passer en vue Carte
3. ✅ La carte est centrée sur ce lieu avec zoom 15

### Test 15 : Auto-centrage (plusieurs lieux)
1. Rechercher "pharmacie"
2. Passer en vue Carte
3. ✅ La carte ajuste le zoom pour montrer tous les marqueurs

---

## ✅ Tests de la Pagination

### Test 16 : Navigation entre Pages
1. Rechercher "restaurant" (devrait avoir 100+ résultats)
2. ✅ Affiche "Affichage de 1 à 12 sur X résultats"
3. Cliquer sur "Suivant"
4. ✅ Affiche "Affichage de 13 à 24 sur X résultats"
5. ✅ Scroll automatique vers le haut

### Test 17 : Numéros de Pages
1. Avec beaucoup de résultats
2. ✅ Affiche : 1 ... 4 5 6 ... 10 (avec ellipsis)
3. Cliquer sur un numéro
4. ✅ Va directement à cette page

### Test 18 : Pagination avec Filtres
1. Rechercher "restaurant"
2. Appliquer un filtre (note > 4)
3. ✅ La pagination s'adapte au nombre de résultats filtrés
4. ✅ Revient à la page 1

---

## ✅ Tests des Images

### Test 19 : Lazy Loading
1. Rechercher "hôtel"
2. Ouvrir DevTools > Network
3. Scroller lentement
4. ✅ Les images se chargent progressivement
5. ✅ Placeholder visible pendant le chargement

### Test 20 : Images par Catégorie
1. Rechercher différentes catégories
2. ✅ Chaque catégorie a une image cohérente
3. ✅ Images de haute qualité (Unsplash)

---

## ✅ Tests de Traduction

### Test 21 : Changement de Langue
1. Cliquer sur le toggle FR/EN en haut à droite
2. ✅ Toute l'interface passe en anglais
3. ✅ Catégories traduites
4. ✅ Messages traduits
5. Recliquer
6. ✅ Retour au français

### Test 22 : Persistance de la Langue
1. Changer la langue en EN
2. Recharger la page
3. ✅ La langue reste EN

---

## ✅ Tests de Recherche

### Test 23 : Recherche Simple
1. Taper "hôtel" et Enter
2. ✅ Résultats d'hôtels s'affichent
3. ✅ Message IA contextuel
4. ✅ Compteur de résultats

### Test 24 : Recherche par Catégorie
1. Cliquer sur une chip catégorie (ex: "Restaurants")
2. ✅ Recherche automatique
3. ✅ Chip active en surbrillance

### Test 25 : Suggestions
1. Avant toute recherche
2. ✅ Suggestions populaires affichées
3. Cliquer sur une suggestion
4. ✅ Recherche lancée automatiquement

### Test 26 : Effacer la Recherche
1. Faire une recherche
2. Cliquer sur le X dans la barre de recherche
3. ✅ Résultats effacés
4. ✅ Retour à l'écran d'accueil
5. ✅ Hero image réapparaît

### Test 27 : Cache de Recherche
1. Rechercher "pharmacie"
2. Attendre les résultats
3. Effacer et rechercher à nouveau "pharmacie"
4. ✅ Résultats instantanés (cache)

---

## ✅ Tests Responsive

### Test 28 : Mobile (375px)
1. Ouvrir DevTools > Toggle device toolbar
2. Sélectionner iPhone SE
3. ✅ Grille passe en 1 colonne
4. ✅ Tous les boutons accessibles
5. ✅ Carte fonctionne
6. ✅ Filtres s'affichent correctement

### Test 29 : Tablet (768px)
1. Sélectionner iPad
2. ✅ Grille en 2 colonnes
3. ✅ Interface adaptée

### Test 30 : Desktop (1920px)
1. Vue desktop normale
2. ✅ Grille en 2 colonnes
3. ✅ Espacement optimal

---

## ✅ Tests de Performance

### Test 31 : Temps de Chargement
1. Ouvrir DevTools > Network
2. Recharger la page (Ctrl+Shift+R)
3. ✅ First Load < 3s
4. ✅ Bundle < 250 KB

### Test 32 : Recherche Rapide
1. Rechercher "hôtel"
2. ✅ Résultats en < 1s
3. Rechercher à nouveau
4. ✅ Résultats instantanés (cache)

---

## ✅ Tests d'Erreurs

### Test 33 : Pas de Résultats
1. Rechercher "zzzzzz"
2. ✅ Message "Aucun résultat"
3. ✅ Suggestion d'essayer autre chose

### Test 34 : Géolocalisation Refusée
1. Ouvrir les filtres
2. Cliquer "Activer la géolocalisation"
3. Refuser la permission
4. ✅ Message d'erreur clair
5. ✅ Filtre de distance reste désactivé

### Test 35 : Erreur Réseau
1. Ouvrir DevTools > Network
2. Activer "Offline"
3. Faire une recherche
4. ✅ Message d'erreur
5. Désactiver "Offline"
6. Réessayer
7. ✅ Fonctionne à nouveau

---

## 🐛 Bugs Connus

Aucun bug connu pour le moment ! 🎉

---

## 📊 Checklist Complète

### Favoris
- [ ] Ajouter un favori
- [ ] Retirer un favori
- [ ] Vue Favoris
- [ ] Persistance localStorage
- [ ] Badge compteur

### Filtres
- [ ] Filtre par note
- [ ] Filtre par distance
- [ ] Filtre "Ouvert maintenant"
- [ ] Tri par note
- [ ] Tri par distance
- [ ] Réinitialiser

### Carte
- [ ] Affichage marqueurs
- [ ] Popups
- [ ] Auto-centrage
- [ ] Couleurs par catégorie

### Pagination
- [ ] Navigation pages
- [ ] Numéros avec ellipsis
- [ ] Scroll automatique
- [ ] Adaptation aux filtres

### Images
- [ ] Lazy loading
- [ ] Images par catégorie
- [ ] Placeholder

### Traduction
- [ ] Toggle FR/EN
- [ ] Toutes les clés traduites
- [ ] Persistance

### Recherche
- [ ] Recherche simple
- [ ] Catégories
- [ ] Suggestions
- [ ] Cache
- [ ] Effacer

### Responsive
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1920px)

### Performance
- [ ] Temps de chargement
- [ ] Bundle size
- [ ] Cache efficace

### Erreurs
- [ ] Pas de résultats
- [ ] Géolocalisation refusée
- [ ] Erreur réseau

---

## 🎯 Résultat Attendu

✅ **40/40 tests passent** = Application production-ready ! 🚀

---

## 💡 Conseils de Test

1. **Tester dans plusieurs navigateurs** : Chrome, Firefox, Safari
2. **Tester sur mobile réel** : pas seulement DevTools
3. **Vider le cache** : pour tester le premier chargement
4. **Tester avec connexion lente** : DevTools > Network > Slow 3G
5. **Tester l'accessibilité** : navigation au clavier (Tab)
6. **Vérifier la console** : aucune erreur JavaScript

---

## 📝 Rapport de Bug

Si vous trouvez un bug :

1. **Description** : Que s'est-il passé ?
2. **Étapes** : Comment reproduire ?
3. **Attendu** : Que devrait-il se passer ?
4. **Navigateur** : Chrome 120, Firefox 121, etc.
5. **Appareil** : Desktop, Mobile, Tablet
6. **Screenshots** : Si possible

---

Bon test ! 🧪
