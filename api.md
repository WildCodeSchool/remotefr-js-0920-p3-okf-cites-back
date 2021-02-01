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
| species+\_id   | Identifiant [Species+](https://speciesplus.net/) de l'espèce.                                                                                                                                                  | `number`         |                                                                                                                                                                                                                            |
| wikidata_id    | [Identifiant item wikidata](https://www.wikidata.org/wiki/Wikidata:Identifiers) de l'espèce. Commence toujours pas `Q`.                                                                                        | `string \| null` |                                                                                                                                                                                                                            |
| wikipedia_url  | Url de l'article wikipedia français de l'espèce.                                                                                                                                                               | `string \| null` |                                                                                                                                                                                                                            |
| image_url      | Url d'une image wikimedia de l'espèce.                                                                                                                                                                         | `string \| null` |                                                                                                                                                                                                                            |

## Country

| Nom       | Description                                                                                   | Type      |
| --------- | --------------------------------------------------------------------------------------------- | --------- |
| name      | Nom du pays.                                                                                  | `string`  |
| iso_code  | Code 2 lettre [ISO 3166-1 alpha-2](https://fr.wikipedia.org/wiki/ISO_3166-1_alpha-2) du pays. | `string`  |
| uncertain | Incertidute de l'information. Si `true`, l'information peut-être incorrecte.                  | `boolean` |

## Stats

| Nom            | Description                                      | Type     |
| -------------- | ------------------------------------------------ | -------- |
| total          | Nombre total dans la base de données.            | `number` |
| cites          | Nombre ayant un annexe CITES inconnu.            | `number` |
| image_url      | Nombre n'ayant pas d'image.                      | `number` |
| common_name_fr | Nombre n'ayant pas de nom vernaculaire français. | `number` |
| common_name_en | Nombre n'ayant pas de nom vernaculaire anglais.  | `number` |
| wikidata_id    | Nombre n'ayant pas d'id wikidata.                | `number` |
| wikipedia_url  | Nombre n'ayant pas d'article wikipedia français. | `number` |

# API

Les routes sont limitées à **30 requêtes par minutes**. Au delà, le serveur renverra une erreur 429.

## Toutes les espèces

GET `/api/species/`

#### Paramètres de requête

| Nom    | Description                                                                           | Type     | Valeur par défaut |
| ------ | ------------------------------------------------------------------------------------- | -------- | ----------------- |
| limit  | Limite le nombre maximum d'espèces retournées.                                        | `number` | 20                |
| offset | Décalage des résultats. Utilisez avec `limit` pour un faire un système de pagination. | `number` | 0                 |

#### Réponse

| Nom     | Description                                     | Type             |
| ------- | ----------------------------------------------- | ---------------- |
| species | Voir [la structure Species](#species).          | `Array<Species>` |
| total   | Nombre total d'espèces dans la base de données. | `number`         |

#### Exemple

GET `/api/species/?limit=2&offset=5`

```json
{
  "species": [
    {
      "id": 6,
      "kingdom": "Animalia",
      "phylum": "Chordata",
      "class": "Aves",
      "order": "Coraciiformes",
      "family": "Bucerotidae",
      "genus": "Anthracoceros",
      "species": "marchei",
      "subspecies": null,
      "name": "Anthracoceros marchei",
      "common_name": "Calao de Palawan",
      "common_name_fr": "Calao de Palawan",
      "common_name_en": "Palawan Hornbill",
      "author": "Oustalet, 1885",
      "listing": "B",
      "cites": "II",
      "wikidata_id": "Q1193501",
      "wikipedia_url": "https://fr.wikipedia.org/wiki/Calao_de_Palawan",
      "image_url": "http://commons.wikimedia.org/wiki/Special:FilePath/Anthracoceros%20marchei%20-Palawan-8.jpg"
    },
    {
      "id": 7,
      "kingdom": "Animalia",
      "phylum": "Chordata",
      "class": "Aves",
      "order": "Psittaciformes",
      "family": "Psittacidae",
      "genus": "Pyrrhura",
      "species": "albipectus",
      "subspecies": null,
      "name": "Pyrrhura albipectus",
      "common_name": "Conure à col blanc",
      "common_name_fr": "Conure à col blanc",
      "common_name_en": "White-necked Parakeet",
      "author": "Chapman, 1914",
      "listing": "B",
      "cites": "II",
      "wikidata_id": "Q254919",
      "wikipedia_url": "https://fr.wikipedia.org/wiki/Conure_%C3%A0_col_blanc",
      "image_url": "http://commons.wikimedia.org/wiki/Special:FilePath/White-breasted%20Parakeets%20%28Pyrrhua%20albipectus%29.jpg"
    }
  ],
  "total": 21229
}
```

## Espèces aléatoires avec données manquantes

GET `/api/species/missing-data`

#### Paramètres de requête

| Nom   | Description                                    | Type     | Valeur par défaut |
| ----- | ---------------------------------------------- | -------- | ----------------- |
| limit | Limite le nombre maximum d'espèces retournées. | `number` | 20                |

#### Réponse

Renvoie un `Array<Species>`. Voir [la structure Species](#species).

#### Exemple

GET `/api/species/missing-data?limit=2`

```json
[
  {
    "id": 9746,
    "kingdom": "Plantae",
    "phylum": null,
    "class": null,
    "order": "Orchidales",
    "family": "Orchidaceae",
    "genus": "Bulbophyllum",
    "species": "grandifolium",
    "subspecies": null,
    "name": "Bulbophyllum grandifolium",
    "common_name": null,
    "common_name_fr": null,
    "common_name_en": null,
    "author": "Schltr.",
    "listing": "B",
    "cites": "II",
    "wikidata_id": "Q4988105",
    "wikipedia_url": null,
    "image_url": null
  },
  {
    "id": 7583,
    "kingdom": "Plantae",
    "phylum": null,
    "class": null,
    "order": "Orchidales",
    "family": "Orchidaceae",
    "genus": "Cephalanthera",
    "species": "cucullata",
    "subspecies": null,
    "name": "Cephalanthera cucullata",
    "common_name": null,
    "common_name_fr": null,
    "common_name_en": null,
    "author": "Boiss. & Heldr.",
    "listing": "A",
    "cites": "II",
    "wikidata_id": "Q15443718",
    "wikipedia_url": null,
    "image_url": "http://commons.wikimedia.org/wiki/Special:FilePath/Cephalanthera%20cucullata.jpg"
  }
]
```

<<<<<<< HEAD
=======
## Statistiques sur les données manquantes des espcèes

GET `/api/species/stats`

#### Réponse

| Nom      | Description                                                            | Type            |
| -------- | ---------------------------------------------------------------------- | --------------- |
| kingdom  | Statistiques par règne. Voir [la structure Stats](#stats).             | `Object<Stats>` |
| animalia | Statistiques de la faune par class. Voir [la structure Stats](#stats). | `Object<Stats>` |
| plantae  | Statistiques de la flore par ordre. Voir [la structure Stats](#stats). | `Object<Stats>` |

#### Exemple

GET `/api/species/stats`

```json
{
  "kingdom": {
    "animalia": {
      "total": 5900,
      "cites": 138,
      "image_url": 2438,
      "common_name_fr": 3889,
      "common_name_en": 2485,
      "wikidata_id": 309,
      "wikipedia_url": 1562
    },
    "plantae": {
      "total": 15329,
      "cites": 35,
      "image_url": 10687,
      "common_name_fr": 15213,
      "common_name_en": 13903,
      "wikidata_id": 1501,
      "wikipedia_url": 14561
    }
  },
  "animalia": {
    "orchidales": {
      "total": 10646,
      "cites": 0,
      "image_url": 8191,
      "common_name_fr": 10565,
      "common_name_en": 9892,
      "wikidata_id": 1298,
      "wikipedia_url": 10312
    },
    "cyatheales": {
      "total": 653,
      "cites": 0,
      "image_url": 638,
      "common_name_fr": 653,
      "common_name_en": 641,
      "wikidata_id": 44,
      "wikipedia_url": 648
    },
    "liliales": {
      "total": 519,
      "cites": 2,
      "image_url": 285,
      "common_name_fr": 512,
      "common_name_en": 486,
      "wikidata_id": 10,
      "wikipedia_url": 476
    },
    "caryophyllales": {
      "total": 1913,
      "cites": 2,
      "image_url": 720,
      "common_name_fr": 1907,
      "common_name_en": 1609,
      "wikidata_id": 73,
      "wikipedia_url": 1738
    },
    "nepenthales": {
      "total": 143,
      "cites": 0,
      "image_url": 35,
      "common_name_fr": 142,
      "common_name_en": 86,
      "wikidata_id": 18,
      "wikipedia_url": 103
    },
    "euphorbiales": {
      "total": 709,
      "cites": 1,
      "image_url": 353,
      "common_name_fr": 707,
      "common_name_en": 686,
      "wikidata_id": 20,
      "wikipedia_url": 669
    },
    "cycadales": {
      "total": 343,
      "cites": 0,
      "image_url": 187,
      "common_name_fr": 338,
      "common_name_en": 172,
      "wikidata_id": 11,
      "wikipedia_url": 319
    },
    "gentianales": {
      "total": 37,
      "cites": 1,
      "image_url": 15,
      "common_name_fr": 36,
      "common_name_en": 33,
      "wikidata_id": 2,
      "wikipedia_url": 30
    },
    "arecales": {
      "total": 10,
      "cites": 0,
      "image_url": 5,
      "common_name_fr": 9,
      "common_name_en": 2,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "primulales": {
      "total": 27,
      "cites": 0,
      "image_url": 8,
      "common_name_fr": 26,
      "common_name_en": 23,
      "wikidata_id": 7,
      "wikipedia_url": 15
    },
    "myrtales": {
      "total": 74,
      "cites": 0,
      "image_url": 69,
      "common_name_fr": 74,
      "common_name_en": 71,
      "wikidata_id": 14,
      "wikipedia_url": 58
    },
    "sapindales": {
      "total": 19,
      "cites": 0,
      "image_url": 7,
      "common_name_fr": 16,
      "common_name_en": 10,
      "wikidata_id": 0,
      "wikipedia_url": 11
    },
    "fabales": {
      "total": 66,
      "cites": 0,
      "image_url": 59,
      "common_name_fr": 65,
      "common_name_en": 55,
      "wikidata_id": 0,
      "wikipedia_url": 44
    },
    "violales": {
      "total": 10,
      "cites": 2,
      "image_url": 7,
      "common_name_fr": 10,
      "common_name_en": 9,
      "wikidata_id": 1,
      "wikipedia_url": 10
    },
    "lycopodiales": {
      "total": 1,
      "cites": 1,
      "image_url": 0,
      "common_name_fr": 0,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "dicksoniales": {
      "total": 5,
      "cites": 0,
      "image_url": 2,
      "common_name_fr": 5,
      "common_name_en": 5,
      "wikidata_id": 0,
      "wikipedia_url": 3
    },
    "arales": {
      "total": 9,
      "cites": 9,
      "image_url": 4,
      "common_name_fr": 9,
      "common_name_en": 7,
      "wikidata_id": 2,
      "wikipedia_url": 8
    },
    "bromeliales": {
      "total": 4,
      "cites": 1,
      "image_url": 0,
      "common_name_fr": 4,
      "common_name_en": 3,
      "wikidata_id": 0,
      "wikipedia_url": 4
    },
    "ebenales": {
      "total": 85,
      "cites": 0,
      "image_url": 84,
      "common_name_fr": 85,
      "common_name_en": 85,
      "wikidata_id": 0,
      "wikipedia_url": 85
    },
    "pinales": {
      "total": 14,
      "cites": 0,
      "image_url": 2,
      "common_name_fr": 12,
      "common_name_en": 3,
      "wikidata_id": 0,
      "wikipedia_url": 4
    },
    "scrophulariales": {
      "total": 6,
      "cites": 2,
      "image_url": 2,
      "common_name_fr": 6,
      "common_name_en": 5,
      "wikidata_id": 0,
      "wikipedia_url": 4
    },
    "theales": {
      "total": 1,
      "cites": 0,
      "image_url": 1,
      "common_name_fr": 1,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 1
    },
    "juglandales": {
      "total": 1,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 1
    },
    "apiales": {
      "total": 2,
      "cites": 0,
      "image_url": 1,
      "common_name_fr": 2,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 1
    },
    "asterales": {
      "total": 8,
      "cites": 7,
      "image_url": 6,
      "common_name_fr": 7,
      "common_name_en": 7,
      "wikidata_id": 0,
      "wikipedia_url": 6
    },
    "dioscoreales": {
      "total": 3,
      "cites": 3,
      "image_url": 0,
      "common_name_fr": 3,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 1
    },
    "ranunculales": {
      "total": 3,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 2,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 1
    },
    "laurales": {
      "total": 1,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "lecanorales": {
      "total": 1,
      "cites": 1,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "papaverales": {
      "total": 1,
      "cites": 0,
      "image_url": 1,
      "common_name_fr": 1,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 1
    },
    "trochodendrales": {
      "total": 1,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "rosales": {
      "total": 1,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "rhamnales": {
      "total": 3,
      "cites": 0,
      "image_url": 2,
      "common_name_fr": 3,
      "common_name_en": 3,
      "wikidata_id": 0,
      "wikipedia_url": 3
    },
    "solanales": {
      "total": 1,
      "cites": 1,
      "image_url": 0,
      "common_name_fr": 0,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "zingiberales": {
      "total": 1,
      "cites": 0,
      "image_url": 1,
      "common_name_fr": 1,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 1
    },
    "rubiales": {
      "total": 1,
      "cites": 0,
      "image_url": 1,
      "common_name_fr": 1,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 1
    },
    "santanales": {
      "total": 1,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 1
    },
    "selaginellales": {
      "total": 1,
      "cites": 1,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "ericales": {
      "total": 1,
      "cites": 1,
      "image_url": 0,
      "common_name_fr": 0,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "dipsacales": {
      "total": 1,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "magnoliales": {
      "total": 1,
      "cites": 0,
      "image_url": 1,
      "common_name_fr": 1,
      "common_name_en": 1,
      "wikidata_id": 1,
      "wikipedia_url": 1
    },
    "fagales": {
      "total": 1,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "lamiales": {
      "total": 1,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 1
    }
  },
  "plantae": {
    "anthozoa": {
      "total": 1822,
      "cites": 0,
      "image_url": 1286,
      "common_name_fr": 1818,
      "common_name_en": 1414,
      "wikidata_id": 54,
      "wikipedia_url": 612
    },
    "aves": {
      "total": 1549,
      "cites": 79,
      "image_url": 220,
      "common_name_fr": 159,
      "common_name_en": 131,
      "wikidata_id": 83,
      "wikipedia_url": 177
    },
    "hydrozoa": {
      "total": 258,
      "cites": 0,
      "image_url": 201,
      "common_name_fr": 258,
      "common_name_en": 249,
      "wikidata_id": 4,
      "wikipedia_url": 255
    },
    "mammalia": {
      "total": 916,
      "cites": 10,
      "image_url": 188,
      "common_name_fr": 463,
      "common_name_en": 100,
      "wikidata_id": 50,
      "wikipedia_url": 221
    },
    "reptilia": {
      "total": 856,
      "cites": 24,
      "image_url": 337,
      "common_name_fr": 742,
      "common_name_en": 384,
      "wikidata_id": 78,
      "wikipedia_url": 111
    },
    "actinopteri": {
      "total": 91,
      "cites": 1,
      "image_url": 18,
      "common_name_fr": 67,
      "common_name_en": 16,
      "wikidata_id": 0,
      "wikipedia_url": 44
    },
    "insecta": {
      "total": 79,
      "cites": 12,
      "image_url": 28,
      "common_name_fr": 74,
      "common_name_en": 47,
      "wikidata_id": 5,
      "wikipedia_url": 41
    },
    "amphibia": {
      "total": 198,
      "cites": 11,
      "image_url": 96,
      "common_name_fr": 193,
      "common_name_en": 76,
      "wikidata_id": 4,
      "wikipedia_url": 6
    },
    "hirudinoidea": {
      "total": 2,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 1
    },
    "gastropoda": {
      "total": 42,
      "cites": 1,
      "image_url": 29,
      "common_name_fr": 42,
      "common_name_en": 25,
      "wikidata_id": 15,
      "wikipedia_url": 41
    },
    "bivalvia": {
      "total": 41,
      "cites": 0,
      "image_url": 22,
      "common_name_fr": 39,
      "common_name_en": 22,
      "wikidata_id": 15,
      "wikipedia_url": 35
    },
    "arachnida": {
      "total": 26,
      "cites": 0,
      "image_url": 13,
      "common_name_fr": 26,
      "common_name_en": 18,
      "wikidata_id": 1,
      "wikipedia_url": 15
    },
    "elasmobranchii": {
      "total": 16,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 4,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 3
    },
    "coelacanthi": {
      "total": 2,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "holothuroidea": {
      "total": 1,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 0,
      "wikidata_id": 0,
      "wikipedia_url": 0
    },
    "dipneusti": {
      "total": 1,
      "cites": 0,
      "image_url": 0,
      "common_name_fr": 1,
      "common_name_en": 1,
      "wikidata_id": 0,
      "wikipedia_url": 0
    }
  }
}
```

>>>>>>> us-5-data
## Recherche espèces

GET `/api/species/search`

#### Paramètres de requête

| Nom     | Description                                                                           | Type            | Valeur(s) possible(s)                                                                                                                                                                                                | Valeur(s) par défaut                                                                                                                                                                                                   |
| ------- | ------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| query   | Terme à rechercher sur le nom scientifique et le nom commun d'une espèce              | `string`        |                                                                                                                                                                                                                      | `""`                                                                                                                                                                                                                   |
| kingdom | Règnes de l'espèce. "Animalia" pour la faune, "Plantae" pour la flore.                | `Array<string>` | `"Animalia", "Plantae"`                                                                                                                                                                                              | `["Animalia", "Plantae"]`                                                                                                                                                                                              |
| class   | Classes biologiques de l'espèce. N'affecte que la faune.                              | `Array<string>` | `"Actinopteri", "Amphibia", "Anthozoa", "Arachnida", "Aves", "Bivalvia", "Coelacanthi", "Dipneusti", "Elasmobranchii", "Gastropoda", "Hirudinoidea", "Holothuroidea", "Hydrozoa", "Insecta", "Mammalia", "Reptilia"` | `["Actinopteri", "Amphibia", "Anthozoa", "Arachnida", "Aves", "Bivalvia", "Coelacanthi", "Dipneusti", "Elasmobranchii", "Gastropoda", "Hirudinoidea", "Holothuroidea", "Hydrozoa", "Insecta", "Mammalia", "Reptilia"]` |
| cites   | Annexes CITES de l'espèce.                                                            | `Array<string>` | `"I", "II", "III", "I/II", "?"`                                                                                                                                                                                      | `["I", "II", "III", "I/II", "?"]`                                                                                                                                                                                      |
| limit   | Limite le nombre maximum d'espèces retournées.                                        | `number`        |                                                                                                                                                                                                                      | 20                                                                                                                                                                                                                     |
| offset  | Décalage des résultats. Utilisez avec `limit` pour un faire un système de pagination. | `number`        |                                                                                                                                                                                                                      | 0                                                                                                                                                                                                                      |

#### Réponse

| Nom                        | Description                                                                                 | Type                               |
| -------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------- |
| species                    | Espèces correspondantes aux critères de recherche. Voir [la structure Species](#species).   | `Array<Species>`                   |
| counts                     | Comptes de la base de données.                                                              | `Object<number \| Object<number>>` |
| &nbsp;&nbsp;counts.total   | Nombre d'espèces total dans la base de données. **Ignore les critères de recherche.**       | `number`                           |
| &nbsp;&nbsp;counts.kingdom | Nombre d'espèces pour chaque règnes. **Ne prend en compte que le critère `query`.**         | `Object<number>`                   |
| &nbsp;&nbsp;counts.class   | Nombre d'espèces pour chaque classes. **Ne prend en compte que le critère `query`.**        | `Object<number>`                   |
| &nbsp;&nbsp;counts.cites   | Nombre d'espèces pour chaque annexes CITES . **Ne prend en compte que le critère `query`.** | `Object<number>`                   |

#### Exemple

GET `/api/species/search?query=elephant&limit=2`

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

## Informations d'une espèce

GET `/api/species/:id`

#### Paramètres de requête

| Nom | Description     | Type     |
| --- | --------------- | -------- |
| :id | Id de l'espèce. | `number` |

#### Réponse

| Nom                                | Description                                                                                      | Type                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------ |
| ...Species                         | Informations de l'espèce. Voir [la structure Species](#species).                                 | `Species`                |
| countries                          | Comptes de la base de données. Voir [la structure Country](#country).                            | `Object<Array<Country>>` |
| &nbsp;&nbsp;countries.native       | Pays où l'espèce est native. **Cette propriété est parfois absente.**                            | `Array<Country>`         |
| &nbsp;&nbsp;countries.introduced   | Pays où l'espèce a été introduite. **Cette propriété est parfois absente.**                      | `Array<Country>`         |
| &nbsp;&nbsp;countries.reintroduced | Pays où l'espèce a été réintroduite. **Cette propriété est parfois absente.**                    | `Array<Country>`         |
| &nbsp;&nbsp;countries.extinct      | Pays où l'espèce s'est éteinte. **Cette propriété est parfois absente.**                         | `Array<Country>`         |
| &nbsp;&nbsp;countries.uncertain    | Pays où l'espèce dont l'état de l'espèce est incertain. **Cette propriété est parfois absente.** | `Array<Country>`         |

Renvoie 404 si il n'existe pas d'espèce ayant l'id `:id`.

#### Exemple

GET `/api/species/5601`

```json
{
  "id": 5601,
  "kingdom": "Animalia",
  "phylum": "Mollusca",
  "class": "Bivalvia",
  "order": "Veneroida",
  "family": "Tridacnidae",
  "genus": "Tridacna",
  "species": "derasa",
  "subspecies": null,
  "name": "Tridacna derasa",
  "common_name": "Southern Giant Clam",
  "common_name_fr": null,
  "common_name_en": "Southern Giant Clam",
  "author": "(R��ding, 1798)",
  "listing": "B",
  "cites": "II",
  "wikidata_id": "Q1055977",
  "wikipedia_url": "https://fr.wikipedia.org/wiki/Tridacna_derasa",
  "image_url": "http://commons.wikimedia.org/wiki/Special:FilePath/Tridacna%20derasa%201.jpg",
  "countries": {
    "native": [
      {
        "name": "Australia",
        "iso_code": "AU",
        "uncertain": false
      },
      {
        "name": "Cocos (Keeling) Islands",
        "iso_code": "CC",
        "uncertain": false
      },
      {
        "name": "Fiji",
        "iso_code": "FJ",
        "uncertain": false
      },
      {
        "name": "Indonesia",
        "iso_code": "ID",
        "uncertain": false
      },
      {
        "name": "Malaysia",
        "iso_code": "MY",
        "uncertain": false
      },
      {
        "name": "New Caledonia",
        "iso_code": "NC",
        "uncertain": false
      },
      {
        "name": "Palau",
        "iso_code": "PW",
        "uncertain": false
      },
      {
        "name": "Papua New Guinea",
        "iso_code": "PG",
        "uncertain": false
      },
      {
        "name": "Philippines",
        "iso_code": "PH",
        "uncertain": false
      },
      {
        "name": "Solomon Islands",
        "iso_code": "SB",
        "uncertain": false
      },
      {
        "name": "Tonga",
        "iso_code": "TO",
        "uncertain": false
      },
      {
        "name": "Viet Nam",
        "iso_code": "VN",
        "uncertain": false
      }
    ],
    "introduced": [
      {
        "name": "American Samoa",
        "iso_code": "AS",
        "uncertain": false
      },
      {
        "name": "Cook Islands",
        "iso_code": "CK",
        "uncertain": false
      },
      {
        "name": "Micronesia (Federated States of)",
        "iso_code": "FM",
        "uncertain": false
      },
      {
        "name": "Samoa",
        "iso_code": "WS",
        "uncertain": false
      },
      {
        "name": "Marshall Islands",
        "iso_code": "MH",
        "uncertain": true
      },
      {
        "name": "Tuvalu",
        "iso_code": "TV",
        "uncertain": true
      },
      {
        "name": "United States of America",
        "iso_code": "US",
        "uncertain": true
      }
    ],
    "reintroduced": [
      {
        "name": "Guam",
        "iso_code": "GU",
        "uncertain": false
      },
      {
        "name": "Northern Mariana Islands",
        "iso_code": "MP",
        "uncertain": false
      }
    ],
    "extinct": [
      {
        "name": "Guam",
        "iso_code": "GU",
        "uncertain": false
      },
      {
        "name": "Northern Mariana Islands",
        "iso_code": "MP",
        "uncertain": false
      },
      {
        "name": "Vanuatu",
        "iso_code": "VU",
        "uncertain": false
      }
    ],
    "uncertain": [
      {
        "name": "Tuvalu",
        "iso_code": "TV",
        "uncertain": false
      },
      {
        "name": "United States of America",
        "iso_code": "US",
        "uncertain": false
      }
    ]
  }
}
```

## Image réduite d'une espèce

GET `/api/species/:id/small-image`

Cette route n'a pas de limite de requête.

#### Paramètres de requête

| Nom | Description     | Type     |
| --- | --------------- | -------- |
| :id | Id de l'espèce. | `number` |

#### Réponse

Renvoie une image de l'espèce au format JPEG de taille 300x250.

Renvoie 404 si l'espèce n'existe pas ou si il n'y a pas d'image pour cette espèce.

## Dump de la base de données

GET `/api/species/dump`

Renvoie un fichier sql généré avec [mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html).  
Cette route est limitée à **1 requête par minute.**
