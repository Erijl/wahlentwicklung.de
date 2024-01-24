import { Component, OnInit } from '@angular/core';
import { Election } from "../../core/types/common-types";
import { DataService } from "../../core/services/data/data.service";

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: []
})
export class HeroComponent implements OnInit {
  elections: Election[] = [];
  selectedElection: Election | null = null;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.getElections();
  }

  onElectionChange() {
    this.dataService.setSelectedElection(this.selectedElection!);
  }

  getElections(): void {
    this.dataService.getElections().subscribe(elections => {
      this.elections = elections;

      this.selectedElection = this.elections[0];
      this.dataService.setSelectedElection(this.selectedElection!);
    });
  }

}
