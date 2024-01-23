import { Injectable } from '@angular/core';
import { ElectionResult } from "../../types/function-types";
import { defaultColorScheme } from "../../data/color";

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() {
  }

  convertWahlResultToColorScheme(sortedWahlResult: ElectionResult[]) {
    let colorScheme = [];
    let nullColors = 0;
    for (const wahlResult of sortedWahlResult) {
      colorScheme.push({
        'name': wahlResult.party_name,
        'value': wahlResult.color_hex || defaultColorScheme[(nullColors++) % defaultColorScheme.length]
      });
    }

    return colorScheme;
  }
}
