import { Injectable } from '@angular/core';
import {WahlResult} from "../../types/function-types";
import {defaultColorScheme} from "../../data/color";

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() { }

  convertWahlResultToColorScheme(sortedWahlResult: WahlResult[]) {
    let colorScheme = [];
    let nullColors = 0;
    for(const wahlResult of sortedWahlResult) {
      colorScheme.push({'name': wahlResult.partei_name, 'value': wahlResult.color_hex || defaultColorScheme[(nullColors++) % defaultColorScheme.length]});
    }

    return colorScheme;
  }

  convertWahlResultTo2DColorScheme(sortedWahlResult: WahlResult[]) {
    let colorScheme = [];
    let nullColors = 0;
    for(const wahlResult of sortedWahlResult) {
      colorScheme.push({'name': wahlResult.partei_name, 'series': [
          {'name': `Erststimmen (${wahlResult.partei_name})`, 'value': wahlResult.color_hex || defaultColorScheme[(nullColors++) % defaultColorScheme.length]},
          {'name': `Zweitstimmen (${wahlResult.partei_name})`, 'value': wahlResult.color_hex || defaultColorScheme[(nullColors++) % defaultColorScheme.length]}
        ]});
    }

    return colorScheme;
  }
}
