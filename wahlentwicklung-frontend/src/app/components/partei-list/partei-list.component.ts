import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {Partei} from "../../core/types/common-types";

@Component({
  selector: 'app-partei-list',
  templateUrl: './partei-list.component.html',
  styleUrls: ['./partei-list.component.css']
})
export class ParteiListComponent implements OnInit {
  parteien: Partei[] = []; // Replace with your data
  starredPartei: Partei | null = null;

  constructor(private dataService: DataService) {  }

  ngOnInit() {
    this.getParteien();
    }

    getParteien(): void {
        this.dataService.getParteien().subscribe(parteien => {
            this.parteien = parteien;
            console.log(parteien);
        });
    }
  starPartei(partei: Partei) {
    // Handle starring and local storage here
    this.starredPartei = partei;
  }
}
