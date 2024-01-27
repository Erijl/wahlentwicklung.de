import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { State, Party, Election, ElectionStatistic, PartyElectionResult } from "../../types/common-types";
import { BehaviorSubject, catchError, Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // @ts-ignore
  private selectedElection = new BehaviorSubject<Election>(null);

  private dataUrl = 'https://api.wahlentwicklung.de/';

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

  getParties() {
    return this.http.get<Party[]>(this.dataUrl + 'party/all')
      .pipe(
        tap(_ => this.log('fetched Parteien')),
        catchError(this.handleError<Party[]>('getParteien', []))
      );
  }

  getElectionResult(id: number) {
    return this.http.get<PartyElectionResult[]>(this.dataUrl + 'election/result?electionId=' + id)
      .pipe(
        tap(_ => this.log('fetched wahlResult')),
        catchError(this.handleError<PartyElectionResult[]>('wahlResult', []))
      );
  }

  getGeneralElectionData(id: number) {
    return this.http.get<ElectionStatistic[]>(this.dataUrl + 'election/statistic?electionId=' + id)
      .pipe(
        tap(_ => this.log('fetched GeneralElectionData')),
        catchError(this.handleError<ElectionStatistic[]>('generalElectionData', []))
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
