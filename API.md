# Contrat REST partagé : `watches`

Tous les backends (`spring-watches`, `nest-watches`, `django-watches`) exposent **strictement** le même contrat. Tous les frontends (`react-watches`, `angular-watches`, `vue-watches`) le consomment. Cela permet n'importe quelle combinaison frontend × backend.

## Modèle

```ts
type Watch = {
  id: number;        // identifiant unique, généré par le backend
  brand: string;     // ex. "Rolex"
  model: string;     // ex. "Submariner"
  priceEur: number;  // prix en euros, entier (pas de centimes)
  stock: number;     // nombre d'exemplaires disponibles, entier ≥ 0
};
```

## Endpoints

| Méthode | Chemin                          | Réponse 200            | Erreurs                 |
|---------|---------------------------------|------------------------|-------------------------|
| GET     | `/api/watches`                  | `Watch[]`              | aucun                       |
| GET     | `/api/watches?brand=<s>`        | `Watch[]` (filtré)     | aucun                       |
| GET     | `/api/watches/{id}`             | `Watch`                | `404`                   |
| POST    | `/api/watches/{id}/purchase`    | `Watch` (mis à jour)   | `404`, `400`            |
| PATCH   | `/api/watches/{id}`             | `Watch` (mis à jour)   | `404`, `400`            |

### `GET /api/watches?brand=<brand>`

Le filtre est **insensible à la casse** : `?brand=rolex` et `?brand=Rolex` retournent les mêmes résultats.

### `POST /api/watches/{id}/purchase`

Body :
```json
{ "quantity": 2 }
```

Réponses :
- **200** : la montre mise à jour, stock décrémenté.
- **404** : aucune montre avec cet `id`.
- **400** : `quantity <= 0` **ou** `stock < quantity`.

### `PATCH /api/watches/{id}`

Mise à jour partielle. Les champs sont optionnels, un champ absent du JSON
signifie "ne pas modifier".

Body :
```json
{ "priceEur": 13500, "stock": 5 }   // modifie les deux
{ "priceEur": 13500 }                // ne modifie que le prix
{ "stock": 0 }                       // ne modifie que le stock
{ }                                  // no-op (200 OK, montre inchangée)
```

Réponses :
- **200** : la montre mise à jour.
- **404** : aucune montre avec cet `id`.
- **400** : `priceEur < 0` **ou** `stock < 0`.

## Format d'erreur

Toutes les erreurs (4xx) renvoient un JSON :
```json
{ "error": "<message lisible>" }
```

## CORS

Les backends activent CORS sur tous les origins en mode dev (configurable via variable d'env). Cela permet aux frontends sur `localhost:5173` (React/Vite), `localhost:4200` (Angular) ou `localhost:5174` (Vue/Vite) d'appeler l'API.

## Ports de dev par défaut

| Stack            | Port    |
|------------------|---------|
| `spring-watches` | `8080`  |
| `nest-watches`   | `3000`  |
| `django-watches` | `8000`  |
| `react-watches`  | `5173`  |
| `angular-watches`| `4200`  |
| `vue-watches`    | `5174`  |

Côté frontend, l'URL de base de l'API est passée via une variable d'environnement (`VITE_API_URL` côté React et Vue, `NG_APP_API_URL` côté Angular, …) avec `http://localhost:8080` par défaut. Pour pointer un autre backend, le candidat n'a qu'à exporter cette variable au démarrage.

## Données de seed

Chaque backend pré-charge les mêmes 5 montres au démarrage (si la base est vide) :

```
Rolex          Submariner   12 000 €  stock 3
Rolex          Daytona      35 000 €  stock 2
Patek Philippe Nautilus     45 000 €  stock 1
Audemars Piguet Royal Oak   38 000 €  stock 2
Omega          Speedmaster   6 500 €  stock 5
```

Cela rend les démos cross-stack prévisibles : le frontend affiche le même catalogue quel que soit le backend.
