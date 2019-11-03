
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Event } from './event';

import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class EventService {

  private eventsUrl = 'http://localhost:8080/events'; // url to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {
  }

  /** GET events from server */
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.eventsUrl)
      .pipe(
        tap(_ => this.log('fetched events')),
        catchError(this.handleError<Event[]>('getEvents', []))
      );
  }


  /** GET event by id. Return `undefined` when id not found */
  getEventNo404<Data>(id: number): Observable<Event> {
    const url = `${this.eventsUrl}/?id=${id}`;
    return this.http.get<Event[]>(url)
      .pipe(
        map(events => events[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} event id=${id}`);
        }),
        catchError(this.handleError<Event>(`getEvent id=${id}`))
      );
  }

  /** GET event by id. Will 404 if id not found */
  getEvent(id: number): Observable<Event> {
    const url = `${this.eventsUrl}/${id}`;
    return this.http.get<Event>(url).pipe(
      tap(_ => this.log(`fetched event id=${id}`)),
      catchError(this.handleError<Event>(`getEvent id=${id}`))
      /*.catch(error => Oberservable.throw(error.json()));*/
    );
  }

  /** GET event by state. Will 404 if id not found */
  getEventState(state: string): Observable<Event> {
    const url = `${this.eventsUrl}/${state}`;
    return this.http.get<Event>(url).pipe(
      tap(_ => this.log(`fetched event state=${state}`)),
      catchError(this.handleError<Event>(`getEvent state=${state}`))
    );
  }

  getEventZip(zip: number): Observable<Event> {
    const url = `${this.eventsUrl}/${zip}`;
    return this.http.get<Event>(url).pipe(
      tap(_ => this.log(`fetched event zip=${zip}`)),
      catchError(this.handleError<Event>(`getEvent zip=${zip}`))
    );
  }

  /** GET events whose name contains search term */
  searchEvents(term: string): Observable<Event[]> {
    if (!term.trim()) {
      // if not search term, return empty event array.
      return of([]);
    }
    return this.http.get<Event[]>(`${this.eventsUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found events matching "${term}"`)),
      catchError(this.handleError<Event[]>('searchEvents', []))
    );
  }

  /** POST: add a new event to the server */
  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.eventsUrl, event, httpOptions).pipe(
      tap((newEvent: Event) => this.log(`added event w/ id=${newEvent.id}`)),
      catchError(this.handleError<Event>('addEvent'))
    );
  }

  /** DELETE: delete the event from the server */
  deleteEvent(event: Event | number): Observable<Event> {
    const id = typeof event === 'number' ? event : event.id;
    const url = `${this.eventsUrl}/${id}`;

    return this.http.delete<Event>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted event id=${id}`)),
      catchError(this.handleError<Event>('deleteEvent'))
    );
  }

  /** PUT: update the event on the server */
  updateEvent(event: Event): Observable<any> {
    return this.http.put(this.eventsUrl, event, httpOptions).pipe(
      tap(_ => this.log(`updated event id=${event.id}`)),
      catchError(this.handleError<any>('updateEvent'))
    );
  }



  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a eventService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`EventService: ${message}`);
  }
}
