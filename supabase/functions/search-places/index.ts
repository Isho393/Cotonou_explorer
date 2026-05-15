import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Fallback data for development/testing
const FALLBACK_PLACE_DATABASE: Record<string, { name: string; category: string; address: string; description: string; phone?: string; hours?: string; rating: number; lat: number; lng: number }[]> = {
  hotels: [
    { name: "Golden Tulip Le Diplomat", category: "Hôtel", address: "Boulevard de la Marina, Cotonou", description: "Hôtel 5 étoiles avec vue sur la marina, piscine et restaurant gastronomique.", phone: "+229 21 31 14 00", hours: "24h/24", rating: 4.7, lat: 6.3654, lng: 2.4195 },
    { name: "Novotel Cotonou Orisha", category: "Hôtel", address: "Avenue Jean-Paul II, Cotonou", description: "Hôtel international de luxe en plein cœur de la ville avec spa et fitness.", phone: "+229 21 30 06 00", hours: "24h/24", rating: 4.5, lat: 6.3671, lng: 2.4230 },
    { name: "Hôtel du Lac", category: "Hôtel", address: "Boulevard Saint-Michel, Cotonou", description: "Hôtel confortable avec vue sur le lac Nokoué, idéal pour les affaires.", phone: "+229 21 31 25 00", hours: "24h/24", rating: 4.2, lat: 6.3612, lng: 2.4150 },
    { name: "Hôtel Bénin Marina", category: "Hôtel", address: "Avenue Pape Jean-Paul II, Cotonou", description: "Établissement de standing avec plage privée et services haut de gamme.", phone: "+229 21 30 01 00", hours: "24h/24", rating: 4.4, lat: 6.3680, lng: 2.4210 },
    { name: "Hôtel Croix du Sud", category: "Hôtel", address: "Quartier Ganhi, Cotonou", description: "Hôtel classique au centre-ville, idéal pour les voyageurs d'affaires.", phone: "+229 21 31 24 25", hours: "24h/24", rating: 3.8, lat: 6.3590, lng: 2.4280 },
  ],
  restaurants: [
    { name: "Le Livingstone", category: "Restaurant", address: "Quartier Haie Vive, Cotonou", description: "Restaurant africain chic proposant des mets traditionnels et internationaux dans un cadre verdoyant.", phone: "+229 97 00 00 00", hours: "12h-23h", rating: 4.6, lat: 6.3720, lng: 2.4100 },
    { name: "Le Jardin de l'Amitié", category: "Restaurant", address: "Avenue Jean-Paul II, Cotonou", description: "Cuisine franco-béninoise dans un jardin tropical, ambiance romantique.", phone: "+229 21 31 45 60", hours: "11h30-22h30", rating: 4.4, lat: 6.3700, lng: 2.4220 },
    { name: "Maquis du Roi", category: "Restaurant / Maquis", address: "Quartier Cadjèhoun, Cotonou", description: "Spécialités locales : grillades, poisson braisé et sauce de palme dans une ambiance animée.", phone: "+229 97 12 34 56", hours: "10h-00h", rating: 4.3, lat: 6.3580, lng: 2.3950 },
    { name: "Amazone Restaurant", category: "Restaurant", address: "Quartier Akpakpa, Cotonou", description: "Restaurant familial proposant brochettes, yassa et plats locaux.", phone: "+229 96 45 67 89", hours: "08h-22h", rating: 4.0, lat: 6.3640, lng: 2.4520 },
    { name: "Le Buffet de la gare", category: "Restaurant", address: "Gare routière de Cotonou", description: "Restauration rapide et traditionnelle pour les voyageurs.", phone: "+229 95 00 11 22", hours: "06h-21h", rating: 3.7, lat: 6.3555, lng: 2.4350 },
    { name: "Chez Théo", category: "Restaurant / Brasserie", address: "Boulevard de la Marina, Cotonou", description: "Brasserie moderne avec terrasse sur la marina, fruits de mer frais et cocktails.", phone: "+229 21 31 78 90", hours: "10h-01h", rating: 4.5, lat: 6.3660, lng: 2.4200 },
  ],
  hospitals: [
    { name: "Centre National Hospitalier Universitaire (CNHU)", category: "Hôpital", address: "Boulevard Steinmetz, Cotonou", description: "Principal hôpital public de référence du Bénin, toutes spécialités médicales.", phone: "+229 21 30 01 55", hours: "24h/24", rating: 3.8, lat: 6.3626, lng: 2.4155 },
    { name: "Clinique Atinkanmey", category: "Clinique", address: "Quartier Cadjèhoun, Cotonou", description: "Clinique privée moderne avec bloc opératoire, maternité et urgences.", phone: "+229 21 30 52 11", hours: "24h/24", rating: 4.3, lat: 6.3600, lng: 2.3960 },
    { name: "Polyclinique Les Cocotiers", category: "Polyclinique", address: "Haie Vive, Cotonou", description: "Établissement privé proposant consultations, radiologie et laboratoire.", phone: "+229 21 37 11 11", hours: "07h-21h", rating: 4.2, lat: 6.3730, lng: 2.4120 },
    { name: "Hôpital de Zone de Cotonou 1", category: "Hôpital de zone", address: "Quartier Gbèdjromèdé, Cotonou", description: "Hôpital de proximité avec maternité, pédiatrie et médecine générale.", phone: "+229 21 32 05 00", hours: "24h/24", rating: 3.6, lat: 6.3530, lng: 2.4400 },
    { name: "Centre de Santé Saint-Luc", category: "Centre de santé", address: "Quartier Akpakpa, Cotonou", description: "Centre de santé catholique avec consultations générales et spécialisées.", phone: "+229 21 33 02 00", hours: "07h30-18h", rating: 4.1, lat: 6.3650, lng: 2.4510 },
  ],
  pharmacies: [
    { name: "Pharmacie de la Nation", category: "Pharmacie", address: "Place de l'Étoile Rouge, Cotonou", description: "Grande pharmacie centrale ouverte tous les jours avec large stock de médicaments.", phone: "+229 21 31 20 00", hours: "08h-22h", rating: 4.4, lat: 6.3634, lng: 2.4270 },
    { name: "Pharmacie Cadjèhoun", category: "Pharmacie", address: "Cadjèhoun, Cotonou", description: "Pharmacie de quartier bien approvisionnée, équipe accueillante.", phone: "+229 21 30 14 22", hours: "08h-21h", rating: 4.1, lat: 6.3595, lng: 2.3970 },
    { name: "Pharmacie Croix Rouge", category: "Pharmacie de garde", address: "Avenue Clozel, Cotonou", description: "Pharmacie de garde disponible la nuit et les week-ends.", phone: "+229 21 31 33 44", hours: "24h/24", rating: 4.0, lat: 6.3620, lng: 2.4290 },
  ],
  banks: [
    { name: "Bank of Africa Bénin (BOA)", category: "Banque", address: "Avenue Jean-Paul II, Cotonou", description: "Grande banque africaine avec distributeurs automatiques et services aux entreprises.", phone: "+229 21 31 32 28", hours: "Lun-Ven 8h-17h", rating: 4.0, lat: 6.3678, lng: 2.4240 },
    { name: "Ecobank Bénin", category: "Banque", address: "Boulevard Saint-Michel, Cotonou", description: "Banque panafricaine offrant services en ligne, transferts et épargne.", phone: "+229 21 31 40 23", hours: "Lun-Ven 8h-16h30", rating: 4.1, lat: 6.3605, lng: 2.4165 },
    { name: "NSIA Banque", category: "Banque", address: "Quartier Ganhi, Cotonou", description: "Banque ivoiro-béninoise avec services complets aux particuliers et professionnels.", phone: "+229 21 31 60 00", hours: "Lun-Ven 8h-17h", rating: 3.9, lat: 6.3588, lng: 2.4290 },
  ],
  markets: [
    { name: "Marché Dantokpa", category: "Marché", address: "Quartier Dantokpa, Cotonou", description: "Le plus grand marché d'Afrique de l'Ouest avec des milliers de boutiques et étals.", phone: "", hours: "06h-19h", rating: 4.3, lat: 6.3542, lng: 2.4390 },
    { name: "Marché de Ganhi", category: "Marché", address: "Quartier Ganhi, Cotonou", description: "Marché central spécialisé en électronique, vêtements et produits variés.", phone: "", hours: "07h-19h", rating: 4.0, lat: 6.3585, lng: 2.4285 },
    { name: "Marché Cadjèhoun", category: "Marché de quartier", address: "Cadjèhoun, Cotonou", description: "Marché local vivant pour légumes frais, poissons et épices.", phone: "", hours: "05h-18h", rating: 3.9, lat: 6.3593, lng: 2.3980 },
  ],
  schools: [
    { name: "Université d'Abomey-Calavi (UAC)", category: "Université", address: "Abomey-Calavi (périphérie Cotonou)", description: "Principale université publique du Bénin, toutes filières.", phone: "+229 21 36 00 84", hours: "Lun-Sam 8h-18h", rating: 3.9, lat: 6.4070, lng: 2.3350 },
    { name: "BEPC International School", category: "École internationale", address: "Haie Vive, Cotonou", description: "École internationale bilingue de la maternelle au lycée.", phone: "+229 21 37 25 00", hours: "Lun-Ven 7h30-16h", rating: 4.5, lat: 6.3740, lng: 2.4130 },
    { name: "Lycée Technique de Cotonou", category: "Lycée", address: "Quartier Zogbo, Cotonou", description: "Lycée technique public proposant des formations professionnelles variées.", phone: "+229 21 30 42 00", hours: "Lun-Ven 7h-18h", rating: 3.7, lat: 6.3570, lng: 2.4080 },
  ],
  supermarkets: [
    { name: "Score Supermarché", category: "Supermarché", address: "Haie Vive, Cotonou", description: "Grande surface bien fournie en produits locaux et importés.", phone: "+229 21 37 00 00", hours: "08h-21h", rating: 4.3, lat: 6.3725, lng: 2.4115 },
    { name: "Erevan Supermarché", category: "Supermarché", address: "Cadjèhoun, Cotonou", description: "Supermarché populaire avec boucherie, boulangerie et produits frais.", phone: "+229 21 30 85 00", hours: "07h30-21h30", rating: 4.1, lat: 6.3599, lng: 2.3990 },
  ],
  entertainment: [
    { name: "La Lagune", category: "Bar / Lounge", address: "Boulevard de la Marina, Cotonou", description: "Bar branché avec vue sur la lagune, cocktails créatifs et musique live.", phone: "+229 97 55 44 33", hours: "17h-03h", rating: 4.5, lat: 6.3662, lng: 2.4205 },
    { name: "Cinéma Concorde", category: "Cinéma", address: "Quartier Ganhi, Cotonou", description: "Salle de cinéma moderne diffusant films africains et internationaux.", phone: "+229 21 31 00 77", hours: "10h-23h", rating: 4.0, lat: 6.3581, lng: 2.4295 },
    { name: "Complexe Sportif de Cotonou", category: "Sport", address: "Boulevard Saint-Michel", description: "Complexe avec piscine olympique, terrains de sport et salle de fitness.", phone: "+229 21 31 15 00", hours: "06h-22h", rating: 3.8, lat: 6.3608, lng: 2.4160 },
  ],
};

