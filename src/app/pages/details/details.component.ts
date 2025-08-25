import { Component, inject, Signal } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

import { OlympicService } from 'src/app/core/services/olympic.service';
import type { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Participation } from 'src/app/core/models/Participation';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from 'src/app/components/line-chart/line-chart.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, LineChartComponent, RouterModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  private route = inject(ActivatedRoute);
  private olympicService = inject(OlympicService);

  get totalEntries(): number {
    return this.olympic().participations.length;
  }

  get totalMedals(): number {
    return this.olympic().participations.reduce(
      (sum: number, el: Participation) => { return sum + el.medalsCount}, 0
    );
  }

  get totalAthletes(): number {
    return this.olympic().participations.reduce(
      (sum: number, el: Participation) => { return sum + el.athleteCount}, 0
    );
  };

  public olympic: Signal<Olympic> = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('name') ?? ''),          
      switchMap((name) =>
        this.olympicService.getOlympics().pipe(
          map((data) => data?.find((entry: Olympic) => (entry.country.toLowerCase() === name?.toLowerCase())) ?? {id: 0, country:"", participations:[]} )        
       )
      )
    ),
    {initialValue: {id: 0, country: "", participations: []}}
  );
}