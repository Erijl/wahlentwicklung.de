import {Component, OnInit} from '@angular/core';
import {Bundesland, Partei} from "../../core/types/common-types";
import {DataService} from "../../core/services/data/data.service";
import {IDropdownSettings} from "ng-multiselect-dropdown";

@Component({
  selector: 'app-partei-multi-select',
  templateUrl: './partei-multi-select.component.html',
  styleUrls: ['./partei-multi-select.component.css']
})
export class ParteiMultiSelectComponent implements OnInit {
  parteien: Partei[] = [];
  selectedParteien: Bundesland[] = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(private dataService: DataService) {  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  ngOnInit() {
    this.getParteien();

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

  getParteien(): void {
    this.dataService.getParteien().subscribe(parteien => this.parteien = parteien.splice(0, 7));
  }

}
