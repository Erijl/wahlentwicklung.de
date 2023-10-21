import {Component, OnInit} from '@angular/core';
import {Wahl} from "../../core/types/common-types";
import {DataService} from "../../core/services/data/data.service";

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: []
})
export class HeroComponent implements OnInit {
  wahlen: Wahl[] = [];
  selectedWahl: Wahl | null = null;

  constructor(private dataService: DataService) {  }

  ngOnInit() {
    this.getWahlen();
  }

  onWahlChange() {
    this.dataService.setSelectedWahl(this.selectedWahl!);
  }

  getWahlen(): void {
    this.dataService.getWahlen().subscribe(wahlen => {
      this.wahlen = wahlen;

      this.selectedWahl = this.wahlen[0];
      this.dataService.setSelectedWahl(this.selectedWahl!);
    });
  }

}
