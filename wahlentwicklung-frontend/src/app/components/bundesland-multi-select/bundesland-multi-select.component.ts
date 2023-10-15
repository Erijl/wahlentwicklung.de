import {Component, OnInit} from '@angular/core';
import {Bundesland} from "../../core/types/common-types";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {DataService} from "../../core/services/data/data.service";

@Component({
  selector: 'app-bundesland-multi-select',
  templateUrl: './bundesland-multi-select.component.html',
  styleUrls: []
})
export class BundeslandMultiSelectComponent implements OnInit {

  bundeslaender: Bundesland[] = [];
  selectedBundeslaender: Bundesland[] = [];
  dropdownSettings: IDropdownSettings = {};
  constructor(private dataService: DataService) { }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  ngOnInit(): void {
    this.getBundeslaender();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'bundesland_id',
      textField: 'name',
      selectAllText: 'Alle auswählen',
      unSelectAllText: 'Alle abwählen',
      allowSearchFilter: true,
      searchPlaceholderText: 'Suchen',
      noDataAvailablePlaceholderText: 'Keine Daten verfügbar',
    };
  }

  getBundeslaender(): void {
    this.dataService.getBundeslaender().subscribe(bundeslaender => this.bundeslaender = bundeslaender);
  }
}
