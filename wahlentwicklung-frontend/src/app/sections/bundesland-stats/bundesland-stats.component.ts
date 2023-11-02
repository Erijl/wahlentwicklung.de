import {Component, OnInit} from '@angular/core';
import {DataService} from "../../core/services/data/data.service";
import {ConverterService} from "../../core/services/converter/converter.service";
import {Wahl} from "../../core/types/common-types";

@Component({
  selector: 'app-bundesland-stats',
  templateUrl: './bundesland-stats.component.html',
  styleUrls: []
})
export class BundeslandStatsComponent implements OnInit {
  bundeslaender: any[] = [];
  selectedBundesland: any = null;
  barChartColorScheme: any[] = [];
  chartData: any[] = [];
  wahl: Wahl | null = null;

  chartConfig: any = {
    view: [700, 400],
    scheme: 'vivid',
    secondScheme: 'forest',
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Partei',
    showYAxisLabel: true,
    yAxisLabel: 'Zweitstimmen %',
    legendTitle: 'Legende',
  };

  constructor(private dataService: DataService, private converterService: ConverterService) { }

  ngOnInit(){
    this.dataService.getSelectedWahl().subscribe(wahl => {
      if (wahl) {
        this.getData(wahl.wahl_id);
        this.wahl = wahl;
      }
    });
  }

  onBundeslandSelect() {
    this.getBundeslandResult(this.wahl!.wahl_id, this.selectedBundesland.bundesland_id)
  }

  getData(wahlId: number) {
    this.dataService.getBundeslaender().subscribe((data: any) => {
      this.bundeslaender = data;
      this.selectedBundesland = this.bundeslaender[0];
        this.getBundeslandResult(wahlId, this.selectedBundesland.bundesland_id);
    });
  }

  getBundeslandResult(wahlId: number, bundeslandId: number) {
    this.dataService.getBundeslandResult(wahlId, bundeslandId).subscribe((data: any) => {
      this.chartData = data;
      this.barChartColorScheme = this.converterService.convertWahlResultToColorScheme(this.chartData);
    });
  }



}
