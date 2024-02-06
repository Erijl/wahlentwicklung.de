import {Component, OnInit, ViewChild} from '@angular/core';
import {BellwetherState, Election, PartyElectionResult, State} from "../../core/types/common-types";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DataService} from "../../core/services/data/data.service";
import {ConverterService} from "../../core/services/converter/converter.service";

@Component({
  selector: 'app-bellwether-state-section',
  templateUrl: './bellwether-state-section.component.html',
  styleUrls: []
})
export class BellwetherStateSectionComponent implements OnInit {
  election: Election | null = null;
  bellwetherStates: BellwetherState[] | null = null;
  electionResultData: PartyElectionResult[] = [];
  stateElectionResultData: PartyElectionResult[] = [];

  selectedBellwetherState: BellwetherState | null = null;

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
  }

  ngOnInit(): void {
    this.dataService.getSelectedElection().subscribe(election => {
      if (election) {
        this.getBellwetherData(election.electionId);
        this.election = election;
      }
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource(this.electionResultData);
    this.dataSource.sort = this.sort;
  }

  updateChartData(): void {
    let partyElectionResult: PartyElectionResult | undefined;
    let entry: any;

    let updatedChartData: any[] = [];
    this.stateElectionResultData.forEach((partyStateResult) => {
      partyElectionResult = this.electionResultData.find(partyElectionResult => partyElectionResult.partyName === partyStateResult.partyName);
      if (partyElectionResult) {
        entry = {
          name: partyStateResult.partyName,
          series: [
            {
              name: `Wahlergebnis`,
              value: partyElectionResult.totalVotesSecondaryPercentage,
            },
            {
              name: `Bundeslandergebnis`,
              value: partyStateResult.totalVotesSecondaryPercentage,
            }],
        };
        console.log(entry);
        updatedChartData.push(entry);
      }
    });

    this.chartData = updatedChartData;
  }

  onBellwetherStateChange() {
    // @ts-ignore
    this.getStateElectionResultData(this.selectedBellwetherState.state.stateId, this.election.electionId);
  }

  //TODO cleanup all async calls global
  //TODO remove hard slices global
  getBellwetherData(electionId: number) {
    this.dataService.getBellwetherState(electionId).subscribe(result => {
      if(result.length > 0) {
        this.bellwetherStates = result.sort((a, b) => a.percentageDifference - b.percentageDifference);
        this.selectedBellwetherState = this.bellwetherStates[0];

        this.getElectionResultData(electionId);
        this.getStateElectionResultData(result[0].state.stateId, electionId);

        this.setCustomColorScheme();
      }
    });
  }

  getElectionResultData(electionId: number) {
    this.dataService.getElectionResult(electionId).subscribe(result => {
      this.electionResultData = result;
      this.updateChartData();
    });
  }

  getStateElectionResultData(stateId: number, electionId: number) {
    this.dataService.getStateElectionResult(electionId, stateId).subscribe(result => {
      this.stateElectionResultData = result;
      this.updateChartData();
    });
  }
}
