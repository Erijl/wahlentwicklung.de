import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from "../../core/services/data/data.service";
import { GeneralElectionData } from "../../core/types/function-types";
import { CountUp } from "countup.js";

@Component({
  selector: 'app-general-stats',
  templateUrl: './general-statistic-section.html',
  styleUrls: []
})
export class GeneralStatisticSection implements OnInit {
  electionData: GeneralElectionData | null = null;
  voterTurnout: string | null = null;

  @ViewChild('eligible_voters', {static: false}) eligibleVotersElement: ElementRef | undefined;
  @ViewChild('voters', {static: false}) votersElement: ElementRef | undefined;
  @ViewChild('voter_turnout', {static: false}) voterTurnoutElement: ElementRef | undefined;

  countUpOptions = {
    duration: 2,
    separator: ',',
  };

  countUpDecimalOptions = {
    duration: 2,
    separator: ',',
    decimalPlaces: 1,
    suffix: '%'
  };

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getSelectedElection().subscribe(election => {
      if (election) {
        this.getGeneralElectionData(election.election_id);
      }
    });
  }

  private createCountUp(elementId: string, targetValue: number, options: {}) {
    // @ts-ignore
    const element = this[elementId + 'Element'].nativeElement;
    const countUp = new CountUp(element, targetValue, options);
    if (!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }
  }

  getGeneralElectionData(id: number) {
    this.dataService.getGeneralElectionData(id).subscribe((data: any) => {
      this.electionData = data;
      this.voterTurnout = ((this.electionData!.voters / this.electionData!.eligible_voters) * 100).toFixed(1);
      this.createCountUp('eligible_voters', this.electionData?.eligible_voters || 0, this.countUpOptions);
      this.createCountUp('voters', this.electionData?.voters || 0, this.countUpOptions);
      this.createCountUp('voter_turnout', parseFloat(this.voterTurnout || '0'), this.countUpDecimalOptions);
    });
  }


}
