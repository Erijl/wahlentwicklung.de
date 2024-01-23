import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../core/services/data/data.service";
import {ElectionResult} from "../../core/types/function-types";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ConverterService} from "../../core/services/converter/converter.service";
import {defaultColorScheme} from "../../core/data/color";

@Component({
  selector: 'app-wahl-result',
  templateUrl: './wahl-result.component.html',
  styleUrls: []
})
export class WahlResultComponent implements OnInit {
  wahlResultData: ElectionResult[] = [];
  chartModes: string[] = ['zweitstimmen', 'erststimmen', 'grouped'];
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
  chartData: any[] = [];

  barChartColorScheme: any[] = [];
  barChart2DColorScheme: any[] = [];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService, private converterService: ConverterService) {
  }

  setCustomColorScheme() {
    this.barChartColorScheme = this.converterService.convertWahlResultToColorScheme(this.wahlResultData);
    /*
    Assigning seperate colors to the 2d bar chart does not work, since the only format supported is
      { name: 'Erststimme', value: '#E5FF36' },
      { name: 'Zweitstimmen', value: '#4E39B4' },

     and if you were to individualize the column names, the chart would break and not display them correctly. Example:
      { name: 'Erststimmen (CDU)', value: '#E5FF36' },
      { name: 'Zweitstimmen (CDU)', value: '#4E39B4' },
      ....
     */
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
        name: item.party_name,
        value: item.percentage_of_votes_secondary,
      }));
    } else if (this.chartMode === 'erststimmen') {
      // Map the fields for Erststimmen mode
      this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
        name: item.party_name,
        value: item.percentage_of_votes_primary,
      }));
    } else if (this.chartMode === 'grouped') {
      // Create a grouped dataset by mapping both fields
      this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
        name: item.party_name,
        series: [
          {
            name: `Zweitstimmen`,
            value: item.percentage_of_votes_secondary,
          },
          {
            name: `Erststimmen`,
            value: item.percentage_of_votes_primary,
          }],
      }));
    }
  }


  ngOnInit(): void {
    this.dataService.getSelectedWahl().subscribe(wahl => {
      if (wahl) {
        this.getResultData(wahl.election_id);
      }
    });

    this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
      name: item.party_name,
      value: item.percentage_of_votes_secondary,
    }));
    this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource(this.wahlResultData);
    this.dataSource.sort = this.sort;
  }

  getResultData(wahlId: number) {
    this.dataService.getWahlResult(wahlId).subscribe(result => {
      this.wahlResultData = result
      this.dataSource = new MatTableDataSource(this.wahlResultData);

      this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
        name: item.party_name,
        value: item.percentage_of_votes_secondary,
      }));

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.chartMode = this.chartModes[0];
      this.currentChartModeIndex = 0;

      this.setCustomColorScheme();
    });
  }
}
