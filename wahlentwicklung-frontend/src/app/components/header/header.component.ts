import {Component, OnInit} from '@angular/core';
import {DataService} from "../../core/services/data/data.service";
import {Bundesland, Wahl} from "../../core/types/common-types";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnInit {
  wahlen: Wahl[] = [];

  selectedMode: string = 'detail'; // Default to 'detail' mode
  firstSelectedWahl: Wahl | null = null;
  secondSelectedWahl: Wahl | null = null;

  constructor(private dataService: DataService) {  }

  onModeChange(value: string) {
    this.selectedMode = value;
  }

  ngOnInit() {
    this.getWahlen();
  }

  getWahlen(): void {
    this.dataService.getWahlen().subscribe(wahlen => {
      this.wahlen = wahlen;
      console.log(wahlen);
    });
  }
}
