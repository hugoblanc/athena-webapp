# Module Propositions de Loi - Spécifications Frontend

## 🎯 Objectif

Créer un explorateur de propositions de loi accessible au grand public, avec une approche **"Simplicité d'abord"** : la version simplifiée générée par IA est toujours affichée en priorité, avec possibilité d'accéder aux détails juridiques.

---

## 📱 Features à Implémenter

### 1. Page de Listing (Feed)

**Route :** `/propositions`

**Fonctionnalités :**
- **Liste paginée** de toutes les propositions de loi avec version simplifiée
- **Cards visuelles** affichant :
  - Badge coloré du groupe politique (RN, LFI_NFP, SOC, etc.)
  - Photo et nom de l'auteur principal
  - Titre de la proposition
  - 3-4 points clés (keyPoints) pour aperçu rapide
  - Date de mise en ligne
  - Badge de statut (simplifié/en attente)

- **Filtres :**
  - Par groupe politique (multi-sélection avec couleurs)
  - Par période (date picker)
  - Par type de proposition (ordinaire/constitutionnelle)
  - Afficher uniquement les propositions simplifiées

- **Tri :**
  - Par date (plus récentes en premier par défaut)
  - Par groupe politique (alphabétique)
  - Par popularité (si metrics disponibles plus tard)

- **Pagination :**
  - 20 propositions par page
  - Infinite scroll OU pagination classique (à définir)

### 2. Page de Détail

**Route :** `/propositions/:numero`

**Fonctionnalités :**
- **Onglets de navigation :**
  - **"Résumé"** (par défaut) : Version simplifiée IA
  - **"Articles officiels"** : Texte juridique complet
  - **"PDF"** : Lien vers le document original

- **Vue "Résumé" (principale) :**
  - En-tête avec métadonnées :
    - Numéro de proposition
    - Titre complet
    - Type (ordinaire/constitutionnelle)
    - Auteur + photo + groupe politique
    - Co-signataires (liste repliable si > 5)
    - Date de dépôt et mise en ligne

  - Section "EXPOSÉ DES MOTIFS" :
    - Liste des sections avec titres (ex: "Importance de la natation")
    - Texte simplifié pour chaque section
    - Design aéré avec icônes

  - Section "ARTICLES" :
    - Liste numérotée (Article 1, Article 2, etc.)
    - Résumé de chaque article en langage simple
    - Design en cards/accordéon

- **Vue "Articles officiels" :**
  - Affichage du contenu juridique brut
  - Sections complètes non simplifiées
  - Articles détaillés avec références légales
  - Amendements associés

- **Actions :**
  - Bouton "Partager" (lien, réseaux sociaux)
  - Bouton "Télécharger PDF" (lien externe AN)
  - Bouton "Voir le dossier législatif" (lien externe AN)

### 3. États de Chargement et Erreurs

- **Loading states** : Skeletons pour les cards et la page de détail
- **Empty states** : Message si aucune proposition ne correspond aux filtres
- **Error states** : Gestion des erreurs API avec retry
- **Status badges** : Différencier visuellement les propositions simplifiées vs en attente

---

## 🎯 Principe Directeur : "Version Simplifiée First"

### Hiérarchie de l'information recommandée

**Niveau 1 - Feed (Vue liste) :**
```
┌─────────────────────────────────────────────┐
│ 🟣 GDR  │  Proposition n°2111          │
│ Mme Soumya Bourouaha + 8 co-signataires   │
│ ─────────────────────────────────────────  │
│ Garantir l'accès à l'apprentissage        │
│ de la natation                            │
│                                           │
│ 💡 En résumé :                            │
│ • 500 000 élèves sans accès à une piscine │
│ • Hausse des noyades avec le climat       │
│ • Construction de piscines financée par   │
│   taxes d'aménagement                     │
│ ─────────────────────────────────────────  │
│ [Lire le résumé complet →] 📅 20/11/2025  │
└─────────────────────────────────────────────┘
```

