# 🎯 Prochaines étapes - Cotonou Explorer

## 📝 Ce qui vient d'être fait

✅ Ajout de 10 nouvelles catégories (19 au total)  
✅ Intégration OpenStreetMap (Overpass API)  
✅ Traduction FR/EN avec i18next  
✅ Script d'import automatique des données OSM  
✅ Documentation complète  

## 🚀 Actions immédiates à faire

### 1️⃣ Configurer Supabase (si pas déjà fait)

```bash
# 1. Créer un projet sur https://supabase.com

# 2. Récupérer les clés dans Settings > API
# - Project URL
# - anon public key
# - service_role key (⚠️ secret!)

# 3. Créer le fichier .env
cp .env.example .env

# 4. Éditer .env avec vos clés
```

### 2️⃣ Créer la table `places` dans Supabase

**Option A : Via Supabase CLI** (recommandé)
```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref your-project-id

# Appliquer la migration
supabase db push
```

**Option B : Manuellement**
1. Aller sur https://app.supabase.com
2. Ouvrir **SQL Editor**
3. Copier le contenu de `supabase/migrations/20260515140000_create_places_table.sql`
4. Exécuter la requête

### 3️⃣ Importer les données OSM

```bash
# Installer les dépendances (si pas déjà fait)
npm install

# Lancer l'import (1-2 minutes)
npm run import-osm
```

**Résultat attendu :**
```
🌍 Fetching data from Overpass API...
✅ Fetched XXX elements from OSM
✅ Transformed XXX valid places
📤 Importing to Supabase...
🎉 Import complete! XXX places imported.

📊 Statistics:
By category:
  Hôtel: XX
  Restaurant: XX
  ...
```

### 4️⃣ Déployer la fonction Edge

**Via Supabase CLI :**
```bash
supabase functions deploy search-places
```

**Ou manuellement :**
1. Aller dans **Edge Functions** sur Supabase
2. Créer une nouvelle fonction `search-places`
3. Copier le contenu de `supabase/functions/search-places/index.ts`
4. Déployer

### 5️⃣ Tester l'application localement

```bash
# Lancer le serveur de dev
npm run dev

# Ouvrir http://localhost:5173
```

**Tests à faire :**
- ✅ Rechercher "restaurant" → Doit afficher des résultats
- ✅ Changer la langue FR/EN → Interface doit se traduire
- ✅ Tester toutes les catégories
- ✅ Vérifier le responsive mobile

## 🔍 Vérifications importantes

### ✅ Base de données
```sql
-- Dans SQL Editor de Supabase
SELECT COUNT(*) FROM places;
-- Doit retourner 500-2000+ lignes

SELECT category, COUNT(*) 
FROM places 
GROUP BY category 
ORDER BY COUNT(*) DESC;
-- Doit afficher la répartition par catégorie
```

### ✅ Fonction Edge
1. Aller dans **Edge Functions** > `search-places`
2. Tester avec :
   ```json
   { "query": "restaurant" }
   ```
3. Doit retourner des résultats

### ✅ Application
- Interface s'affiche correctement
- Recherche fonctionne
- Changement de langue fonctionne
- Pas d'erreurs dans la console

## 🐛 Problèmes courants

### "Missing SUPABASE_URL"
→ Vérifier que `.env` existe et contient les bonnes clés

### "Cannot find module 'tsx'"
→ Exécuter `npm install`

### Erreur lors de l'import OSM
→ Vérifier que `SUPABASE_SERVICE_ROLE_KEY` est dans `.env`

### Aucun résultat dans l'app
→ Vérifier :
1. Table `places` contient des données
2. Fonction Edge est déployée
3. Clés dans `.env` sont correctes

### Erreur CORS
→ Fonction Edge pas déployée ou URL incorrecte

## 📦 Déploiement en production

### Option 1 : Vercel (recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Configurer les variables d'environnement dans Vercel Dashboard
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
```

### Option 2 : Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod

# Configurer les variables d'environnement dans Netlify Dashboard
```

### Option 3 : GitHub Pages + Actions

1. Créer un repo GitHub
2. Pousser le code
3. Configurer GitHub Actions pour le build
4. Activer GitHub Pages

## 🔄 Maintenance

### Mise à jour des données OSM

**Fréquence recommandée :** 1 fois par mois

```bash
npm run import-osm
```

### Mise à jour des traductions

Éditer les fichiers :
- `src/i18n/locales/fr.json`
- `src/i18n/locales/en.json`

### Ajout de nouvelles catégories

1. Modifier `src/App.tsx` (ajouter dans CATEGORIES)
2. Ajouter les traductions dans `fr.json` et `en.json`
3. Mettre à jour `scripts/import-osm-data.ts` (CATEGORY_MAPPING)

## 🎯 Roadmap future

### Phase 1 (Court terme)
- [ ] Déploiement en production
- [ ] Tests automatisés (Jest/Vitest)
- [ ] CI/CD avec GitHub Actions
- [ ] Monitoring des erreurs (Sentry)

### Phase 2 (Moyen terme)
- [ ] Images pour chaque lieu (Unsplash API)
- [ ] Carte interactive (Mapbox/Leaflet)
- [ ] Filtres avancés (distance, horaires, note)
- [ ] Système de favoris (localStorage)
- [ ] Partage de lieux (URL avec paramètres)

### Phase 3 (Long terme)
- [ ] Mode hors-ligne (PWA)
- [ ] Audio TTS (Text-to-Speech)
- [ ] Support du Fon
- [ ] Contribution communautaire
- [ ] Application mobile (React Native)
- [ ] API publique

## 📚 Ressources utiles

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [React i18next](https://react.i18next.com/)
- [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Outils
- [Supabase Dashboard](https://app.supabase.com)
- [Overpass Turbo](https://overpass-turbo.eu/) - Tester les requêtes OSM
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) - Extension VS Code

## 💡 Conseils

1. **Commencez par tester localement** avant de déployer
2. **Sauvegardez vos clés Supabase** dans un gestionnaire de mots de passe
3. **Ne commitez JAMAIS le fichier .env** (déjà dans .gitignore)
4. **Mettez à jour les données OSM régulièrement** pour avoir des infos fraîches
5. **Testez sur mobile** - beaucoup d'utilisateurs seront sur téléphone

## 🤝 Besoin d'aide ?

1. Consultez `README.md` et `SETUP.md`
2. Vérifiez `IMPLEMENTATION_SUMMARY.md`
3. Regardez les logs dans la console du navigateur
4. Consultez les logs Supabase (Edge Functions)
5. Ouvrez une issue GitHub

---

**Bon courage ! 🚀**

L'application est prête à être testée et déployée. Suivez les étapes ci-dessus dans l'ordre et tout devrait bien se passer.
