import {Component, OnInit} from '@angular/core';
import {DataService} from "../../core/services/data/data.service";
import {Bundesland} from "../../core/types/common-types";

@Component({
  selector: 'app-bundeslaender-list',
  templateUrl: './bundeslaender-list.component.html',
  styleUrls: []
})
export class BundeslaenderListComponent implements OnInit {
  bundeslaender: Bundesland[] = [];
  starredBundesland: Bundesland | null = null;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.getBundeslaender();
  }

  getBundeslaender(): void {
    this.dataService.getBundeslaender().subscribe(bundeslaender => {
      this.bundeslaender = bundeslaender;
      console.log(bundeslaender);
    });
  }

  starBundesland(bundesland: Bundesland) {
    // Handle starring and local storage here
    this.starredBundesland = bundesland;
  }
}
