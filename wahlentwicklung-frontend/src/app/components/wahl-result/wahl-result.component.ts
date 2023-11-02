import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../core/services/data/data.service";
import {WahlResult} from "../../core/types/function-types";
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
  wahlResultData: WahlResult[] = [];
  displayedColumns: string[];
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
    this.displayedColumns = [
      'partei_name',
      'total_votes_erststimmen',
      'percentage_of_votes_erststimmen',
      'total_votes_zweitstimmen',
      'percentage_of_votes_zweitstimmen',
    ];
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


  onSortChange(event: any) {
    const data = this.wahlResultData.slice(); // Create a shallow copy of the data array

    if (!event.active || event.direction === '') {
      this.dataSource.data = data;
      return;
    }

    const isAsc = event.direction === 'asc';
    switch (event.active) {
      case 'partei_name':
        data.sort((a, b) => this.compare(a.partei_name, b.partei_name, isAsc));
        break;
      case 'total_votes_erststimmen':
        data.sort((a, b) => this.compare(a.total_votes_erststimmen, b.total_votes_erststimmen, isAsc));
        break;
      case 'percentage_of_votes_erststimmen':
        data.sort((a, b) => this.compare(a.percentage_of_votes_erststimmen, b.percentage_of_votes_erststimmen, isAsc));
        break;
      case 'total_votes_zweitstimmen':
        data.sort((a, b) => this.compare(a.total_votes_zweitstimmen, b.total_votes_zweitstimmen, isAsc));
        break;
      case 'percentage_of_votes_zweitstimmen':
        data.sort((a, b) => this.compare(a.percentage_of_votes_zweitstimmen, b.percentage_of_votes_zweitstimmen, isAsc));
        break;
      default:
        break;
    }

    this.dataSource.data = data;
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngOnInit(): void {
    this.dataService.getSelectedWahl().subscribe(wahl => {
      if (wahl) {
        this.getResultData(wahl.wahl_id);
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

  getResultData(wahlId: number) {
    this.dataService.getWahlResult(wahlId).subscribe(result => {
      this.wahlResultData = result
      this.dataSource = new MatTableDataSource(this.wahlResultData);

      this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
        name: item.partei_name,
        value: item.percentage_of_votes_zweitstimmen,
      }));

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.chartMode = this.chartModes[0];
      this.currentChartModeIndex = 0;

      this.setCustomColorScheme();
    });
  }
}
