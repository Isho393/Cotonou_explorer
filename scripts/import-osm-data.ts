/**
 * Script to import places from OpenStreetMap (Overpass API) into Supabase
 * 
 * Coverage: Cotonou and surrounding communes (Abomey-Calavi, Sèmè-Kpodji, etc.)
 * 
 * Usage: 
 * 1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 * 2. Run: npx tsx scripts/import-osm-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env file manually
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          process.env[key.trim()] = value;
        }
      }
    });
  }
}

// Load environment variables
loadEnv();

// Bounding box for Cotonou and surrounding areas
// [south, west, north, east]
const COTONOU_BBOX = [6.2, 2.3, 6.5, 2.5];

// Category mapping from OSM tags to our standardized categories
const CATEGORY_MAPPING: Record<string, { category: string; keywords: string[] }> = {
  // Hébergement
  'hotel': { category: 'Hôtel', keywords: ['hotel', 'motel', 'guest_house', 'hostel'] },
  
  // Restauration
  'restaurant': { category: 'Restaurant', keywords: ['restaurant', 'fast_food', 'cafe', 'food_court', 'bar', 'pub'] },
  
  // Santé
  'hospital': { category: 'Hôpital', keywords: ['hospital', 'clinic', 'doctors', 'dentist'] },
  'pharmacy': { category: 'Pharmacie', keywords: ['pharmacy'] },
  
  // Finance
  'bank': { category: 'Banque', keywords: ['bank', 'atm', 'bureau_de_change'] },
  
  // Commerce
  'market': { category: 'Marché', keywords: ['marketplace', 'market'] },
  'supermarket': { category: 'Supermarché', keywords: ['supermarket', 'convenience', 'general'] },
  'shop': { category: 'Commerce', keywords: ['shop', 'mall', 'department_store'] },
  
  // Éducation
  'school': { category: 'École', keywords: ['school', 'kindergarten', 'college', 'university'] },
  
  // Transport
  'transport': { category: 'Transport', keywords: ['bus_station', 'taxi', 'ferry_terminal', 'airport', 'fuel'] },
  'fuel': { category: 'Station-service', keywords: ['fuel'] },
  
  // Services publics
  'public_service': { category: 'Service public', keywords: ['townhall', 'police', 'fire_station', 'post_office', 'embassy', 'courthouse'] },
  
  // Culte
  'worship': { category: 'Lieu de culte', keywords: ['place_of_worship'] },
  
  // Tourisme
  'tourism': { category: 'Tourisme', keywords: ['museum', 'monument', 'artwork', 'viewpoint', 'beach', 'attraction'] },
  
  // Beauté & Bien-être
  'beauty': { category: 'Beauté', keywords: ['hairdresser', 'beauty', 'spa', 'massage'] },
  
  // Immobilier
  'real_estate': { category: 'Immobilier', keywords: ['estate_agent'] },
  
  // Loisirs
  'leisure': { category: 'Loisirs', keywords: ['park', 'garden', 'sports_centre', 'stadium', 'cinema', 'theatre', 'nightclub'] },
  
  // Services professionnels
  'professional': { category: 'Service professionnel', keywords: ['lawyer', 'accountant', 'insurance', 'office'] },
};

// Build Overpass QL query
function buildOverpassQuery(): string {
  const [south, west, north, east] = COTONOU_BBOX;
  const bbox = `${south},${west},${north},${east}`;
  
  // Simplified query with most important amenities
  const amenities = [
    'restaurant', 'cafe', 'fast_food', 'bar',
    'hospital', 'clinic', 'doctors', 'pharmacy',
    'bank', 'atm',
    'marketplace', 'fuel',
    'school', 'university',
    'place_of_worship', 'townhall', 'police',
    'bus_station',
  ];
  
  const tourism = ['hotel', 'guest_house', 'museum', 'attraction'];
  const shops = ['supermarket', 'mall'];
  
  let query = `[out:json][timeout:60];\n(\n`;
  
  // Add amenity queries (nodes only for speed)
  amenities.forEach(amenity => {
    query += `  node["amenity"="${amenity}"](${bbox});\n`;
  });
  
  // Add tourism queries
  tourism.forEach(t => {
    query += `  node["tourism"="${t}"](${bbox});\n`;
  });
  
  // Add shop queries
  shops.forEach(shop => {
    query += `  node["shop"="${shop}"](${bbox});\n`;
  });
  
  query += `);\nout body;`;
  
  return query;
}

// Determine category from OSM tags
function determineCategory(tags: Record<string, string>): { category: string; subcategory: string } | null {
  const amenity = tags.amenity;
  const tourism = tags.tourism;
  const shop = tags.shop;
  const leisure = tags.leisure;
  
  for (const [key, config] of Object.entries(CATEGORY_MAPPING)) {
    if (
      (amenity && config.keywords.includes(amenity)) ||
      (tourism && config.keywords.includes(tourism)) ||
      (shop && config.keywords.includes(shop)) ||
      (leisure && config.keywords.includes(leisure))
    ) {
      return {
        category: config.category,
        subcategory: amenity || tourism || shop || leisure || 'other',
      };
    }
  }
  
  return null;
}

// Generate description based on category and tags
function generateDescription(category: string, tags: Record<string, string>): string {
  const descriptions: Record<string, string> = {
    'Hôtel': 'Établissement d\'hébergement',
    'Restaurant': 'Restaurant et restauration',
    'Hôpital': 'Établissement de santé',
    'Pharmacie': 'Pharmacie et parapharmacie',
    'Banque': 'Services bancaires',
    'Marché': 'Marché local',
    'Supermarché': 'Supermarché et épicerie',
    'École': 'Établissement d\'enseignement',
    'Transport': 'Transport et mobilité',
    'Station-service': 'Station-service',
    'Service public': 'Service public',
    'Lieu de culte': 'Lieu de culte',
    'Tourisme': 'Site touristique',
    'Beauté': 'Salon de beauté et bien-être',
    'Immobilier': 'Agence immobilière',
    'Loisirs': 'Loisirs et divertissement',
    'Service professionnel': 'Service professionnel',
    'Commerce': 'Commerce',
  };
  
  let desc = descriptions[category] || 'Lieu d\'intérêt';
  
  if (tags.description) {
    desc = tags.description;
  } else if (tags.cuisine) {
    desc += ` - Cuisine ${tags.cuisine}`;
  } else if (tags.denomination) {
    desc += ` - ${tags.denomination}`;
  }
  
  return desc;
}

// Determine city from coordinates (simplified)
function determineCity(lat: number, lng: number): string {
  // Simplified city detection based on coordinates
  // Cotonou center: ~6.3654, 2.4195
  // Abomey-Calavi: ~6.4483, 2.3556
  // Sèmè-Kpodji: ~6.3667, 2.6167
  
  if (lng < 2.38) {
    return 'Abomey-Calavi';
  } else if (lng > 2.52) {
    return 'Sèmè-Kpodji';
  } else {
    return 'Cotonou';
  }
}

// Format address from OSM tags
function formatAddress(tags: Record<string, string>, city: string, lat: number, lng: number): string {
  const parts: string[] = [];
  
  // Try structured address first
  if (tags['addr:housenumber']) {
    parts.push(tags['addr:housenumber']);
  }
  if (tags['addr:street']) {
    parts.push(tags['addr:street']);
  }
  
  // Add neighborhood/suburb/quarter
  const neighborhood = tags['addr:suburb'] || tags['addr:quarter'] || tags['addr:neighbourhood'];
  if (neighborhood) {
    parts.push(neighborhood);
  }
  
  // If no structured address, try to use nearby street or area name
  if (parts.length === 0) {
    // Use any available location hint
    if (tags['addr:place']) {
      parts.push(tags['addr:place']);
    } else if (tags['addr:city']) {
      parts.push(tags['addr:city']);
    }
  }
  
  // Always add city
  parts.push(city);
  
  // If still no meaningful address, add "Bénin" and coordinates hint
  if (parts.length <= 1) {
    parts.push('Bénin');
    // Add a simple coordinate reference for uniqueness
    const latStr = lat.toFixed(4);
    const lngStr = lng.toFixed(4);
    return `${parts.join(', ')} (${latStr}, ${lngStr})`;
  }
  
  return parts.join(', ');
}

// Fetch data from Overpass API
async function fetchFromOverpass(): Promise<any[]> {
  const query = buildOverpassQuery();
  const url = 'https://overpass-api.de/api/interpreter';
  
  console.log('🌍 Fetching data from Overpass API...');
  console.log(`📍 Bounding box: ${COTONOU_BBOX.join(', ')}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'CotonouExplorer/1.0',
    },
    body: `data=${encodeURIComponent(query)}`,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Overpass API error:', errorText);
    throw new Error(`Overpass API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log(`✅ Fetched ${data.elements.length} elements from OSM`);
  
  return data.elements;
}

// Transform OSM data to our schema
function transformOsmData(elements: any[]): any[] {
  const places: any[] = [];
  
  for (const element of elements) {
    const tags = element.tags || {};
    
    // Skip if no name
    if (!tags.name) continue;
    
    // Determine category
    const categoryInfo = determineCategory(tags);
    if (!categoryInfo) continue;
    
    // Get coordinates
    let lat: number, lng: number;
    if (element.type === 'node') {
      lat = element.lat;
      lng = element.lon;
    } else if (element.center) {
      lat = element.center.lat;
      lng = element.center.lon;
    } else {
      continue; // Skip if no coordinates
    }
    
    const city = determineCity(lat, lng);
    const address = formatAddress(tags, city, lat, lng);
    const description = generateDescription(categoryInfo.category, tags);
    
    places.push({
      osm_id: element.id,
      osm_type: element.type,
      name: tags.name,
      category: categoryInfo.category,
      subcategory: categoryInfo.subcategory,
      address,
      city,
      description,
      phone: tags.phone || tags['contact:phone'] || null,
      website: tags.website || tags['contact:website'] || null,
      opening_hours: tags.opening_hours || null,
      rating: 4.0, // Default rating
      lat,
      lng,
      tags,
    });
  }
  
  console.log(`✅ Transformed ${places.length} valid places`);
  return places;
}

// Import data into Supabase
async function importToSupabase(places: any[]) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log('📤 Importing to Supabase...');
  
  // Delete existing data
  console.log('🗑️  Clearing existing places...');
  const { error: deleteError } = await supabase.from('places').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (deleteError) {
    console.warn('Warning during delete:', deleteError.message);
  }
  
  // Insert in batches of 100
  const batchSize = 100;
  let imported = 0;
  
  for (let i = 0; i < places.length; i += batchSize) {
    const batch = places.slice(i, i + batchSize);
    const { error } = await supabase.from('places').insert(batch);
    
    if (error) {
      console.error(`❌ Error importing batch ${i / batchSize + 1}:`, error.message);
    } else {
      imported += batch.length;
      console.log(`✅ Imported batch ${i / batchSize + 1} (${imported}/${places.length})`);
    }
  }
  
  console.log(`\n🎉 Import complete! ${imported} places imported.`);
  
  // Show statistics
  const { data: stats } = await supabase
    .from('places')
    .select('category, city')
    .then(res => {
      if (!res.data) return { data: null };
      
      const byCategory: Record<string, number> = {};
      const byCity: Record<string, number> = {};
      
      res.data.forEach((place: any) => {
        byCategory[place.category] = (byCategory[place.category] || 0) + 1;
        byCity[place.city] = (byCity[place.city] || 0) + 1;
      });
      
      return { data: { byCategory, byCity } };
    });
  
  if (stats) {
    console.log('\n📊 Statistics:');
    console.log('\nBy category:');
    Object.entries(stats.byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    console.log('\nBy city:');
    Object.entries(stats.byCity).forEach(([city, count]) => {
      console.log(`  ${city}: ${count}`);
    });
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting OSM data import...\n');
    
    const elements = await fetchFromOverpass();
    const places = transformOsmData(elements);
    await importToSupabase(places);
    
    console.log('\n✅ All done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
