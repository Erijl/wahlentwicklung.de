import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Bundesland} from "./core/types/bundesland-type";
import {catchError, Observable, of, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'http://localhost:8080/bundeslaender';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'origin' })
  };

  constructor(private http: HttpClient) { }

  getBundeslaender() {
    return this.http.get<Bundesland[]>(this.dataUrl)
      .pipe(
        tap(_ => this.log('fetched Bundeslaender')),
        catchError(this.handleError<Bundesland[]>('getBundeslaender', []))
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
