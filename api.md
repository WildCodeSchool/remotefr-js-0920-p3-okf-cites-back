# Structures

## Species

| Nom            | Description                                                                                                                                                                                                    | Type             | Valeur(s) possible(s)                                                                                                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id             | Identifiant de l'espèce dans notre base de données.                                                                                                                                                            | `number`         |                                                                                                                                                                                                                            |
| kingdom        | [Règne biologique](<https://fr.wikipedia.org/wiki/R%C3%A8gne_(biologie)>) de l'espèce. "Animalia" pour la faune, "Plantae" pour la flore.                                                                      | `string`         | `"Animalia", "Plantae"`                                                                                                                                                                                                    |
| phylum         | [Phylum (Embranchement) biologique](<https://fr.wikipedia.org/wiki/Embranchement_(biologie)>) de l'espèce. Faune uniquement.                                                                                   | `string \| null` | `"Cnidaria", "Chordata", "Arthropoda", "Annelida", "Mollusca", "Echinodermata", null`                                                                                                                                      |
| class          | [Class biologique](<https://fr.wikipedia.org/wiki/Classe_(biologie)>) de l'espèce. Faune uniquement.                                                                                                           | `string \| null` | `"Actinopteri", "Amphibia", "Anthozoa", "Arachnida", "Aves", "Bivalvia", "Coelacanthi", "Dipneusti", "Elasmobranchii", "Gastropoda", "Hirudinoidea", "Holothuroidea", "Hydrozoa", "Insecta", "Mammalia", "Reptilia", null` |
| order          | [Ordre biologique](<https://fr.wikipedia.org/wiki/Ordre_(biologie)>) de l'espèce.                                                                                                                              | `string`         |                                                                                                                                                                                                                            |
| family         | [Famille biologique](<https://fr.wikipedia.org/wiki/Famille_(biologie)>) de l'espèce.                                                                                                                          | `string`         |                                                                                                                                                                                                                            |
| genus          | [Genre biologique](<https://fr.wikipedia.org/wiki/Genre_(biologie)>) de l'espèce.                                                                                                                              | `string`         |                                                                                                                                                                                                                            |
| species        | [Espèce biologique](https://fr.wikipedia.org/wiki/Esp%C3%A8ce) de l'espèce.                                                                                                                                    | `string`         |                                                                                                                                                                                                                            |
| subspecies     | [Sous-espèce biologique](https://fr.wikipedia.org/wiki/Sous-esp%C3%A8ce) de l'espèce.                                                                                                                          | `string`         |                                                                                                                                                                                                                            |
| name           | [Nom scientifique](https://fr.wikipedia.org/wiki/Nom_scientifique) de l'espèce. (`genus + ' ' + species`)                                                                                                      | `string`         |                                                                                                                                                                                                                            |
| common_name    | [Nom commun (Nom vernaculaire)](https://fr.wikipedia.org/wiki/Nom_vernaculaire) de l'espèce. Prend le nom français si il existe, sinon prend le nom anglais. Si c'est les 2 sont null, cette colonne est null. | `string \| null` |                                                                                                                                                                                                                            |
| common_name_fr | [Nom commun (Nom vernaculaire)](https://fr.wikipedia.org/wiki/Nom_vernaculaire) français de l'espèce.                                                                                                          | `string \| null` |                                                                                                                                                                                                                            |
| common_name_en | [Nom commun (Nom vernaculaire)](https://fr.wikipedia.org/wiki/Nom_vernaculaire) anglais de l'espèce.                                                                                                           | `string \| null` |                                                                                                                                                                                                                            |
| cites          | [Annexe CITES](https://cites.org/fra/app/index.php) de l'espèce.                                                                                                                                               | `string`         | `"I", "II", "III", "I/II", "?"`                                                                                                                                                                                            |
| wikidata_id    | [Identifiant item wikidata](https://www.wikidata.org/wiki/Wikidata:Identifiers) de l'espèce. Commence toujours pas `Q`.                                                                                        | `string \| null` |                                                                                                                                                                                                                            |
| wikipedia_url  | Url de l'article wikipedia français de l'espèce.                                                                                                                                                               | `string \| null` |                                                                                                                                                                                                                            |
| image_url      | Url d'une image wikimedia de l'espèce.                                                                                                                                                                         | `string \| null` |                                                                                                                                                                                                                            |

# API

## Recherche espèces

`/api/species/search`

#### Paramètres de requête

| Nom     | Description                                                                           | Type            | Valeur(s) possible(s)                                                                                                                                                                                                | Valeur(s) par défaut                                                                                                                                                                                                   |
| ------- | ------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| query   | Terme à rechercher sur le nom scientifique et le nom commun d'un espèce               | `string`        |                                                                                                                                                                                                                      | `""`                                                                                                                                                                                                                   |
| kingdom | Règnes de l'espèces. "Animalia" pour la faune, "Plantae" pour la flore.               | `Array<string>` | `"Animalia", "Plantae"`                                                                                                                                                                                              | `["Animalia", "Plantae"]`                                                                                                                                                                                              |
| class   | Classes biologiques de l'espèce. N'affecte que la faune.                              | `Array<string>` | `"Actinopteri", "Amphibia", "Anthozoa", "Arachnida", "Aves", "Bivalvia", "Coelacanthi", "Dipneusti", "Elasmobranchii", "Gastropoda", "Hirudinoidea", "Holothuroidea", "Hydrozoa", "Insecta", "Mammalia", "Reptilia"` | `["Actinopteri", "Amphibia", "Anthozoa", "Arachnida", "Aves", "Bivalvia", "Coelacanthi", "Dipneusti", "Elasmobranchii", "Gastropoda", "Hirudinoidea", "Holothuroidea", "Hydrozoa", "Insecta", "Mammalia", "Reptilia"]` |
| cites   | Annexes CITES de l'espèce.                                                            | `Array<string>` | `"I", "II", "III", "I/II", "?"`                                                                                                                                                                                      | `["I", "II", "III", "I/II", "?"]`                                                                                                                                                                                      |
| limit   | Limite le nombre maximum d'espèces retournées.                                        | `number`        |                                                                                                                                                                                                                      | 20                                                                                                                                                                                                                     |
| offset  | Décalage des résultats. Utilisez avec `limit` pour un faire un système de pagination. | `number`        |                                                                                                                                                                                                                      | 0                                                                                                                                                                                                                      |

#### Réponse

| Nom                        | Description                                                                                 | Type                               |
| -------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------- |
| species                    | Espèces correspondants aux critères de recherche.                                           | `Array<Species>`                   |
| counts                     | Comptes de la base de données.                                                              | `Object<number \| Object<number>>` |
| &nbsp;&nbsp;counts.total   | Nombre d'espèces total dans la base de données. **Ignore les critères de recherche.**       | `number`                           |
| &nbsp;&nbsp;counts.kingdom | Nombre d'espèces pour chaque règnes. **Ne prend en compte que le critère `query`.**         | `Object<number>`                   |
| &nbsp;&nbsp;counts.class   | Nombre d'espèces pour chaque classes. **Ne prend en compte que le critère `query`.**        | `Object<number>`                   |
| &nbsp;&nbsp;counts.cites   | Nombre d'espèces pour chaque annexes CITES . **Ne prend en compte que le critère `query`.** | `Object<number>`                   |

#### Example

`/api/species/search?query=elephant&limit=2`

```json
{
  "species": [
    {
      "id": 1026,
      "kingdom": "Animalia",
      "phylum": "Chordata",
      "class": "Mammalia",
      "order": "Proboscidea",
      "family": "Elephantidae",
      "genus": "Loxodonta",
      "species": "africana",
      "subspecies": null,
      "name": "Loxodonta africana",
      "common_name": "Éléphant Africain",
      "common_name_fr": "Éléphant Africain",
      "common_name_en": "African Elephant",
      "author": "(Blumenbach, 1797)",
      "listing": "A/B",
      "cites": "I/II",
      "wikidata_id": "Q36557",
      "wikipedia_url": "https://fr.wikipedia.org/wiki/%C3%89l%C3%A9phant_de_savane_d%27Afrique",
      "image_url": "http://commons.wikimedia.org/wiki/Special:FilePath/African%20Bush%20Elephant.jpg"
    },
    {
      "id": 1806,
      "kingdom": "Animalia",
      "phylum": "Chordata",
      "class": "Mammalia",
      "order": "Proboscidea",
      "family": "Elephantidae",
      "genus": "Elephas",
      "species": "maximus",
      "subspecies": null,
      "name": "Elephas maximus",
      "common_name": "Eléphant d'Inde",
      "common_name_fr": "Eléphant d'Inde",
      "common_name_en": "Indian Elephant",
      "author": "Linnaeus, 1758",
      "listing": "A",
      "cites": "I",
      "wikidata_id": "Q133006",
      "wikipedia_url": "https://fr.wikipedia.org/wiki/%C3%89l%C3%A9phant_d%27Asie",
      "image_url": "http://commons.wikimedia.org/wiki/Special:FilePath/Elephas%20maximus%20%28Bandipur%29.jpg"
    }
  ],
  "counts": {
    "total": 21229,
    "class": {
      "mammalia": 3,
      "anthozoa": 1
    },
    "kingdom": {
      "animalia": 4,
      "plantae": 8
    },
    "cites": {
      "I/II": 1,
      "I": 1,
      "II": 10
    }
  }
}
```
