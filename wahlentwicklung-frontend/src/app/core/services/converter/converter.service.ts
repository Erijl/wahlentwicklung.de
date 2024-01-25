import { Injectable } from '@angular/core';
import { ElectionResult } from "../../types/function-types";
import { defaultColorScheme } from "../../data/color";

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() {
  }

  convertElectionResultToColorScheme(sortedElectionResult: ElectionResult[]) {
    let colorScheme = [];
    let nullColors = 0;
    for (const electionResult of sortedElectionResult) {
      colorScheme.push({
        'name': electionResult.party_name,
        'value': electionResult.color_hex || defaultColorScheme[(nullColors++) % defaultColorScheme.length]
      });
    }

    return colorScheme;
  }
}