**Niveau 2 - Page détaillée (par défaut : vue simplifiée) :**
```
┌─────────────────────────────────────────────┐
│  Proposition n°2111                        │
│  [● Résumé] [ Articles] [ PDF]             │
│ ─────────────────────────────────────────  │
│                                           │
│  📋 EXPOSÉ DES MOTIFS                     │
│                                           │
│  • Importance de la natation              │
│    Savoir nager est essentiel pour la    │
│    sécurité et l'intégration sociale...   │
│                                           │
│  • Inégalités d'accès                     │
│    15 % des écoles sans piscine,          │
│    500 000 élèves touchés...              │
│                                           │
│  • Risques accrus                         │
│    Hausse des noyades avec les canicules..│
│                                           │
│  📜 ARTICLES (résumés)                    │
│                                           │
│  1. Article 1 : Augmente taxes            │
│     d'aménagement pour financer...        │
│                                           │
│  2. Article 2 : Modifie le taux...        │
│                                           │
│  [... 500-800 mots au total ...]          │
│                                           │
│  [Voir la version officielle complète →]  │
└─────────────────────────────────────────────┘
```

**Niveau 3 - Version officielle (onglet "Articles") :**
Sections complètes, articles juridiques non simplifiés, amendements.

### Bénéfices UX de cette approche

1. **Accessibilité** : Langage simple compréhensible par tous
2. **Rapidité** : Comprendre l'essentiel en 30 secondes
3. **Engagement** : Réduction du taux de rebond sur contenu complexe
4. **Progressive disclosure** : Détails techniques cachés par défaut
5. **Viralité** : Version simplifiée partageable sur réseaux sociaux

### Recommandations techniques backend

**Champs prioritaires dans l'API :**
- `simplifiedVersion` : Objet structuré avec exposé + articles simplifiés - **OBLIGATOIRE**
- `simplifiedVersion.keyPoints` : Array de 3-4 points clés pour preview - **OBLIGATOIRE**
- `simplifiedVersion.exposeMotifs` : Array de sections avec titre + texte - **OBLIGATOIRE**
- `simplifiedVersion.articles` : Array d'articles résumés - **OBLIGATOIRE**
- `simplificationStatus` : "completed" uniquement en production

**Format JSON souhaité :**
```json
{
  "numero": "2111",
  "titre": "Garantir l'accès à l'apprentissage de la natation",
  "typeProposition": "ordinaire",
  "dateMiseEnLigne": "2025-11-20T00:00:00.000Z",
  "auteur": {
    "nom": "Mme Soumya Bourouaha",
    "groupePolitique": "Gauche Démocrate et Républicaine",
    "groupePolitiqueCode": "GDR"
  },
  "coSignataires": [ /* ... */ ],
  "simplified": {
    "status": "completed",
    "generatedAt": "2025-11-21T10:30:00.000Z",
    "keyPoints": [
      "500 000 élèves sans accès à une piscine",
      "51% des élèves de Seine-Saint-Denis ne savent pas nager",
      "Hausse des noyades avec les épisodes caniculaires",
      "Financement par taxes d'aménagement et taxe tabac"
    ],
    "exposeMotifs": [
      {
        "titre": "Importance de la natation",
        "texte": "Savoir nager est essentiel pour la sécurité et l'intégration sociale. Actuellement, de nombreux élèves ne peuvent pas accéder à des cours de natation à cause du manque d'infrastructures."
      },
      {
        "titre": "Inégalités d'accès",
        "texte": "En France, 15 % des écoles n'ont pas accès à une piscine, ce qui touche environ 500 000 élèves. Des régions comme la Seine-Saint-Denis manquent cruellement de piscines, entraînant un taux alarmant d'enfants qui ne savent pas nager (51 % à la fin de la sixième)."
      },
      {
        "titre": "Risques accrus",
        "texte": "Avec l'augmentation des épisodes caniculaires, ne pas savoir nager expose les enfants à des dangers. Les noyades sont en hausse, soulignant l'urgence d'une politique nationale pour remédier à cette situation."
      },
      {
        "titre": "Objectif de la loi",
        "texte": "Garantir l'apprentissage de la natation à tous les enfants, peu importe leur lieu de vie, en construisant de nouvelles piscines et en rénovant les infrastructures existantes."
      }
    ],
    "articles": [
      {
        "numero": "Article 1",
        "resume": "Augmente le taux de certaines taxes d'aménagement pour financer la construction et la rénovation de piscines."
      },
      {
        "numero": "Article 2",
        "resume": "Modifie le taux d'une taxe d'aménagement pour les piscines."
      },
      {
        "numero": "Article 3",
        "resume": "Exclut de la taxe d'aménagement les petites piscines (≤ 5 m²)."
      },
      {
        "numero": "Article 4",
        "resume": "Crée un Observatoire national pour évaluer l'accès à l'apprentissage de la natation et les besoins en infrastructure."
      },
      {
        "numero": "Article 5",
        "resume": "Compense les coûts pour l'État par une nouvelle taxe sur les tabacs."
      }
    ]
  },
  "official": {
    "sections": [ /* sections complètes non simplifiées */ ],
    "urlDocument": "https://www.assemblee-nationale.fr/...",
    "urlDossierLegislatif": "https://www.assemblee-nationale.fr/dyn/17/dossiers/..."
  }
}
```