// Search places in database
async function searchPlacesInDB(supabase: any, query: string) {
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Category keywords for intelligent matching
  const categoryKeywords: Record<string, string[]> = {
    "Hôtel": ["hotel", "lodge", "hebergement", "dormir", "nuit", "chambre", "sejour"],
    "Restaurant": ["restaurant", "manger", "nourriture", "cuisine", "repas", "dejeuner", "diner", "maquis", "brasserie", "cafe", "cafeteria"],
    "Hôpital": ["hopital", "clinique", "medecin", "sante", "urgence", "soins", "docteur", "polyclinique", "infirmier"],
    "Pharmacie": ["pharmacie", "medicament", "ordonnance", "sante", "parapharmacie"],
    "Banque": ["banque", "argent", "retrait", "distributeur", "atm", "virement", "compte", "credit"],
    "Marché": ["marche", "courses", "acheter", "bazar", "commerce"],
    "École": ["ecole", "universite", "lycee", "college", "formation", "etudes", "classe", "enseignement"],
    "Supermarché": ["supermarche", "supermarket", "courses", "epicerie", "grande surface"],
    "Transport": ["transport", "gare", "bus", "taxi", "aeroport", "port"],
    "Station-service": ["station", "service", "carburant", "essence", "gasoil"],
    "Service public": ["mairie", "commissariat", "police", "pompier", "ambassade", "prefecture"],
    "Lieu de culte": ["eglise", "mosquee", "temple", "culte", "priere"],
    "Tourisme": ["monument", "musee", "plage", "tourisme", "visite", "attraction"],
    "Beauté": ["salon", "coiffure", "spa", "beaute", "massage"],
    "Immobilier": ["immobilier", "agence", "location", "vente"],
    "Loisirs": ["parc", "jardin", "sport", "loisir", "cinema"],
    "Service professionnel": ["avocat", "comptable", "notaire", "bureau"],
  };
  
  // Try to match category first
  let matchedCategories: string[] = [];
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => q.includes(kw))) {
      matchedCategories.push(category);
    }
  }
  
  let dbQuery = supabase.from('places').select('*');
  
  if (matchedCategories.length > 0) {
    // Search by category
    dbQuery = dbQuery.in('category', matchedCategories);
  } else {
    // Full-text search on name, description, address
    const searchTerms = q.split(' ').filter(w => w.length > 2);
    if (searchTerms.length > 0) {
      dbQuery = dbQuery.or(
        searchTerms.map(term => 
          `name.ilike.%${term}%,description.ilike.%${term}%,address.ilike.%${term}%,category.ilike.%${term}%`
        ).join(',')
      );
    }
  }
  
  const { data, error } = await dbQuery.order('rating', { ascending: false }).limit(50);
  
  if (error) {
    console.error('Database error:', error);
    return [];
  }
  
  return (data || []).map((place: any) => ({
    name: place.name,
    category: place.category,
    address: place.address,
    description: place.description,
    phone: place.phone,
    hours: place.opening_hours,
    rating: place.rating,
    lat: place.lat,
    lng: place.lng,
  }));
}

