# Feature Q&A - Documentation

## Vue d'ensemble

La feature Q&A permet aux utilisateurs de poser des questions et de recevoir des réponses générées par LLM basées sur les articles en base de données, avec streaming en temps réel.

## Architecture

### Flow de données

```
User → POST /qa/ask → jobId → GET /qa/stream/:jobId (SSE) → tokens → done event with sources
                                                                    ↓
                                                          Display in real-time
```

### Composants

#### 1. Service (`qa.service.ts`)
- `askQuestion(question)` - Envoie la question et récupère un jobId
- `streamAnswer(jobId)` - Établit une connexion SSE pour streamer la réponse
- `getResult(jobId)` - Récupère le résultat final avec sources (fallback)
- `getHistory()` - Récupère l'historique paginé
- `deleteHistoryItem(id)` - Supprime un item de l'historique

#### 2. Composant (`qa.component.ts`)
Gère l'interface utilisateur avec :
- Formulaire de question (validation min 3 caractères)
- Affichage streaming avec effet curseur
- Liste des sources avec score de pertinence
- Historique en accordéon

#### 3. Modèles (`qa.model.ts`)
```typescript
interface QaSource {
  contentId: string;
  mediaKey: string;
  title: string;
  url: string;
  relevanceScore?: number;
  publishedAt?: string;
}

interface QaHistoryItem {
  id: string;
  question: string;
  answer: string;
  sources: QaSource[];
  createdAt: Date;
}
```

## Endpoints Backend attendus

### POST /qa/ask
**Request:**
```json
{
  "question": "Votre question"
}
```

**Response:**
```json
{
  "jobId": "uuid",
  "status": "processing",
  "createdAt": "2025-11-17T..."
}
```

### GET /qa/stream/:jobId
**Format SSE:**
```
data: {"type":"token","content":"mot"}
data: {"type":"token","content":" suivant"}
...
data: {"type":"done","sources":[...]}
```

### GET /qa/result/:jobId
**Response:**
```json
{
  "id": "uuid",
  "question": "...",
  "answer": "...",
  "sources": [...],
  "status": "completed",
  "createdAt": "...",
  "completedAt": "..."
}
```

### GET /qa/history?page=1&limit=20
**Response:**
```json
{
  "items": [...],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

### DELETE /qa/history/:id
**Response:** 204 No Content

## Format SSE

Le backend doit envoyer des événements SSE au format JSON :

```javascript
// Pour chaque token
res.write(`data: ${JSON.stringify({type:'token',content:'mot'})}\n\n`);

// À la fin avec les sources
res.write(`data: ${JSON.stringify({
  type: 'done',
  sources: [
    {
      contentId: '123',
      mediaKey: 'lemonde',
      title: 'Titre article',
      url: 'https://...',
      relevanceScore: 0.95,
      publishedAt: '2025-11-17T...'
    }
  ]
})}\n\n`);
```

## Features

✅ Streaming en temps réel avec effet typewriter
✅ Affichage du score de pertinence des sources (%)
✅ Navigation vers les articles sources
✅ Historique persisté avec pagination
✅ Gestion d'erreurs complète
✅ Loading states
✅ Responsive design
✅ Animations fluides

## Testing

Pour tester manuellement avec curl :

```bash
# 1. Poser une question
RESPONSE=$(curl -X POST https://www.athena-app.fr/qa/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Quelles sont les dernières nouvelles ?"}')

JOB_ID=$(echo $RESPONSE | jq -r .jobId)

# 2. Stream la réponse
curl -N https://www.athena-app.fr/qa/stream/$JOB_ID

# 3. Récupérer le résultat complet
curl https://www.athena-app.fr/qa/result/$JOB_ID
```

## Améliorations futures

- [ ] Markdown rendering dans les réponses
- [ ] Citations inline dans le texte
- [ ] Filtrage par source (média)
- [ ] Export des Q&A en PDF
- [ ] Partage de Q&A via URL
- [ ] Mode vocal (speech-to-text)
- [ ] Suggestions de questions
- [ ] Analytics (questions populaires)

## Configuration

L'URL de l'API est définie dans `environment.ts` :

```typescript
export const environment = {
  apiUrl: 'https://www.athena-app.fr'
};
```

## Navigation

La page Q&A est accessible :
- Via le menu principal (icône question_answer)
- URL : `/qa`
- Route lazy-loaded pour optimiser le bundle
