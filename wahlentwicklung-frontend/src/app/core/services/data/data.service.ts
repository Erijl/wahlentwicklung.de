import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Bundesland, Partei, Wahl} from "../../types/common-types";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {WahlResult} from "../../types/function-types";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // @ts-ignore
  private selectedWahl = new BehaviorSubject<Wahl>(null);

  private dataUrl = 'http://localhost:8080/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'origin' })
  };

  constructor(private http: HttpClient) { }

  setSelectedWahl(wahl: Wahl) {
    this.selectedWahl.next(wahl);
  }

  getSelectedWahl() {
    return this.selectedWahl.asObservable();
  }

  getBundeslaender() {
    return this.http.get<Bundesland[]>(this.dataUrl + 'bundeslaender')
      .pipe(
        tap(_ => this.log('fetched Bundeslaender')),
        catchError(this.handleError<Bundesland[]>('getBundeslaender', []))
      );
  }

  getWahlen() {
    return this.http.get<Wahl[]>(this.dataUrl + 'wahlen')
        .pipe(
            tap(_ => this.log('fetched Wahlen')),
            catchError(this.handleError<Wahl[]>('getWahlen', []))
        );
  }

  getParteien() {
    return this.http.get<Partei[]>(this.dataUrl + 'parteien')
      .pipe(
        tap(_ => this.log('fetched Parteien')),
        catchError(this.handleError<Partei[]>('getParteien', []))
      );
  }

  getWahlResult(id: number) {
    return this.http.get<WahlResult[]>(this.dataUrl + 'wahl/result/' + id)
      .pipe(
        tap(_ => this.log('fetched wahlResult')),
        catchError(this.handleError<WahlResult[]>('wahlResult', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(`DEBUG: ${message}`);
  }
}
