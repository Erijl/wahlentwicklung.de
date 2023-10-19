import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../core/services/data/data.service";
import {WahlResult} from "../../core/types/function-types";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-wahl-result',
  templateUrl: './wahl-result.component.html',
  styleUrls: []
})
export class WahlResultComponent implements OnInit {
  wahlResultData: WahlResult[] = [];
  displayedColumns: string[];


  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

    constructor(private dataService: DataService) {
      this.displayedColumns = [
        'partei_name',
        'total_votes_erststimmen',
        'percentage_of_votes_erststimmen',
        'total_votes_zweitstimmen',
        'percentage_of_votes_zweitstimmen',
      ];
    }

  onSortChange(event: any) {
    const data = this.wahlResultData.slice(); // Create a shallow copy of the data array

    if (!event.active || event.direction === '') {
      this.dataSource.data = data;
      return;
    }

    const isAsc = event.direction === 'asc';
    switch (event.active) {
      case 'partei_name':
        data.sort((a, b) => this.compare(a.partei_name, b.partei_name, isAsc));
        break;
      case 'total_votes_erststimmen':
        data.sort((a, b) => this.compare(a.total_votes_erststimmen, b.total_votes_erststimmen, isAsc));
        break;
      case 'percentage_of_votes_erststimmen':
        data.sort((a, b) => this.compare(a.percentage_of_votes_erststimmen, b.percentage_of_votes_erststimmen, isAsc));
        break;
      case 'total_votes_zweitstimmen':
        data.sort((a, b) => this.compare(a.total_votes_zweitstimmen, b.total_votes_zweitstimmen, isAsc));
        break;
      case 'percentage_of_votes_zweitstimmen':
        data.sort((a, b) => this.compare(a.percentage_of_votes_zweitstimmen, b.percentage_of_votes_zweitstimmen, isAsc));
        break;
      default:
        break;
    }

    this.dataSource.data = data;
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

    ngOnInit(): void {
      this.getResultData();
      this.dataSource.paginator = this.paginator;
      this.dataSource = new MatTableDataSource(this.wahlResultData);
      this.dataSource.sort = this.sort;
    }

    getResultData() {
        this.dataService.getWahlResult(21).subscribe(result => {
          console.log('result: ', result);
          this.wahlResultData = result
          this.dataSource = new MatTableDataSource(this.wahlResultData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    }
}
