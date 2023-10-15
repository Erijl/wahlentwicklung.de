import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {Wahl} from "../../core/types/common-types";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  wahlen: Wahl[] = [];
  selectedWahl: Wahl | null = null;

  constructor(private dataService: DataService) {  }

  ngOnInit() {
    this.getWahlen();
  }

  getWahlen(): void {
    this.dataService.getWahlen().subscribe(wahlen => {
      this.wahlen = wahlen;
      console.log(wahlen);
    });
  }
  onWahlChange(value: Wahl | null) {
    this.selectedWahl = value;
  }
}
