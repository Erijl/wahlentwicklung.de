import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { State, Party, Election, District } from "../../types/common-types";
import { BehaviorSubject, catchError, Observable, of, tap } from "rxjs";
import { GeneralElectionData, ElectionResult } from "../../types/function-types";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // @ts-ignore
  private selectedElection = new BehaviorSubject<Election>(null);

  private dataUrl = 'https://api.wahlentwicklung.de/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'origin'})
  };

  constructor(private http: HttpClient) {
  }

  setSelectedElection(wahl: Election) {
    this.selectedElection.next(wahl);
  }

  getSelectedElection() {
    return this.selectedElection.asObservable();
  }

  getStates() {
    return this.http.get<State[]>(this.dataUrl + 'bundeslaender')
      .pipe(
        tap(_ => this.log('fetched Bundeslaender')),
        catchError(this.handleError<State[]>('getBundeslaender', []))
      );
  }

  getStateResult(wahlId: number, bundeslandId: number) {
    return this.http.get<District[]>(`${this.dataUrl}bundesland/result/${wahlId}/${bundeslandId}`)
      .pipe(
        tap(_ => this.log('fetched Wahlkreise')),
        catchError(this.handleError<District[]>('getWahlkreise', []))
      );
  }

  getElections() {
    return this.http.get<Election[]>(this.dataUrl + 'wahlen')
      .pipe(
        tap(_ => this.log('fetched Wahlen')),
        catchError(this.handleError<Election[]>('getWahlen', []))
      );
  }

  getParties() {
    return this.http.get<Party[]>(this.dataUrl + 'parteien')
      .pipe(
        tap(_ => this.log('fetched Parteien')),
        catchError(this.handleError<Party[]>('getParteien', []))
      );
  }

  getElectionResult(id: number) {
    return this.http.get<ElectionResult[]>(this.dataUrl + 'wahl/result/' + id)
      .pipe(
        tap(_ => this.log('fetched wahlResult')),
        catchError(this.handleError<ElectionResult[]>('wahlResult', []))
      );
  }

  getGeneralElectionData(id: number) {
    return this.http.get<GeneralElectionData[]>(this.dataUrl + 'wahl/general/' + id)
      .pipe(
        tap(_ => this.log('fetched GeneralElectionData')),
        catchError(this.handleError<GeneralElectionData[]>('generalElectionData', []))
      );
  }

  /**
   * Handle a Http operation that failed, without crashing the app.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO refactor
      console.error(error); // log to console instead

      // TODO refactor
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`DEBUG: ${message}`);
  }
}
