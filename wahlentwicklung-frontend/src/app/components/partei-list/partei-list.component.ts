import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";

@Component({
  selector: 'app-partei-list',
  templateUrl: './partei-list.component.html',
  styleUrls: ['./partei-list.component.css']
})
export class ParteiListComponent implements OnInit {
  parteien: any[] = []; // Replace with your data
  starredPartei: any = null;

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
  starPartei(partei: any) {
    // Handle starring and local storage here
    this.starredPartei = partei;
  }
}
