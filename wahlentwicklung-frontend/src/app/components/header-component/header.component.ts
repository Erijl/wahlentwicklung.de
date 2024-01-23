import { Component } from '@angular/core';
import { DataService } from "../../core/services/data/data.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent {

  constructor(private dataService: DataService) {
  }
}
