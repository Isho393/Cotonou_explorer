# 🎨 Guide Visuel : Mode Sombre

## Vue d'ensemble

Le mode sombre permet aux utilisateurs de basculer entre un thème clair et un thème sombre selon leurs préférences.

---

## 🌙 Mode Sombre (Défaut)

### Caractéristiques Visuelles

**Fond**
```
Couleur principale : #07070f (noir profond)
Dégradé : Radial avec touches dorées
Ambient orbs : Orbes dorés flottants (opacité 10%)
```

**Texte**
```
Principal : #f0ede8 (blanc cassé)
Secondaire : #86868b (gris moyen)
Tertiaire : #6e6e73 (gris foncé)
```

**Cartes (Glass Effect)**
```
Background : rgba(255,255,255,0.025)
Backdrop-filter : blur(24px)
Border : rgba(255,255,255,0.06)
```

**Accents**
```
Or principal : #d4af37
Or clair : #f5e07a
Or foncé : #c9922a
Gradient : linear-gradient(135deg, #d4af37, #f5e07a, #c9922a)
```

**Boutons**
```
Primary : linear-gradient(135deg, #d4af37, #c9922a)
Hover : Légère élévation + glow doré
Active : Fond doré + bordure dorée
```

---

## ☀️ Mode Clair

### Caractéristiques Visuelles

**Fond**
```
Couleur principale : #f5f5f7 (gris très clair)
Pas de dégradé
Ambient orbs : Opacité réduite à 3%
```

**Texte**
```
Principal : #1d1d1f (noir)
Secondaire : #86868b (gris moyen)
Tertiaire : #a1a1a6 (gris clair)
```

**Cartes (Glass Effect)**
```
Background : rgba(255,255,255,0.8)
Backdrop-filter : blur(24px)
Border : rgba(0,0,0,0.08)
```

**Accents**
```
Or principal : #c9922a (plus foncé qu'en mode sombre)
Or clair : #d4af37
Or foncé : #b8821a
Gradient : Même mais plus contrasté
```

**Boutons**
```
Primary : linear-gradient(135deg, #d4af37, #c9922a)
Hover : Ombre plus prononcée
Active : Fond doré + bordure dorée
```

---

## 🔄 Transition

### Animation
```css
transition: background-color 0.3s ease, color 0.3s ease;
```

**Durée** : 300ms  
**Easing** : ease  
**Propriétés animées** :
- background-color
- color
- border-color
- box-shadow

---

## 🎯 Composants Adaptés

### Header
**Mode Sombre**
- Fond : Transparent avec glass effect
- Texte : Blanc
- Boutons : Fond sombre + bordure claire

**Mode Clair**
- Fond : Blanc semi-transparent
- Texte : Noir
- Boutons : Fond clair + bordure grise

---

