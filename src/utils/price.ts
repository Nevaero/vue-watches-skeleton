import type { CartItem } from '../types';

/**
 * Attendu : formate un montant entier en euros pour l'affichage.
 *
 * Les espaces qui séparent les milliers doivent être des espaces ASCII (` `),
 * et le symbole € doit suivre, séparé par un espace lui aussi.
 *
 * Exemples (vérifiés par price.spec.ts) :
 *
 *     formatPriceEur(500)     →  "500 €"
 *     formatPriceEur(6500)    →  "6 500 €"
 *     formatPriceEur(12000)   →  "12 000 €"
 *     formatPriceEur(450000)  →  "450 000 €"
 *     formatPriceEur(0)       →  "0 €"
 *
 * Indice : `Intl.NumberFormat('fr-FR', …)` insère un espace insécable
 * (caractère ` `) qui ne correspond pas à celui qu'attendent les tests.
 *
 * Construisez donc la chaîne vous-même : convertissez le montant, insérez un
 * espace ASCII tous les 3 chiffres en partant de la droite, puis suffixez ` €`.
 * Une expression régulière avec assertion avant fait l'insertion en une passe ;
 * une boucle depuis la fin de la chaîne fonctionne tout aussi bien.
 */
export function formatPriceEur(amount: number): string {
  // TODO : remplace cette ligne par l'implémentation décrite ci-dessus.
  throw new Error('TODO: implémenter formatPriceEur');
}

/**
 * Attendu : somme du prix de chaque ligne du panier (`priceEur × quantity`).
 *
 * Cas vérifiés par les tests :
 *   - panier vide                               →  0
 *   - une seule ligne avec quantity = 1         →  prix de la montre
 *   - plusieurs lignes avec quantités variées   →  somme des sous-totaux
 *
 * Indice : `items.reduce((sum, item) => sum + ... 0)` est l'idiome attendu.
 * Pas besoin d'un `for` ni de mutation.
 */
export function calculateCartTotal(items: CartItem[]): number {
  // TODO : remplace cette ligne par un reduce qui accumule
  //        item.watch.priceEur * item.quantity.
  throw new Error('TODO: implémenter calculateCartTotal');
}
