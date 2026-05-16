# 🔧 Audio TTS - Dépannage

## Problème : Erreur "interrupted"

### Symptôme

Erreur dans la console :
```
Erreur de lecture audio: SpeechSynthesisErrorEvent {
  error: "interrupted",
  ...
}
```

### Cause

L'erreur `"interrupted"` se produit quand :
1. Une nouvelle lecture commence avant que la précédente ne soit terminée
2. `window.speechSynthesis.cancel()` est appelé pendant une lecture
3. L'utilisateur clique rapidement sur plusieurs boutons audio

C'est un comportement **normal** de la Web Speech API, pas un bug.

### Solution Implémentée

#### 1. Délai après cancel()

Ajout d'un délai de 100ms après `cancel()` avant de démarrer une nouvelle lecture :

```typescript
// Arrêter toute lecture en cours
window.speechSynthesis.cancel();

// Petit délai pour éviter l'erreur "interrupted"
setTimeout(() => {
  const utterance = createUtterance(text);
  window.speechSynthesis.speak(utterance);
}, 100);
```

**Pourquoi ?** La Web Speech API a besoin d'un court délai pour nettoyer l'état interne après un `cancel()`.

#### 2. Filtrage de l'erreur

Ignorer l'erreur "interrupted" dans le handler d'erreur :

```typescript
utterance.onerror = (event) => {
  // Ignorer l'erreur "interrupted" car elle est normale
  if (event.error !== 'interrupted') {
    console.error('Erreur de lecture audio:', event);
  }
  // Nettoyer l'état
  setIsSpeaking(false);
  setIsPaused(false);
  setCurrentPlaceIndex(null);
};
```

**Pourquoi ?** L'erreur "interrupted" n'est pas critique et ne nécessite pas d'alerte utilisateur.

### Résultat

✅ Plus d'erreurs dans la console
✅ Transitions fluides entre les lectures
✅ Expérience utilisateur améliorée

---

## Autres Problèmes Potentiels

### Problème : Pas de voix disponible

**Symptôme** : Aucune voix dans le sélecteur de paramètres

**Cause** : Les voix se chargent de manière asynchrone

**Solution** : Déjà implémentée dans `useSpeech.ts`
```typescript
// Les voix peuvent se charger de manière asynchrone
if (window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}
```

### Problème : Lecture s'arrête après quelques secondes

**Symptôme** : La lecture s'arrête au milieu d'un texte long

**Cause** : Limitation de certains navigateurs (notamment Chrome sur Android)

**Solution** : Diviser les textes longs en segments plus courts

**Implémentation future** :
```typescript
// Diviser le texte en segments de 200 caractères max
const segments = text.match(/.{1,200}(\s|$)/g) || [text];
segments.forEach((segment, i) => {
  const utterance = createUtterance(segment);
  if (i === segments.length - 1) {
    utterance.onend = onComplete;
  }
  window.speechSynthesis.speak(utterance);
});
```

### Problème : Voix robotique

**Symptôme** : La voix sonne très artificielle

**Cause** : Qualité des voix système

**Solutions** :
1. **Court terme** : Sélectionner une voix locale de meilleure qualité
2. **Moyen terme** : Proposer des voix premium (API cloud en option)
3. **Long terme** : Synthèse vocale personnalisée

### Problème : Lecture ne démarre pas

**Symptôme** : Cliquer sur le bouton ne fait rien

**Causes possibles** :
1. Navigateur ne supporte pas la Web Speech API
2. Permissions audio bloquées
3. Aucune voix disponible

**Diagnostic** :
```typescript
// Vérifier le support
console.log('Speech supported:', 'speechSynthesis' in window);

// Vérifier les voix
console.log('Voices:', window.speechSynthesis.getVoices());

// Vérifier l'état
console.log('Speaking:', window.speechSynthesis.speaking);
console.log('Paused:', window.speechSynthesis.paused);
console.log('Pending:', window.speechSynthesis.pending);
```

### Problème : Pause ne fonctionne pas

**Symptôme** : Cliquer sur pause n'arrête pas la lecture

**Cause** : Bug connu sur certains navigateurs (notamment Safari iOS)