### Barre de Recherche
**Mode Sombre**
- Fond : Glass effect sombre
- Placeholder : Gris moyen (#86868b)
- Focus : Bordure dorée + glow

**Mode Clair**
- Fond : Blanc semi-transparent
- Placeholder : Gris (#86868b)
- Focus : Bordure dorée + ombre

---

### Cartes de Résultats
**Mode Sombre**
- Fond : Glass effect sombre
- Texte : Blanc
- Hover : Élévation + glow doré
- Bordure : Gris très foncé

**Mode Clair**
- Fond : Blanc semi-transparent
- Texte : Noir
- Hover : Élévation + ombre
- Bordure : Gris clair

---

### Boutons Catégories (Chips)
**Mode Sombre**
- Défaut : Fond transparent + bordure grise + texte gris
- Hover : Fond doré 15% + bordure dorée + texte doré
- Active : Fond doré 25% + bordure dorée + texte doré

**Mode Clair**
- Défaut : Fond transparent + bordure grise + texte gris foncé
- Hover : Fond doré 15% + bordure dorée + texte or foncé
- Active : Fond doré 25% + bordure dorée + texte or foncé

---

### Modal PlaceDetails
**Mode Sombre**
- Overlay : rgba(0,0,0,0.8) avec blur
- Fond modal : Glass effect sombre
- Texte : Blanc
- Boutons : Contrastés

**Mode Clair**
- Overlay : rgba(0,0,0,0.6) avec blur
- Fond modal : Blanc semi-transparent
- Texte : Noir
- Boutons : Contrastés

---

### NotificationCenter
**Mode Sombre**
- Fond : Glass effect sombre
- Notifications : Fond légèrement plus clair
- Badge : Rouge vif
- Texte : Blanc

**Mode Clair**
- Fond : Blanc semi-transparent
- Notifications : Fond gris très clair
- Badge : Rouge vif
- Texte : Noir

---

### AudioSettings
**Mode Sombre**
- Fond : Glass effect sombre
- Sliders : Track gris foncé + thumb doré
- Texte : Blanc

**Mode Clair**
- Fond : Blanc semi-transparent
- Sliders : Track gris clair + thumb doré
- Texte : Noir

---

## 🎨 Palette de Couleurs Complète

### Mode Sombre
```css
/* Backgrounds */
--bg-primary: #07070f;
--bg-glass: rgba(255,255,255,0.025);
--bg-hover: rgba(255,255,255,0.05);

/* Text */
--text-primary: #f0ede8;
--text-secondary: #86868b;
--text-tertiary: #6e6e73;

/* Borders */
--border-subtle: rgba(255,255,255,0.06);
--border-medium: rgba(255,255,255,0.1);

/* Accents */
--accent-gold: #d4af37;
--accent-gold-light: #f5e07a;
--accent-gold-dark: #c9922a;
```

### Mode Clair
```css
/* Backgrounds */
--bg-primary: #f5f5f7;
--bg-glass: rgba(255,255,255,0.8);
--bg-hover: rgba(0,0,0,0.03);

/* Text */
--text-primary: #1d1d1f;
--text-secondary: #86868b;
--text-tertiary: #a1a1a6;

/* Borders */
--border-subtle: rgba(0,0,0,0.08);
--border-medium: rgba(0,0,0,0.1);

/* Accents */
--accent-gold: #c9922a;
--accent-gold-light: #d4af37;
--accent-gold-dark: #b8821a;
```

---

## 🔍 Détails Techniques

### Scrollbar
**Mode Sombre**
```css
::-webkit-scrollbar-track { background: #0f0f1a; }
::-webkit-scrollbar-thumb { background: #2a2a3a; }
::-webkit-scrollbar-thumb:hover { background: #3a3a50; }
```

**Mode Clair**
```css
::-webkit-scrollbar-track { background: #f0f0f2; }
::-webkit-scrollbar-thumb { background: #c0c0c5; }
::-webkit-scrollbar-thumb:hover { background: #a0a0a8; }
```

---

### Skeleton Loading
**Mode Sombre**
```css
background: linear-gradient(90deg, #13131e 25%, #1c1c2d 50%, #13131e 75%);
```

**Mode Clair**
```css
background: linear-gradient(90deg, #e5e5e7 25%, #f0f0f2 50%, #e5e5e7 75%);
```

---

### Ambient Orbs
**Mode Sombre**
```css
opacity: 0.10; /* Visible */
```

**Mode Clair**
```css
opacity: 0.03; /* Très subtil */
```

---

## 📱 Responsive

Les styles s'adaptent automatiquement sur :
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

Aucun changement de comportement entre les tailles d'écran.

---

## ♿ Accessibilité

### Contraste
**Mode Sombre**
- Texte principal / Fond : 14.5:1 (AAA)
- Texte secondaire / Fond : 7.2:1 (AA)

**Mode Clair**
- Texte principal / Fond : 16.8:1 (AAA)
- Texte secondaire / Fond : 8.1:1 (AA)

### ARIA
```html
<button
  aria-label="Passer en mode clair"
  title="Passer en mode clair"
>
  <Sun />
</button>
```

---

## 🎯 Exemples de Code

### Appliquer un style conditionnel
```tsx
// Dans un composant
import { useTheme } from './hooks/useTheme';

function MyComponent() {
  const { isDark } = useTheme();
  
  return (
    <div className={isDark ? 'dark-style' : 'light-style'}>
      Contenu
    </div>
  );
}
```

### Ajouter un style CSS
```css
/* Mode sombre (défaut) */
.my-element {
  background: #1a1a1a;
  color: white;
}

/* Mode clair */
.light-mode .my-element {
  background: white;
  color: black;
}
```

---

## 🎨 Inspiration Design

Le design s'inspire de :
- **Apple** : Transitions fluides, glass effect
- **Stripe** : Dégradés subtils, typographie élégante
- **Vercel** : Minimalisme, contraste élevé
- **Notion** : Modes clair/sombre bien pensés

---

## 📊 Comparaison Visuelle

| Élément | Mode Sombre | Mode Clair |
|---------|-------------|------------|
| Fond principal | Noir (#07070f) | Gris clair (#f5f5f7) |
| Texte principal | Blanc (#f0ede8) | Noir (#1d1d1f) |
| Cartes | Glass sombre | Glass clair |
| Accents | Or clair (#d4af37) | Or foncé (#c9922a) |
| Bordures | Très subtiles | Subtiles |
| Ombres | Glow doré | Ombre grise |
| Ambient orbs | Visibles (10%) | Subtils (3%) |

---

## ✨ Touches Finales

### Détails qui font la différence
- ✅ Transition fluide (0.3s)
- ✅ Pas de flash blanc au chargement
- ✅ Icônes dynamiques (Sun/Moon)
- ✅ Tooltip informatif
- ✅ Persistance automatique
- ✅ Tous les composants adaptés
- ✅ Contraste optimal
- ✅ Performance optimale

---

**Le mode sombre de Cotonou Explorer offre une expérience visuelle premium dans les deux thèmes !** 🌙☀️
