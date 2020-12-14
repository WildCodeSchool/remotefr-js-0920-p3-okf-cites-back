/* eslint-disable camelcase */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const knex = require('../db/knex');

const csvSpecies = [];
fs.createReadStream(path.join(__dirname, './output-data.csv'))
  .pipe(
    csv({
      separator: ';',
    }),
  )
  .on('data', (data) => {
    data.All_DistributionFullNames = data.All_DistributionFullNames.split(',')
      .map((str) => str.trim())
      .filter((str) => str.length > 0);
    data.All_DistributionISOCodes = data.All_DistributionISOCodes.split(',')
      .map((str) => str.trim())
      .filter((str) => str.length > 0);
    data.NativeDistributionFullNames = data.NativeDistributionFullNames.split(
      ',',
    )
      .map((str) => str.trim())
      .filter((str) => str.length > 0);
    data.Introduced_Distribution = data.Introduced_Distribution.split(',')
      .map((str) => str.trim())
      .filter((str) => str.length > 0);
    data['Introduced(?)_Distribution'] = data['Introduced(?)_Distribution']
      .split(',')
      .map((str) => str.trim())
      .filter((str) => str.length > 0);
    data.Reintroduced_Distribution = data.Reintroduced_Distribution.split(',')
      .map((str) => str.trim())
      .filter((str) => str.length > 0);
    data.Extinct_Distribution = data.Extinct_Distribution.split(',')
      .map((str) => str.trim())
      .filter((str) => str.length > 0);
    data['Extinct(?)_Distribution'] = data['Extinct(?)_Distribution']
      .split(',')
      .map((str) => str.trim())
      .filter((str) => str.length > 0);
    data.Distribution_Uncertain = data.Distribution_Uncertain.split(',')
      .map((str) => str.trim())
      .filter((str) => str.length > 0);

    return csvSpecies.push(data);
  })
  .on('end', () => {
    const csvCountries = [];
    fs.createReadStream(path.join(__dirname, './countries.csv'))
      .pipe(csv())
      .on('data', (data) => csvCountries.push(data))
      .on('end', async () => {
        console.log('Importing countries');
        // country
        const countriesDBid = {};
        for (const country of csvCountries) {
          const [id] = await knex('country').insert({
            name: country.name,
            iso_code: country['alpha-2'],
          });

          countriesDBid[country.name] = id;
        }
        console.log('Importing countries done');

        // species

        // Id
        // Kingdom
        // Phylum
        // Class
        // Order
        // Family
        // Genus
        // Species
        // Subspecies
        // Scientific Name
        // Author
        // Rank
        // Listing
        // CITES
        // Party
        // Listed under
        // Full note
        // # Full note
        // All_DistributionFullNames
        // All_DistributionISOCodes
        // NativeDistributionFullNames
        // Introduced_Distribution
        // Introduced(?)_Distribution
        // Reintroduced_Distribution
        // Extinct_Distribution
        // Extinct(?)_Distribution
        // Distribution_Uncertain
        // wikidata_id
        // image_url

        console.log('Importing species');
        async function insertSpecies(species) {
          const insertData = {
            kingdom: species.Kingdom,
            phylum: species.Phylum,
            class: species.Class,
            order: species.Order,
            family: species.Family,
            genus: species.Genus,
            species: species.Species,
            subspecies: species.Subspecies,
            author: species.Author,
            listing: species.Listing,
            cites: species.CITES,
            wikidata_id: species.wikidata_id,
            image_url: species.image_url,
          };
          for (const [key, val] of Object.entries(insertData)) {
            if (val === '') insertData[key] = null;
          }

          const [id] = await knex('species').insert(insertData);

          for (const name of species.NativeDistributionFullNames) {
            const country_id = countriesDBid[name];
            if (country_id == null) continue;

            await knex('species_country').insert({
              species_id: id,
              country_id,
              uncertain: false,
              type: 'native',
            });
          }

          for (const name of species.Introduced_Distribution) {
            const country_id = countriesDBid[name];
            if (country_id == null) continue;

            await knex('species_country').insert({
              species_id: id,
              country_id,
              uncertain: false,
              type: 'introduced',
            });
          }

          for (const name of species['Introduced(?)_Distribution']) {
            const country_id = countriesDBid[name];
            if (country_id == null) continue;

            await knex('species_country').insert({
              species_id: id,
              country_id,
              uncertain: true,
              type: 'introduced',
            });
          }

          for (const name of species.Reintroduced_Distribution) {
            const country_id = countriesDBid[name];
            if (country_id == null) continue;

            await knex('species_country').insert({
              species_id: id,
              country_id,
              uncertain: false,
              type: 'reintroduced',
            });
          }

          for (const name of species.Extinct_Distribution) {
            const country_id = countriesDBid[name];
            if (country_id == null) continue;

            await knex('species_country').insert({
              species_id: id,
              country_id,
              uncertain: false,
              type: 'extinct',
            });
          }

          for (const name of species['Extinct(?)_Distribution']) {
            const country_id = countriesDBid[name];
            if (country_id == null) continue;

            await knex('species_country').insert({
              species_id: id,
              country_id,
              uncertain: true,
              type: 'extinct',
            });
          }

          for (const name of species.Distribution_Uncertain) {
            const country_id = countriesDBid[name];
            if (country_id == null) continue;

            await knex('species_country').insert({
              species_id: id,
              country_id,
              uncertain: false,
              type: 'uncertain',
            });
          }
        }

        while (csvSpecies.length) {
          // 100 at at time
          await Promise.all(csvSpecies.splice(0, 100).map(insertSpecies));
        }

        // await Promise.all(csvSpecies.map(insertSpecies));
        console.log('Importing species done');
      });
  });
