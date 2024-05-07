import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
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
      const filePath = 'population-and-demography.csv';
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      });
      dataPopulation = results;
      console.log(dataPopulation);
    } catch (error) {
      console.log(`Error reading JSON file: ${error.message}`);
    }
  }
}
