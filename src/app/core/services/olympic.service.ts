import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, finalize, map, retry, switchMap, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  protected olympicUrl = environment.olympicUrl;
  // TODO check deeply if should add undefined to avoid error trigger when not initialized. Seems unlikely
  protected olympics$ = new BehaviorSubject<Olympic[]>([]); 
  public readonly isLoading = signal(true);
  public readonly hasFailed = signal(false);
  public readonly isRetrying = signal(false);
  public static readonly tryNumber = signal(0);
  protected http = inject(HttpClient);

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap({
        error: () => {this.isRetrying.set(true); 
                    OlympicService.tryNumber.set(OlympicService.tryNumber()+1);
                    console.log(OlympicService.tryNumber());
        }
      }),
      retry(3),
      tap((value) => {
        this.olympics$.next(value);
      }),
      catchError((error) => {
        console.error(error);
        this.hasFailed.set(true);
        return of([]);
      }),
      finalize(() => {
        this.isLoading.set(false);
        this.isRetrying.set(false);
      })
    );
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }
}

@Injectable()
export class DelayInterceptor implements HttpInterceptor {
  static tryNumber = 0;
  static alwaysFail = environment.alwaysFailFetch && !environment.production;
  static shouldFail = computed(() => {return ((OlympicService.tryNumber() % 3) == 0) && !environment.alwaysFailFetch});
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      delay(environment.dataDelay), 
      switchMap((event)=> {
        if (event instanceof HttpResponse) {
          return !DelayInterceptor.shouldFail()
            ? of(event)
            : throwError(() => new HttpErrorResponse({
              status: 503,
              statusText: 'Service Unavailable (simulé)',
              url: req.url
            }));
        }
        return of(event);
      }) 
    );
  }
}

