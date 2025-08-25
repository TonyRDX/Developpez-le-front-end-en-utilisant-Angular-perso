import { Component, computed, inject, Signal, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { OlympicService } from 'src/app/core/services/olympic.service';
import type { Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from 'src/app/components/pie-chart/pie-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PieChartComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private olympicService: OlympicService = inject(OlympicService);
  private router: Router = inject(Router);

  public readonly isLoading = this.olympicService.isLoading;
  public readonly hasFailed = this.olympicService.hasFailed;
  public readonly isRetrying = this.olympicService.isRetrying;
  private error = signal<string | null>(null);
  // TODO move it on the html side ?
  public readonly displayedMessage = computed(() => (
                                                      !this.isRetrying() && this.hasFailed()) ? "Loading failed. Please reload later." :
                                                      this.isRetrying() ? "Retrying. Should take some seconds." : ""
                                                    );

  public olympics$ = this.olympicService.getOlympics().pipe(
    catchError(() => {
      this.error.set('Oups, impossible de charger les données.');
      return of([] as Olympic[]);
    }),
    finalize(() => this.isLoading.set(false))
  );
  public olympics: Signal<Olympic[]> = toSignal(this.olympics$, { initialValue: [] });

  onSelectedOlympic(olympic: Olympic): void {
    this.router.navigate([`/details/${olympic.country}`]); 
  }

  get countryNumber(): number {
    return this.olympics().length;
  };

  // detect if not all country participated on a year
  get joNumber(): number {
    return new Set(
      this.olympics()
        .map((country) => country.participations.map(p => p.id))
        .reduce((acc, val) => acc.concat(val), [])
    ).size;
  }
}