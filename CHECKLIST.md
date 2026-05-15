# ✅ Checklist de vérification - Cotonou Explorer

Utilisez cette checklist pour vous assurer que tout est correctement configuré et fonctionne.

## 📋 Avant de commencer

### Prérequis
- [ ] Node.js 18+ installé (`node --version`)
- [ ] npm installé (`npm --version`)
- [ ] Compte Supabase créé (https://supabase.com)
- [ ] Git installé (optionnel)

---

## 🔧 Configuration initiale

### 1. Installation des dépendances
```bash
npm install
```
- [ ] Commande exécutée sans erreur
- [ ] Dossier `node_modules` créé
- [ ] Packages i18next installés

### 2. Configuration Supabase
- [ ] Projet Supabase créé
- [ ] URL du projet récupérée
- [ ] Clé `anon public` récupérée
- [ ] Clé `service_role` récupérée (⚠️ secret!)

### 3. Fichier .env
```bash
cp .env.example .env
```
- [ ] Fichier `.env` créé
- [ ] `VITE_SUPABASE_URL` renseigné
- [ ] `VITE_SUPABASE_ANON_KEY` renseigné
- [ ] `SUPABASE_SERVICE_ROLE_KEY` renseigné

---

## 🗄️ Base de données

### 4. Création de la table `places`

**Option A : Via Supabase CLI**
```bash
supabase login
supabase link --project-ref your-project-id
supabase db push
```

**Option B : Manuellement**
- [ ] Aller sur https://app.supabase.com
- [ ] Ouvrir SQL Editor
- [ ] Copier le contenu de `supabase/migrations/20260515140000_create_places_table.sql`
- [ ] Exécuter la requête

**Vérification :**
- [ ] Table `places` visible dans Table Editor
- [ ] Colonnes correctes (id, osm_id, name, category, etc.)

### 5. Import des données OSM
```bash
npm run import-osm
```

**Attendu :**
```
🌍 Fetching data from Overpass API...
✅ Fetched XXX elements from OSM
✅ Transformed XXX valid places
📤 Importing to Supabase...
🎉 Import complete! XXX places imported.
```

**Vérification :**
- [ ] Script exécuté sans erreur
- [ ] Message "Import complete" affiché
- [ ] Statistiques par catégorie affichées

**Vérification dans Supabase :**
```sql
SELECT COUNT(*) FROM places;
-- Doit retourner 500-2000+

SELECT category, COUNT(*) 
FROM places 
GROUP BY category 
ORDER BY COUNT(*) DESC;
-- Doit afficher toutes les catégories
```
- [ ] Au moins 500 lieux importés
- [ ] Plusieurs catégories présentes

---

## ⚡ Fonction Edge

### 6. Déploiement de la fonction

**Via Supabase CLI :**
```bash
supabase functions deploy search-places
```

**Ou manuellement :**
- [ ] Aller dans Edge Functions sur Supabase
- [ ] Créer fonction `search-places`
- [ ] Copier le contenu de `supabase/functions/search-places/index.ts`
- [ ] Déployer

**Test de la fonction :**
- [ ] Aller dans Edge Functions > search-places
- [ ] Tester avec : `{ "query": "restaurant" }`
- [ ] Résultats retournés (array de lieux)
- [ ] Pas d'erreur dans les logs

---

## 💻 Application locale

### 7. Compilation TypeScript
```bash
npm run typecheck
```
- [ ] Aucune erreur TypeScript
- [ ] Message de succès

### 8. Lancement du serveur de dev
```bash
npm run dev
```
- [ ] Serveur démarre sur http://localhost:5173
- [ ] Aucune erreur dans le terminal
- [ ] Page s'ouvre dans le navigateur

### 9. Tests de l'interface

**Page d'accueil :**
- [ ] Titre "Explorez Cotonou" affiché
- [ ] Sélecteur de langue FR/EN visible
- [ ] Barre de recherche fonctionnelle
- [ ] 19 catégories affichées
- [ ] Suggestions populaires visibles
- [ ] Image hero affichée

**Changement de langue :**
- [ ] Cliquer sur "EN"
- [ ] Interface traduite en anglais
- [ ] Titre devient "Explore Cotonou"
- [ ] Catégories traduites
- [ ] Cliquer sur "FR"
- [ ] Retour au français

**Recherche :**
- [ ] Taper "restaurant" et rechercher
- [ ] Résultats affichés (plusieurs restaurants)
- [ ] Message IA contextuel affiché
- [ ] Nombre de résultats affiché
- [ ] Cartes de lieux avec infos complètes

**Catégories :**
- [ ] Cliquer sur "Hôtels"
- [ ] Résultats d'hôtels affichés
- [ ] Catégorie active mise en surbrillance
- [ ] Tester 2-3 autres catégories

**Responsive :**
- [ ] Ouvrir DevTools (F12)
- [ ] Mode mobile (iPhone/Android)
- [ ] Interface adaptée
- [ ] Catégories scrollables horizontalement
- [ ] Recherche fonctionnelle

**Console navigateur :**
- [ ] Ouvrir la console (F12)
- [ ] Aucune erreur rouge
- [ ] Pas d'avertissements critiques

---

## 🚀 Déploiement (optionnel)

### 10. Build de production
```bash
npm run build
```
- [ ] Build réussi
- [ ] Dossier `dist` créé
- [ ] Pas d'erreurs

### 11. Déploiement Vercel/Netlify
- [ ] Compte créé
- [ ] Projet déployé
- [ ] Variables d'environnement configurées
- [ ] Site accessible en ligne
- [ ] Recherche fonctionne en production

---

## 🔍 Tests fonctionnels complets

### Scénarios à tester :

#### Scénario 1 : Recherche basique
1. [ ] Ouvrir l'application
2. [ ] Taper "hôpital" dans la barre de recherche
3. [ ] Cliquer sur "Rechercher"
4. [ ] Vérifier que des hôpitaux s'affichent
5. [ ] Vérifier le message IA

#### Scénario 2 : Catégories
1. [ ] Cliquer sur "Pharmacies"
2. [ ] Vérifier que des pharmacies s'affichent
3. [ ] Cliquer sur "Banques"
4. [ ] Vérifier que des banques s'affichent

#### Scénario 3 : Traduction
1. [ ] Changer la langue en EN
2. [ ] Vérifier que tout est traduit
3. [ ] Faire une recherche "hospital"
4. [ ] Vérifier que les résultats s'affichent
5. [ ] Revenir en FR

#### Scénario 4 : Suggestions
1. [ ] Cliquer sur "Meilleur hôtel à Cotonou"
2. [ ] Vérifier que des hôtels s'affichent
3. [ ] Effacer la recherche
4. [ ] Tester une autre suggestion

#### Scénario 5 : Aucun résultat
1. [ ] Rechercher "xyz123abc"
2. [ ] Vérifier le message "Aucun résultat"
3. [ ] Vérifier le message d'aide

---

## 📊 Métriques de qualité

### Performance
- [ ] Temps de chargement < 3 secondes
- [ ] Recherche < 1 seconde
- [ ] Changement de langue instantané

### Données
- [ ] Au moins 500 lieux dans la base
- [ ] Toutes les 19 catégories représentées
- [ ] Données cohérentes (noms, adresses)

### UX
- [ ] Interface intuitive
- [ ] Pas de bugs visuels
- [ ] Responsive mobile/desktop
- [ ] Animations fluides

---

## ❌ Problèmes courants

### "Missing SUPABASE_URL"
- [ ] Vérifier que `.env` existe
- [ ] Vérifier les clés dans `.env`
- [ ] Redémarrer le serveur de dev

### Aucun résultat
- [ ] Vérifier que la table `places` contient des données
- [ ] Vérifier que la fonction Edge est déployée
- [ ] Vérifier les logs de la fonction Edge

### Erreur lors de l'import OSM
- [ ] Vérifier `SUPABASE_SERVICE_ROLE_KEY` dans `.env`
- [ ] Vérifier la connexion internet
- [ ] Réessayer l'import

### Traduction ne fonctionne pas
- [ ] Vérifier que `src/i18n/config.ts` est importé dans `main.tsx`
- [ ] Vérifier les fichiers JSON de traduction
- [ ] Vider le cache du navigateur

---

## ✅ Validation finale

### Checklist complète
- [ ] Toutes les dépendances installées
- [ ] Base de données créée et remplie
- [ ] Fonction Edge déployée
- [ ] Application fonctionne localement
- [ ] Recherche fonctionne
- [ ] Traduction fonctionne
- [ ] Toutes les catégories fonctionnent
- [ ] Responsive OK
- [ ] Aucune erreur console

### Prêt pour la production ?
- [ ] Tous les tests passent
- [ ] Documentation lue
- [ ] Variables d'environnement configurées
- [ ] Build de production réussi

---

## 🎉 Félicitations !

Si toutes les cases sont cochées, votre application Cotonou Explorer est **prête à être utilisée** ! 🚀

### Prochaines étapes :
1. Déployer en production (Vercel/Netlify)
2. Partager avec des utilisateurs
3. Collecter des retours
4. Planifier les prochaines fonctionnalités

---

**Besoin d'aide ?** Consultez :
- `NEXT_STEPS.md` - Guide détaillé
- `README.md` - Documentation
- `SETUP.md` - Installation
