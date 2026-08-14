# vue-watches : Exercice Vue 3 + TypeScript

E-commerce de montres de luxe (frontend). Compléter le code pour faire passer **toute** la suite de tests Vitest.

API consommée : voir [`./API.md`](./API.md). Le frontend marche avec n'importe lequel des trois backends (`spring-watches`, `nest-watches`, `django-watches`).

## Prérequis

- Node 20+
- npm 9+

## Installation et tests

```bash
npm install
npm test
```

Pour lancer l'app dans le navigateur (avec un backend qui tourne sur `localhost:8080`) :

```bash
npm run dev
```

Le serveur Vite écoute sur `http://localhost:5174` (port différent de `react-watches`
sur 5173 pour permettre les deux en simultané).

Pour pointer un autre backend (NestJS sur `:3000`, Django sur `:8000`) :

```bash
VITE_API_URL=http://localhost:3000/api npm run dev
```

## À compléter

Six fichiers à toucher, regroupés par feature :

**Feature 1 : Catalogue** (~35 min)

1. **`src/utils/price.ts`** : `formatPriceEur` et `calculateCartTotal`. ~10 min.
2. **`src/composables/useWatches.ts`** : composable qui charge les montres depuis l'API et expose `loading` / `error` / `reload`. ~15 min.
3. **`src/components/WatchCard.vue`** : composant qui affiche une montre. ~10 min.

**Feature 2 : Édition d'une montre (PATCH)** (~30 min)

4. **`src/api/watches.ts`** : `getWatch` et `updateWatch`. ~10 min.
5. **`src/composables/useWatch.ts`** : composable qui charge UNE montre. ~10 min.
6. **`src/components/WatchEditForm.vue`** : `onSubmit` du formulaire d'édition. ~10 min.

Les détails et indices sont dans le commentaire de chaque fichier.

## Règles

- **Ne pas modifier** les fichiers `*.spec.ts`.
- Le module `src/api/watches.ts` (client HTTP `fetch`) et le composable `src/composables/useCart.ts` sont déjà fournis intégralement. `useCart` est un bon exemple à étudier avant d'écrire `useWatches`.
- Pour tester `useWatches`, le module `../api/watches` est mocké via `vi.mock`. Vous n'avez pas besoin de toucher à `fetch` directement.
- Inutile de styliser : les tests vérifient le comportement et le markup minimum.

## Tuteur IA (optionnel)

Vous pouvez connecter l'agent tuteur **`tutor-mcp`** sur votre IDE (Claude Code, Cursor, …). Il
expose des outils calibrés pour cet exo : `list_todos`, `explain_test`, `run_tests`,
`get_hint(level=1|2|3)`, `review_my_code`, `get_api_contract`. Toutes les interactions
sont logées dans `.tutor/session.log.jsonl` et lues par le recruteur en post-mortem.

Configuration `mcp.json` (Claude Code, Cursor, ou équivalent) :

```jsonc
{
  "mcpServers": {
    "tutor": {
      "command": "npx",
      "args": ["-y", "@skeleton-watches/tutor-mcp"],
      "env": { "TUTOR_PROJECT_ROOT": "." }
    }
  }
}
```

Rien à installer : `npx` récupère le serveur au premier lancement. Le tuteur ne
lit que ce dépôt, et journalise ses réponses dans `.tutor/session.log.jsonl`.

Chargez ensuite le prompt `tutor` exposé par le serveur (capability *prompts* MCP) pour
calibrer la posture de l'agent.

## Livraison

Vous n'avez pas les droits d'écriture sur ce dépôt : vous travaillez sur votre
propre copie, puis vous proposez votre travail par merge request.

1. **Forkez** ce dépôt depuis GitHub (bouton *Fork*, en haut à droite).
2. Clonez **votre fork**, et non ce dépôt-ci :
   ```bash
   git clone https://github.com/<votre-compte>/<nom-du-depot>.git
   ```
3. Créez une branche `solution/<nom>_<prenom>_<YYYY-MM-DD>`
   (par exemple `solution/martin_jean_2026-08-14`).
4. Commitez votre travail dessus, puis poussez la branche sur votre fork :
   ```bash
   git push origin solution/<nom>_<prenom>_<YYYY-MM-DD>
   ```
5. Ouvrez une **merge request** de cette branche vers `main` de ce dépôt.
   GitHub vous le propose automatiquement juste après le push.

Si l'entretien couvre plusieurs stacks, refaites la même chose dans chaque
dépôt qui vous a été indiqué : **un fork et une merge request par dépôt**.

> Ce dépôt étant public, votre fork le sera également.
