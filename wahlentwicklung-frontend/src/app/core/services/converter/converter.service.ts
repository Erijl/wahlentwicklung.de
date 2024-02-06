import { Injectable } from '@angular/core';
import { defaultColorScheme } from "../../data/color";
import { PartyElectionResult } from "../../types/common-types";

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() {
  }

  convertElectionResultToColorScheme(sortedElectionResult: PartyElectionResult[]) {
    let colorScheme = [];
    let nullColors = 0;
    for (const electionResult of sortedElectionResult) {
      colorScheme.push({
        'name': electionResult.partyName,
        'value': electionResult.colorHex || defaultColorScheme[(nullColors++) % defaultColorScheme.length]
      });
    }

    return colorScheme;
  }
}
