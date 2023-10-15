import {Component, OnInit} from '@angular/core';
import {Bundesland} from "../core/types/common-types";
import {DataService} from "../data.service";

@Component({
  selector: 'app-test-site',
  templateUrl: './test-site.component.html',
  styleUrls: ['./test-site.component.css']
})
export class TestSiteComponent implements OnInit {
  bundeslaender: Bundesland[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getBundeslaender();
  }

  getBundeslaender(): void {
    this.dataService.getBundeslaender().subscribe(bundeslaender => {
      this.bundeslaender = bundeslaender;
      console.log(bundeslaender);
    });
  }

}
