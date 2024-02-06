import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from "../../core/services/data/data.service";
import { ConverterService } from "../../core/services/converter/converter.service";
import { Election, PartyElectionResult, State } from "../../core/types/common-types";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: 'app-bundesland-stats',
  templateUrl: './state-statistic-section.component.html',
  styleUrls: []
})
export class StateStatisticSection implements OnInit {
  bundeslaender: any[] = [];
  selectedBundesland: State | null = null;
  wahl: Election | null = null;

  barChartColorScheme: any[] = [];
  chartData: any[] = [];
  wahlResultData: PartyElectionResult[] = [];

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
    this.dataService.getSelectedElection().subscribe(election => {
      if (election) {
        this.getBundeslaenderData(election.electionId);
        this.wahl = election;
      }
    });

    this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
      name: item.partyName,
      value: item.totalVotesSecondaryPercentage,
    }));
    this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource(this.wahlResultData);
    this.dataSource.sort = this.sort;
  }

  setCustomColorScheme() {
    this.barChartColorScheme = this.converterService.convertElectionResultToColorScheme(this.wahlResultData);
    //Assigning seperate colors to the 2d bar chart does not work, see election-result-section.component.ts for reference
  }

  onBundeslandSelect() {
    // @ts-ignore
    this.getResultData(this.wahl!.electionId, this.selectedBundesland.stateId)
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
        name: item.partyName,
        value: item.totalVotesSecondaryPercentage,
      }));
    } else if (this.chartMode === 'erststimmen') {
      // Map the fields for Erststimmen mode
      this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
        name: item.partyName,
        value: item.totalVotesPrimaryPercentage,
      }));
    } else if (this.chartMode === 'grouped') {
      // Create a grouped dataset by mapping both fields
      this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
        name: item.partyName,
        series: [
          {
            name: `Zweitstimmen`,
            value: item.totalVotesSecondaryPercentage,
          },
          {
            name: `Erststimmen`,
            value: item.totalVotesPrimaryPercentage,
          }],
      }));
    }
  }

  getBundeslaenderData(electionId: number) {
    this.dataService.getStates().subscribe((data: any) => {
      this.bundeslaender = data;
      this.selectedBundesland = this.bundeslaender[0];
      // @ts-ignore
      this.getResultData(electionId, this.selectedBundesland.stateId);
    });
  }

  getResultData(electionId: number, stateId: number) {
    //this.dataService.getStateResult(electionId, stateId).subscribe((data: any) => {
    //  this.wahlResultData = data;
    //  this.dataSource = new MatTableDataSource(this.wahlResultData);
//
    //  this.chartData = this.wahlResultData.slice(0, 6).map((item) => ({
    //    name: item.partyName,
    //    value: item.totalVotesSecondaryPercentage,
    //  }));
    //  console.log(this.chartData)
//
    //  this.dataSource.paginator = this.paginator;
    //  this.dataSource.sort = this.sort;
//
    //  this.chartMode = this.chartModes[0];
    //  this.currentChartModeIndex = 0;
//
    //  this.setCustomColorScheme();
    //});
  }


}
