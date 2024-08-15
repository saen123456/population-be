import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as path from 'path';
import * as _ from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let dataPopulation: any[] = [];

interface CountryPopulation {
  country: string;
  population: string; // Population is a string, so it needs to be converted to a number for sorting
}

interface PopulationData {
  [key: string]: CountryPopulation[];
}
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getDataFromExcel() {
    try {
      const results = [];
      console.log(`Current working directory: ${process.cwd()}`);

      const filePath = path.join(
        __dirname,
        '..',
        'population-and-demography.csv',
      );

      console.log(`Looking for file at: ${filePath}`);

      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      });
      dataPopulation = results;

      let nameCountryExcept = [
        'World',
        'Less developed regions',
        'Less developed regions, excluding least developed countries',
        'Asia (UN)',
        'Less developed regions, excluding China',
        'Upper-middle-income countries',
        'More developed regions',
        'Lower-middle-income countries',
        'High-income countries',
        'Europe (UN)',
        'Africa (UN)',
        'Least developed countries',
        'Latin America and the Caribbean (UN)',
        'Northern America (UN)',
        'Low-income countries',
        'Land-locked developing countries (LLDC)',
      ];

      const groupedData = dataPopulation.reduce((acc, obj) => {
        const key = obj['Year'];
        if (!acc[key]) {
          acc[key] = [];
        }
        if (!_.includes(nameCountryExcept, obj['Country name'])) {
          const country = {
            country: obj['Country name'],
            population: obj['Population'],
          };
          acc[key].push(country);
        }
        return acc;
      }, {});

      const getMaxPopulationCountriesPerYear = (
        data: any,
      ): { [year: string]: any[] } => {
        const result: { [year: string]: any[] } = {};

        for (const year in data) {
          const countries = data[year];
          const sortedCountries = countries.sort(
            (a, b) => parseInt(b.population) - parseInt(a.population),
          );
          result[year] = sortedCountries.slice(0, 12);
        }

        return result;
      };

      const topCountriesByYear = getMaxPopulationCountriesPerYear(groupedData);

      return topCountriesByYear;
    } catch (error) {
      console.log(`Error reading JSON file: ${error.message}`);
    }
  }
}
