import { Component, inject, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { OlympicService } from 'src/app/core/services/olympic.service';
import type { Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private olympicService: OlympicService = inject(OlympicService);
  private router: Router = inject(Router);

  private loading = signal(true);
  private error = signal<string | null>(null);

  public olympics$ = this.olympicService.getOlympics().pipe(
    catchError(() => {
      this.error.set('Oups, impossible de charger les données.');
      return of([] as Olympic[]);
    }),
    finalize(() => this.loading.set(false))
  );
  public olympics = toSignal(this.olympics$, { initialValue: [] });

  onSelectedOlympic(olympic: Olympic): void {
    this.router.navigate([`/details/${olympic.country}`]); 
  }
}