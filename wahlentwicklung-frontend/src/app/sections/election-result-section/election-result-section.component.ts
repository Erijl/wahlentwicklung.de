import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from "../../core/services/data/data.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ConverterService } from "../../core/services/converter/converter.service";
import { PartyElectionResult } from "../../core/types/common-types";

@Component({
  selector: 'app-wahl-result',
  templateUrl: './election-result-section.component.html',
  styleUrls: []
})
export class ElectionResultSectionComponent implements OnInit {
  electionResultData: PartyElectionResult[] = [];
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
    this.barChartColorScheme = this.converterService.convertElectionResultToColorScheme(this.electionResultData);
    /*
    Assigning separate colors to the 2d grouped bar chart does not work, since the only format supported is
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
      this.chartData = this.electionResultData.slice(0, 6).map((item) => ({
        name: item.partyName,
        value: item.totalVotesSecondaryPercentage,
      }));
    } else if (this.chartMode === 'erststimmen') {
      // Map the fields for Erststimmen mode
      this.chartData = this.electionResultData.slice(0, 6).map((item) => ({
        name: item.partyName,
        value: item.totalVotesPrimaryPercentage,
      }));
    } else if (this.chartMode === 'grouped') {
      // Create a grouped dataset by mapping both fields
      this.chartData = this.electionResultData.slice(0, 6).map((item) => ({
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


  ngOnInit(): void {
    this.dataService.getSelectedElection().subscribe(election => {
      if (election) {
        this.getResultData(election.electionId);
      }
    });

    this.chartData = this.electionResultData.slice(0, 6).map((item) => ({
      name: item.partyName,
      value: item.totalVotesSecondaryPercentage,
    }));
    this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource(this.electionResultData);
    this.dataSource.sort = this.sort;
  }

  getResultData(electionId: number) {
    this.dataService.getElectionResult(electionId).subscribe(result => {
      this.electionResultData = result
      this.dataSource = new MatTableDataSource(this.electionResultData);

      this.chartData = this.electionResultData.slice(0, 6).map((item) => ({
        name: item.partyName,
        value: item.totalVotesSecondaryPercentage,
      }));

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.chartMode = this.chartModes[0];
      this.currentChartModeIndex = 0;

      this.setCustomColorScheme();
    });
  }
}
