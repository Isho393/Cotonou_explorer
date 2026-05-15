# 🚀 Guide d'installation rapide

## Prérequis

- Node.js 18+ installé
- Compte Supabase (gratuit) : https://supabase.com
- Git

## Étapes d'installation

### 1️⃣ Cloner et installer

```bash
git clone <votre-repo>
cd Cotonou_Explorer
npm install
```

### 2️⃣ Configurer Supabase

1. Créez un nouveau projet sur https://app.supabase.com
2. Allez dans **Settings** → **API**
3. Copiez :
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **Secret!**

### 3️⃣ Créer le fichier .env

```bash
cp .env.example .env
```

Éditez `.env` avec vos clés Supabase.

### 4️⃣ Créer la base de données

**Option A : Via Supabase CLI** (recommandé)

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref your-project-id

# Appliquer les migrations
supabase db push
```

**Option B : Manuellement**

1. Allez dans **SQL Editor** sur Supabase
2. Copiez le contenu de `supabase/migrations/20260515140000_create_places_table.sql`
3. Exécutez la requête

### 5️⃣ Importer les données OSM

```bash
npm run import-osm
```

Attendez 1-2 minutes. Vous devriez voir :

```
🌍 Fetching data from Overpass API...
✅ Fetched XXX elements from OSM
✅ Transformed XXX valid places
📤 Importing to Supabase...
🎉 Import complete! XXX places imported.
```

### 6️⃣ Déployer la fonction Edge

**Via Supabase CLI :**

```bash
supabase functions deploy search-places
```

**Ou manuellement :**

1. Allez dans **Edge Functions** sur Supabase
2. Créez une nouvelle fonction `search-places`
3. Copiez le contenu de `supabase/functions/search-places/index.ts`
4. Déployez

### 7️⃣ Lancer l'application

```bash
npm run dev
```

Ouvrez http://localhost:5173 🎉

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. **Base de données** : Allez dans **Table Editor** → `places` sur Supabase
   - Vous devriez voir des centaines de lieux

2. **Fonction Edge** : Testez dans **Edge Functions** → `search-places`
   ```json
   { "query": "restaurant" }
   ```

3. **Application** : Recherchez "restaurant" dans l'interface

## 🐛 Problèmes courants

### Erreur "Missing SUPABASE_URL"

→ Vérifiez que `.env` existe et contient les bonnes clés

### Erreur lors de l'import OSM

→ Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est défini dans `.env`

### Aucun résultat dans l'app

→ Vérifiez que :
1. La table `places` contient des données
2. La fonction Edge est déployée
3. Les clés dans `.env` sont correctes

### Erreur CORS

→ Vérifiez que la fonction Edge est bien déployée et accessible

## 📞 Support

Besoin d'aide ? Ouvrez une issue sur GitHub !
