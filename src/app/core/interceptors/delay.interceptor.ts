import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable, computed } from "@angular/core";
import { Observable, delay, switchMap, of, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { OlympicService } from "../services/olympic.service";

@Injectable()
export class DelayInterceptor implements HttpInterceptor {
  static shouldFail = computed(() => {
                                        return ((OlympicService.tryNumber()) !== environment.failedFetchBeforeSuccess) 
                                                && !environment.production
                                      });

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

