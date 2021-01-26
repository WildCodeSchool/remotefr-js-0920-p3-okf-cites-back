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

# API

Les routes sont limitées à **30 requêtes par minutes**. Au delà, le serveur renverra une erreur 429.

## Toute les espèces

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

## Recherche espèces

GET `/api/species/search`

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
| species                    | Espèces correspondants aux critères de recherche. Voir [la structure Species](#species).    | `Array<Species>`                   |
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
| &nbsp;&nbsp;countries.native       | Pays où l'espèce est natif. **Cette propriété est parfois absente.**                             | `Array<Country>`         |
| &nbsp;&nbsp;countries.introduced   | Pays où l'espèce a été introduite. **Cette propriété est parfois absente.**                      | `Array<Country>`         |
| &nbsp;&nbsp;countries.reintroduced | Pays où l'espèce a été réintroduite. **Cette propriété est parfois absente.**                    | `Array<Country>`         |
| &nbsp;&nbsp;countries.extinct      | Pays où l'espèce est devenu éteint. **Cette propriété est parfois absente.**                     | `Array<Country>`         |
| &nbsp;&nbsp;countries.uncertain    | Pays où l'espèce dont l'état de l'espèce est incertain. **Cette propriété est parfois absente.** | `Array<Country>`         |

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
Cette route est limité à **1 requête par minutes.**