---

## 🔌 Besoins API Backend (Cahier des Charges)

### Endpoint 1 : Liste des propositions avec pagination

**`GET /api/law-proposals`**

**Query parameters :**
```
- page (integer, défaut: 1) : Numéro de page
- limit (integer, défaut: 20, max: 100) : Éléments par page
- sort (string, défaut: "dateMiseEnLigne:desc") : Tri (format: "champ:ordre")
  - Valeurs possibles : "dateMiseEnLigne:asc|desc", "titre:asc|desc", "numero:asc|desc"
- filter[groupePolitique] (string, optionnel) : Code du groupe (ex: "RN,LFI_NFP")
- filter[typeProposition] (string, optionnel) : "ordinaire" ou "constitutionnelle"
- filter[dateDebut] (date, optionnel) : Format ISO 8601
- filter[dateFin] (date, optionnel) : Format ISO 8601
- filter[simplificationStatus] (string, optionnel) : "completed" ou "pending" ou "failed"
- include (string, défaut: "simplified,auteur") : Relations à inclure
```

**Réponse attendue :**
```json
{
  "data": [
    {
      "numero": "2111",
      "titre": "Garantir l'accès à l'apprentissage de la natation",
      "typeProposition": "ordinaire",
      "dateMiseEnLigne": "2025-11-20T00:00:00.000Z",
      "dateDepot": "2025-11-19T00:00:00.000Z",
      "auteur": {
        "nom": "Mme Soumya Bourouaha",
        "groupePolitique": "Gauche Démocrate et Républicaine",
        "groupePolitiqueCode": "GDR",
        "photoUrl": "https://www.assemblee-nationale.fr/...",
        "urlDepute": "https://www.assemblee-nationale.fr/..."
      },
      "coSignatairesCount": 8,
      "simplified": {
        "status": "completed",
        "keyPoints": [
          "500 000 élèves sans accès à une piscine",
          "51% des élèves de Seine-Saint-Denis ne savent pas nager",
          "Hausse des noyades avec les épisodes caniculaires",
          "Financement par taxes d'aménagement et taxe tabac"
        ]
      }
    }
    // ... autres propositions
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Contraintes :**
- ✅ **OBLIGATOIRE** : Le champ `simplified.keyPoints` doit être présent pour chaque proposition avec `simplificationStatus: "completed"`
- ✅ **OBLIGATOIRE** : Le champ `auteur` doit toujours être inclus (pas de relation nullable)
- ✅ **Performance** : Temps de réponse < 500ms pour 20 éléments
- ✅ **Cache** : TTL de 5 minutes recommandé (données peu volatiles)

---

### Endpoint 2 : Détail d'une proposition complète

**`GET /api/law-proposals/:numero`**

**Path parameters :**
```
- numero (string, requis) : Numéro de la proposition (ex: "2111")
```

**Query parameters :**
```
- include (string, défaut: "simplified,auteur,coSignataires,sections,amendements")
```

**Réponse attendue (VERSION COMPLÈTE) :**
```json
{
  "numero": "2111",
  "titre": "Garantir l'accès à l'apprentissage de la natation",
  "typeProposition": "ordinaire",
  "legislature": "17",
  "dateMiseEnLigne": "2025-11-20T00:00:00.000Z",
  "dateDepot": "2025-11-19T00:00:00.000Z",
  "description": "Proposition de loi...",
  "urlDocument": "https://www.assemblee-nationale.fr/dyn/17/textes/l17b2111_proposition-loi",
  "urlDossierLegislatif": "https://www.assemblee-nationale.fr/dyn/17/dossiers/...",

  "auteur": {
    "nom": "Mme Soumya Bourouaha",
    "groupePolitique": "Gauche Démocrate et Républicaine",
    "groupePolitiqueCode": "GDR",
    "photoUrl": "https://www.assemblee-nationale.fr/...",
    "urlDepute": "https://www.assemblee-nationale.fr/..."
  },

  "coSignataires": [
    {
      "nom": "M. Jean Dupont",
      "groupePolitique": "Gauche Démocrate et Républicaine",
      "groupePolitiqueCode": "GDR",
      "photoUrl": "https://...",
      "urlDepute": "https://..."
    }
    // ... autres co-signataires
  ],

  "simplified": {
    "status": "completed",
    "generatedAt": "2025-11-21T10:30:00.000Z",
    "keyPoints": [
      "500 000 élèves sans accès à une piscine",
      "51% des élèves de Seine-Saint-Denis ne savent pas nager",
      "Hausse des noyades avec les épisodes caniculaires",
      "Financement par taxes d'aménagement et taxe tabac"
    ],
    "exposeMotifs": [
      {
        "ordre": 1,
        "titre": "Importance de la natation",
        "texte": "Savoir nager est essentiel pour la sécurité et l'intégration sociale. Actuellement, de nombreux élèves ne peuvent pas accéder à des cours de natation à cause du manque d'infrastructures."
      },
      {
        "ordre": 2,
        "titre": "Inégalités d'accès",
        "texte": "En France, 15 % des écoles n'ont pas accès à une piscine, ce qui touche environ 500 000 élèves..."
      }
      // ... autres sections
    ],
    "articles": [
      {
        "ordre": 1,
        "numero": "Article 1",
        "resume": "Augmente le taux de certaines taxes d'aménagement pour financer la construction et la rénovation de piscines."
      }
      // ... autres articles
    ]
  },

  "sections": [
    {
      "type": "expose_motifs",
      "titre": "EXPOSÉ DES MOTIFS",
      "texte": "Mesdames, Messieurs, la natation...",
      "articles": []
    },
    {
      "type": "articles",
      "titre": "ARTICLES",
      "texte": "",
      "articles": [
        {
          "numero": "Article 1er",
          "titre": null,
          "texte": "Le code général des impôts est ainsi modifié..."
        }
        // ... articles complets
      ]
    }
  ],

  "amendements": [
    {
      "numero": "AM001",
      "date": "2025-11-22T00:00:00.000Z",
      "auteur": "M. Pierre Durand",
      "statut": "En discussion",
      "url": "https://www.assemblee-nationale.fr/..."
    }
  ]
}
```

**Contraintes :**
- ✅ **OBLIGATOIRE** : Toutes les relations doivent être incluses par défaut
- ✅ **OBLIGATOIRE** : Le champ `simplified` doit être structuré comme spécifié
- ✅ **OBLIGATOIRE** : Les arrays `exposeMotifs` et `articles` doivent avoir un champ `ordre` pour préserver l'ordre
- ✅ **Performance** : Temps de réponse < 1000ms
- ✅ **Cache** : TTL de 1 heure recommandé

---

## 📊 Structure `simplified` - Spécifications Détaillées

### Génération par IA

Le backend est responsable de générer la version simplifiée via IA. Voici les spécifications attendues :

**`simplified.keyPoints` (Array de strings) :**
- 3 à 4 points clés maximum
- Chaque point : 50-100 caractères
- Langage simple, sans jargon juridique
- Faits concrets et chiffrés si possible
- **Exemple :** "500 000 élèves sans accès à une piscine"

**`simplified.exposeMotifs` (Array d'objets) :**
- Chaque objet : `{ ordre: number, titre: string, texte: string }`
- 3 à 5 sections maximum
- Titres courts (2-5 mots)
- Texte : 100-200 mots par section
- Vulgarisation des concepts juridiques
- **Ordre** : Préserve la logique de l'exposé original

**`simplified.articles` (Array d'objets) :**
- Chaque objet : `{ ordre: number, numero: string, resume: string }`
- Tous les articles doivent être résumés
- Résumé : 30-80 mots par article
- Langage accessible (éviter "modifie l'article L.123-4", préférer "augmente les taxes")
- **Ordre** : Préserve l'ordre des articles originaux

### Statuts de Simplification

**`simplified.status` :**
- `"completed"` : Version simplifiée disponible (seule à afficher en prod)
- `"pending"` : En cours de génération
- `"failed"` : Échec de génération (ne pas afficher en front)

---

## ✅ Checklist de Validation Backend

Avant de livrer l'API, vérifier :

- [ ] **Endpoint `/api/law-proposals`** :
  - [ ] Pagination fonctionnelle (page, limit, total)
  - [ ] Filtres par groupe politique, type, dates
  - [ ] Tri par date, titre, numéro
  - [ ] Champ `simplified.keyPoints` présent pour chaque item avec status "completed"
  - [ ] Temps de réponse < 500ms pour 20 items

- [ ] **Endpoint `/api/law-proposals/:numero`** :
  - [ ] Toutes les relations incluses (auteur, coSignataires, sections, amendements)
  - [ ] Structure `simplified` complète avec exposeMotifs et articles
  - [ ] Champs `ordre` présents pour préserver l'ordre
  - [ ] Temps de réponse < 1000ms

- [ ] **Structure `simplified` :**
  - [ ] Génération IA fonctionnelle pour toutes les propositions
  - [ ] keyPoints : 3-4 points de 50-100 chars
  - [ ] exposeMotifs : 3-5 sections avec titre + texte (100-200 mots)
  - [ ] articles : tous les articles résumés (30-80 mots)
  - [ ] Status `completed` uniquement pour versions validées

- [ ] **Performance et Cache :**
  - [ ] Cache Redis activé avec TTL appropriés
  - [ ] Indices DB sur les champs filtrés/triés
  - [ ] Pagination optimisée (count séparé du SELECT)

- [ ] **CORS et Sécurité :**
  - [ ] CORS activé pour le domaine frontend
  - [ ] Rate limiting configuré (100 req/min par IP)
  - [ ] Validation des query parameters
  - [ ] Gestion des erreurs (400, 404, 500) avec messages clairs

---

## 📝 Notes pour le Frontend

**Ce que le frontend doit faire avec ces données :**

1. **Feed (listing) :**
   - Afficher uniquement `simplified.keyPoints` dans les cards
   - Badge coloré basé sur `auteur.groupePolitiqueCode`
   - Photo de l'auteur depuis `auteur.photoUrl`
   - Filtrer visuellement selon `simplified.status`

2. **Page détail (onglet Résumé) :**
   - Afficher `simplified.exposeMotifs` dans l'ordre (`ordre` ASC)
   - Afficher `simplified.articles` dans l'ordre (`ordre` ASC)
   - Design avec sections titrées et texte aéré

3. **Page détail (onglet Articles officiels) :**
   - Afficher `sections` de type "articles"
   - Afficher les `articles` complets avec texte juridique
   - Afficher les `amendements` si disponibles

4. **Liens externes :**
   - Bouton PDF → `urlDocument`
   - Bouton Dossier législatif → `urlDossierLegislatif`
   - Lien auteur → `auteur.urlDepute`