// Fallback search for development
function searchPlacesFallback(query: string) {
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const keywords: Record<string, string[]> = {
    hotels: ["hotel", "lodge", "hebergement", "dormir", "nuit", "chambre", "sejour"],
    restaurants: ["restaurant", "manger", "nourriture", "cuisine", "repas", "dejeuner", "diner", "maquis", "brasserie", "cafe", "cafeteria"],
    hospitals: ["hopital", "clinique", "medecin", "sante", "urgence", "soins", "docteur", "polyclinique", "infirmier"],
    pharmacies: ["pharmacie", "medicament", "ordonnance", "sante", "parapharmacie"],
    banks: ["banque", "argent", "retrait", "distributeur", "atm", "virement", "compte", "credit"],
    markets: ["marche", "courses", "acheter", "bazar", "commerce"],
    schools: ["ecole", "universite", "lycee", "college", "formation", "etudes", "classe", "enseignement"],
    supermarkets: ["supermarche", "supermarket", "courses", "epicerie", "grande surface"],
    entertainment: ["bar", "lounge", "cinema", "sortie", "divertissement", "sport", "musique", "nuit", "club"],
  };

  const results: typeof FALLBACK_PLACE_DATABASE[string] = [];
  const addedNames = new Set<string>();

  for (const [cat, terms] of Object.entries(keywords)) {
    if (terms.some(t => q.includes(t))) {
      for (const place of FALLBACK_PLACE_DATABASE[cat]) {
        if (!addedNames.has(place.name)) {
          results.push(place);
          addedNames.add(place.name);
        }
      }
    }
  }

  if (results.length === 0) {
    for (const places of Object.values(FALLBACK_PLACE_DATABASE)) {
      for (const place of places) {
        const searchable = (place.name + " " + place.description + " " + place.category + " " + place.address)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (q.split(" ").some(word => word.length > 2 && searchable.includes(word))) {
          if (!addedNames.has(place.name)) {
            results.push(place);
            addedNames.add(place.name);
          }
        }
      }
    }
  }

  return results.sort((a, b) => b.rating - a.rating);
}

