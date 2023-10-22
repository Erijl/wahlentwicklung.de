import {Component, OnInit} from '@angular/core';
import {DataService} from "../../core/services/data/data.service";
import {GeneralElectionData} from "../../core/types/function-types";

@Component({
  selector: 'app-general-stats',
  templateUrl: './general-stats.component.html',
  styleUrls: []
})
export class GeneralStatsComponent implements OnInit{
    electionData: GeneralElectionData | null = null;
    voterTurnout: string | null = null;

    constructor(private dataService: DataService) { }
    ngOnInit(): void {
        this.dataService.getSelectedWahl().subscribe(wahl => {
            if (wahl) {
                this.getGeneralElectionData(wahl.wahl_id);
            }
        });
    }

    getGeneralElectionData(id: number) {
      this.dataService.getGeneralElectionData(id).subscribe((data: any) => {
        this.electionData = data;
        this.voterTurnout = ((this.electionData!.waehler / this.electionData!.wahlberechtigte) * 100).toFixed(1);
      });
    }


}
