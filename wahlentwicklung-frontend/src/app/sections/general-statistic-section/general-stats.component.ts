import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../core/services/data/data.service";
import {GeneralElectionData} from "../../core/types/function-types";
import {CountUp} from "countup.js";

@Component({
  selector: 'app-general-stats',
  templateUrl: './general-stats.component.html',
  styleUrls: []
})
export class GeneralStatsComponent implements OnInit {
    electionData: GeneralElectionData | null = null;
    voterTurnout: string | null = null;

    @ViewChild('wahlberechtigte', { static: false }) wahlberechtigteElement: ElementRef | undefined;
    @ViewChild('waehler', { static: false }) waehlerElement: ElementRef | undefined;
    @ViewChild('wahlbeteilligung', { static: false }) wahlbeteilligungElement: ElementRef | undefined;

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

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.dataService.getSelectedWahl().subscribe(wahl => {
            if (wahl) {
                this.getGeneralElectionData(wahl.election_id);
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
          this.createCountUp('wahlberechtigte', this.electionData?.eligible_voters || 0, this.countUpOptions);
          this.createCountUp('waehler', this.electionData?.voters || 0, this.countUpOptions);
          this.createCountUp('wahlbeteilligung', parseFloat(this.voterTurnout || '0'), this.countUpDecimalOptions);
      });
    }


}
