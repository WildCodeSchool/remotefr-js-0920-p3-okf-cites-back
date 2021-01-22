# Utilisation

1. Installez les dépendances avec `npm install` (ou yarn ou pnpm)
2. Copiez `.env.sample`, renommez le en `.env` et remplissez les variables
3. Lancez les migrations de la base de données avec `npm run migrate:latest`
4. Lancez le serveur avec `npm run start` (prod) ou `npm run start:dev` (dev)

# Synchronisation wikidata

Le site met à jour la base de données avec wikidata 2 fois par jour. (Expression cron : `0 */12 * * *`)  
Pour lancer **manuellement** une synchronisation, lancez `npm run sync-with-wikidata`.

La requête SPARQL effectué pour récupérer les données d'une espèce ce trouve dans le fichier [db/sync-with-wikidata.js](db/sync-with-wikidata.js)