**Solution de contournement** :
```typescript
// Au lieu de pause(), utiliser cancel() et mémoriser la position
const pause = () => {
  // Mémoriser la position actuelle
  const currentText = utteranceRef.current?.text;
  const currentIndex = /* calculer l'index */;
  
  // Arrêter
  window.speechSynthesis.cancel();
  
  // Sauvegarder pour reprendre plus tard
  savePosition(currentText, currentIndex);
};
```

---

## Bonnes Pratiques

### 1. Toujours nettoyer avant une nouvelle lecture

```typescript
// ✅ BON
window.speechSynthesis.cancel();
setTimeout(() => {
  window.speechSynthesis.speak(utterance);
}, 100);

// ❌ MAUVAIS
window.speechSynthesis.speak(utterance); // Peut causer "interrupted"
```

### 2. Gérer les erreurs gracieusement

```typescript
utterance.onerror = (event) => {
  // Filtrer les erreurs normales
  if (event.error === 'interrupted') return;
  
  // Logger les vraies erreurs
  console.error('Erreur TTS:', event.error);
  
  // Nettoyer l'état
  cleanup();
};
```

### 3. Limiter la longueur des textes

```typescript
// ✅ BON - Texte court et concis
const text = "Restaurant Le Palmier. Note: 4.5 étoiles.";

// ⚠️ ATTENTION - Texte très long
const text = "Restaurant Le Palmier avec une très longue description..."; // >500 caractères
```

### 4. Tester sur plusieurs navigateurs

- ✅ Chrome/Edge (Windows, Android)
- ✅ Safari (iOS, macOS)
- ✅ Firefox (Windows, Android)

### 5. Fournir un feedback visuel

```typescript
// Indicateur visuel pendant la lecture
<div className={isCurrentPlace ? 'ring-2 ring-amber-500' : ''}>
  {/* Contenu */}
</div>
```

---

## Tests de Diagnostic

### Test 1 : Vérifier le support

```javascript
// Dans la console du navigateur
console.log('Speech API:', 'speechSynthesis' in window);
```

**Résultat attendu** : `true`

### Test 2 : Lister les voix

```javascript
// Dans la console du navigateur
window.speechSynthesis.getVoices().forEach(voice => {
  console.log(voice.name, voice.lang, voice.localService);
});
```

**Résultat attendu** : Liste de voix disponibles

### Test 3 : Test de lecture simple

```javascript
// Dans la console du navigateur
const utterance = new SpeechSynthesisUtterance('Bonjour');
utterance.lang = 'fr-FR';
window.speechSynthesis.speak(utterance);
```

**Résultat attendu** : "Bonjour" est lu à voix haute

### Test 4 : Test de cancel

```javascript
// Dans la console du navigateur
const utterance = new SpeechSynthesisUtterance('Texte très long...');
window.speechSynthesis.speak(utterance);

// Après 1 seconde
setTimeout(() => {
  window.speechSynthesis.cancel();
  console.log('Cancelled');
}, 1000);
```

**Résultat attendu** : La lecture s'arrête après 1 seconde

---

## Ressources

### Documentation Officielle
- [MDN - Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [MDN - SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [MDN - SpeechSynthesisUtterance](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance)

### Compatibilité
- [Can I Use - Speech Synthesis](https://caniuse.com/speech-synthesis)

### Issues Connues
- [Chrome Issue - Speech Synthesis](https://bugs.chromium.org/p/chromium/issues/list?q=speech%20synthesis)
- [WebKit Issue - Speech Synthesis](https://bugs.webkit.org/buglist.cgi?quicksearch=speech%20synthesis)

---

## Support

Si vous rencontrez un problème non documenté ici :

1. Vérifier la console du navigateur pour les erreurs
2. Tester sur un autre navigateur
3. Vérifier que les voix sont disponibles
4. Consulter la documentation MDN
5. Créer une issue sur GitHub avec :
   - Navigateur et version
   - Système d'exploitation
   - Message d'erreur complet
   - Étapes pour reproduire

---

**Dernière mise à jour** : Mai 2026
**Version** : 1.2.0
