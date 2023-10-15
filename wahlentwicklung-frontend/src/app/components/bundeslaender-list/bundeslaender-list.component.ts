import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";

@Component({
  selector: 'app-bundeslaender-list',
  templateUrl: './bundeslaender-list.component.html',
  styleUrls: ['./bundeslaender-list.component.css']
})
export class BundeslaenderListComponent implements OnInit {
  bundeslaender: any[] = []; // Replace with your data
  starredBundesland: any = null;

  constructor(private dataService: DataService) {  }

  ngOnInit() {
    this.getBundeslaender();
    }

    getBundeslaender(): void {
        this.dataService.getBundeslaender().subscribe(bundeslaender => {
            this.bundeslaender = bundeslaender;
            console.log(bundeslaender);
        });
    }

  starBundesland(bundesland: any) {
    // Handle starring and local storage here
    this.starredBundesland = bundesland;
  }
}
