/**
 * Formate un nombre en devise (€ par défaut)
 * @param amount Montant à formater
 * @param currency Devise (par défaut: "EUR")
 * @param locale Locale (par défaut: "fr-FR")
 * @returns Chaîne formatée, ex: "1 234,56 €"
 */
export const formatCurrency = (
    amount: number,
    currency: string = 'EUR',
    locale: string = 'fr-FR'
): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};