import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let dataPopulation: any[] = [];
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

      const groupedData = dataPopulation.reduce((acc, obj) => {
        const key = obj['Country name'];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});

      return groupedData;
    } catch (error) {
      console.log(`Error reading JSON file: ${error.message}`);
    }
  }
}
