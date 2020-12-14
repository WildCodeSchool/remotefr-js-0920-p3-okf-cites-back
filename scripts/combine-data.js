/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

function serializeCSV(str) {
  if (/[";\n]/.test(str)) {
    return `"${str.replace(/"/g, '""').replace(/\n/g, '\\n')}"`;
  }

  return str;
}

const csvRows = [];
fs.createReadStream(path.join(__dirname, './TableSPECIES+.csv'))
  .pipe(
    csv({
      separator: ';',
    }),
  )
  .on('data', (data) => csvRows.push(data))
  .on('end', async () => {
    console.log('Loading wikidata data...');
    const wikidata = JSON.parse(
      fs.readFileSync(path.join(__dirname, './wikidata.json')),
    ).reduce((obj, d, i, arr) => {
      console.log(`Loading ${i + 1}/${arr.length}`);

      if (d.scientific_name !== undefined) {
        obj[d.scientific_name.toLowerCase()] = d;
      }

      return obj;
    }, {});

    console.log('Combining data...');
    const processedRows = csvRows.reduce((rows, row, i, arr) => {
      console.log(`Combining ${i + 1}/${arr.length}`);

      const wikiObj = wikidata[row['Scientific Name'].toLowerCase()];

      if (wikiObj != null) {
        row.wikidata_id = wikiObj.item.substring(
          wikiObj.item.lastIndexOf('/') + 1,
        );
        row.image_url = wikiObj.image ?? '';
        row.common_name = wikiObj.common_name ?? '';
      }

      rows.push(row);
      return rows;
    }, []);

    const ouputStream = fs.createWriteStream(
      path.join(__dirname, './output-data.csv'),
    );

    const writeAsync = (data) =>
      new Promise((resolve) => {
        if (!ouputStream.write(data)) {
          ouputStream.once('drain', resolve);
        } else {
          resolve();
        }
      });

    await writeAsync(
      'Id;Kingdom;Phylum;Class;Order;Family;Genus;Species;Subspecies;Scientific Name;Author;Rank;Listing;CITES;Party;Listed under;Full note;# Full note;All_DistributionFullNames;All_DistributionISOCodes;NativeDistributionFullNames;Introduced_Distribution;Introduced(?)_Distribution;Reintroduced_Distribution;Extinct_Distribution;Extinct(?)_Distribution;Distribution_Uncertain;wikidata_id;image_url;common_name\n',
    );

    for (const row of processedRows) {
      await writeAsync(serializeCSV(row.Id));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Kingdom));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Phylum));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Class));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Order));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Family));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Genus));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Species));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Subspecies));
      await writeAsync(';');
      await writeAsync(serializeCSV(row['Scientific Name']));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Author));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Rank));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Listing));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.CITES));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Party));
      await writeAsync(';');
      await writeAsync(serializeCSV(row['Listed under']));
      await writeAsync(';');
      await writeAsync(serializeCSV(row['Full note']));
      await writeAsync(';');
      await writeAsync(serializeCSV(row['# Full note']));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.All_DistributionFullNames));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.All_DistributionISOCodes));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.NativeDistributionFullNames));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Introduced_Distribution));
      await writeAsync(';');
      await writeAsync(serializeCSV(row['Introduced(?)_Distribution']));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Reintroduced_Distribution));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Extinct_Distribution));
      await writeAsync(';');
      await writeAsync(serializeCSV(row['Extinct(?)_Distribution']));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.Distribution_Uncertain));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.wikidata_id ?? ''));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.image_url ?? ''));
      await writeAsync(';');
      await writeAsync(serializeCSV(row.common_name ?? ''));
      await writeAsync('\n');
    }

    ouputStream.end();

    console.log('Output file: output-data.csv');
  });
