import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  State,
  Party,
  Election,
  ElectionStatistic,
  PartyElectionResult,
  BellwetherState
} from "../../types/common-types";
import { BehaviorSubject, catchError, Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // @ts-ignore
  private selectedElection = new BehaviorSubject<Election>(null);

  //private dataUrl = 'https://api.wahlentwicklung.de/';
  private dataUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {
  }

  setSelectedElection(wahl: Election) {
    this.selectedElection.next(wahl);
  }

  getSelectedElection() {
    return this.selectedElection.asObservable();
  }

  getStates() {
    return this.http.get<State[]>(this.dataUrl + 'state/all')
      .pipe(
        tap(_ => this.log('fetched Bundeslaender')),
        catchError(this.handleError<State[]>('getBundeslaender', []))
      );
  }

  getElections() {
    return this.http.get<Election[]>(this.dataUrl + 'election/all')
      .pipe(
        tap(_ => this.log('fetched Wahlen')),
        catchError(this.handleError<Election[]>('getWahlen', []))
      );
  }

  getElectionResult(id: number) {
    return this.http.get<PartyElectionResult[]>(this.dataUrl + 'election/result?electionId=' + id)
      .pipe(
        tap(_ => this.log('fetched wahlResult')),
        catchError(this.handleError<PartyElectionResult[]>('wahlResult', []))
      );
  }

  getStateElectionResult(electionId: number, stateId: number) {
    return this.http.get<PartyElectionResult[]>(this.dataUrl + 'state/electionresult?electionId=' + electionId + '&stateId=' + stateId)
      .pipe(
        tap(_ => this.log('fetched stateElectionResult')),
        catchError(this.handleError<PartyElectionResult[]>('stateElectionResult', []))
      );
  }

  getGeneralElectionData(id: number) {
    return this.http.get<ElectionStatistic[]>(this.dataUrl + 'election/statistic?electionId=' + id)
      .pipe(
        tap(_ => this.log('fetched GeneralElectionData')),
        catchError(this.handleError<ElectionStatistic[]>('generalElectionData', []))
      );
  }

  getBellwetherState(id: number) {
    return this.http.get<BellwetherState[]>(this.dataUrl + 'state/bellwether?electionId=' + id)
      .pipe(
        tap(_ => this.log('fetched getBellwetherState')),
        catchError(this.handleError<BellwetherState[]>('getBellwetherState', []))
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
