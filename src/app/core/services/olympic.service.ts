import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  // TODO check deeply if should add undefined to avoid error trigger when not initialized. Seems unlikely
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null); 

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[] | null>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return of(null);
      })
    );
  }

  getOlympics(): Observable<Olympic[] | null> {
    return (this.olympics$.asObservable() || null);
  }
}
