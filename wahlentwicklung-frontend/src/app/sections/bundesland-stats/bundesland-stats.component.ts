import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../core/services/data/data.service";
import {ConverterService} from "../../core/services/converter/converter.service";
import {Wahl} from "../../core/types/common-types";
import {MatTableDataSource} from "@angular/material/table";
import {WahlResult} from "../../core/types/function-types";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-bundesland-stats',
  templateUrl: './bundesland-stats.component.html',
  styleUrls: []
})
export class BundeslandStatsComponent implements OnInit {
  bundeslaender: any[] = [];
  selectedBundesland: any = null;
  wahl: Wahl | null = null;

  barChartColorScheme: any[] = [];
  chartData: any[] = [];
  wahlResultData: WahlResult[] = [];

  chartModes: string[] = ['zweitstimmen', 'erststimmen'];
  currentChartModeIndex: number = 0;
  chartMode: string = this.chartModes[this.currentChartModeIndex];

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

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService, private converterService: ConverterService) {
  }

  ngOnInit() {
    this.dataService.getSelectedWahl().subscribe(wahl => {
      if (wahl) {
        this.getBundeslaenderData(wahl.wahl_id);
        this.wahl = wahl;
      }
    });

    this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
      name: item.partei_name,
      value: item.percentage_of_votes_zweitstimmen,
    }));
    this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource(this.wahlResultData);
    this.dataSource.sort = this.sort;
  }

  setCustomColorScheme() {
    this.barChartColorScheme = this.converterService.convertWahlResultToColorScheme(this.wahlResultData);
    //Assigning seperate colors to the 2d bar chart does not work, see wahl-result.component.ts for reference
  }

  onBundeslandSelect() {
    this.getResultData(this.wahl!.wahl_id, this.selectedBundesland.bundesland_id)
  }

  cycleChartMode() {
    // Cycle through the chart modes
    this.currentChartModeIndex = (this.currentChartModeIndex + 1) % this.chartModes.length;
    this.chartMode = this.chartModes[this.currentChartModeIndex];
    this.updateChartData();
  }

  updateChartData() {
    if (this.chartMode === 'zweitstimmen') {
      // Map the fields for Zweitstimmen mode
      this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
        name: item.partei_name,
        value: item.percentage_of_votes_zweitstimmen,
      }));
    } else if (this.chartMode === 'erststimmen') {
      // Map the fields for Erststimmen mode
      this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
        name: item.partei_name,
        value: item.percentage_of_votes_erststimmen,
      }));
    } else if (this.chartMode === 'grouped') {
      // Create a grouped dataset by mapping both fields
      this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
        name: item.partei_name,
        series: [
          {
            name: `Zweitstimmen`,
            value: item.percentage_of_votes_zweitstimmen,
          },
          {
            name: `Erststimmen`,
            value: item.percentage_of_votes_erststimmen,
          }],
      }));
    }
  }

  getBundeslaenderData(wahlId: number) {
    this.dataService.getBundeslaender().subscribe((data: any) => {
      this.bundeslaender = data;
      this.selectedBundesland = this.bundeslaender[0];
      this.getResultData(wahlId, this.selectedBundesland.bundesland_id);
    });
  }

  getResultData(wahlId: number, bundeslandId: number) {
    this.dataService.getBundeslandResult(wahlId, bundeslandId).subscribe((data: any) => {
      this.wahlResultData = data;
      this.dataSource = new MatTableDataSource(this.wahlResultData);

      this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
        name: item.partei_name,
        value: item.percentage_of_votes_zweitstimmen,
      }));
      console.log(this.chartData)

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.chartMode = this.chartModes[0];
      this.currentChartModeIndex = 0;

      this.setCustomColorScheme();
    });
  }


}