function generateAIResponse(query: string, results: ReturnType<typeof searchPlaces>): string {
  const q = query.toLowerCase();
  if (results.length === 0) {
    return `Je n'ai pas trouvé de résultats pour "${query}" à Cotonou. Essayez des termes comme "hôtel", "restaurant", "hôpital", "pharmacie", "banque" ou "marché".`;
  }
  const top = results[0];
  const count = results.length;

  if (q.includes("hotel") || q.includes("dormir") || q.includes("hébergement")) {
    return `J'ai trouvé ${count} hôtel${count > 1 ? "s" : ""} à Cotonou. Le mieux noté est **${top.name}** (${top.rating}/5) situé ${top.address}. ${top.description}`;
  }
  if (q.includes("restaurant") || q.includes("manger") || q.includes("repas")) {
    return `Voici ${count} restaurant${count > 1 ? "s" : ""} à Cotonou. Je vous recommande **${top.name}** (${top.rating}/5) — ${top.description}`;
  }
  if (q.includes("hopital") || q.includes("hôpital") || q.includes("clinique") || q.includes("médecin") || q.includes("medecin")) {
    return `J'ai localisé ${count} établissement${count > 1 ? "s" : ""} de santé à Cotonou. L'établissement le mieux évalué est **${top.name}** (${top.rating}/5) — ${top.description}`;
  }
  return `J'ai trouvé ${count} lieu${count > 1 ? "x" : ""} correspondant à votre recherche "${query}" à Cotonou. Le plus recommandé est **${top.name}** — ${top.description}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search in database, fallback to hardcoded data if DB fails
    let results;
    try {
      results = await searchPlacesInDB(supabase, query.trim());
      if (results.length === 0) {
        // Try fallback data
        results = searchPlacesFallback(query.trim());
      }
    } catch (dbError) {
      console.error('Database search failed, using fallback:', dbError);
      results = searchPlacesFallback(query.trim());
    }

    const aiMessage = generateAIResponse(query.trim(), results);

    return new Response(
      JSON.stringify({ results, aiMessage, total: results.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error", details: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
