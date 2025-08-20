import { Component, inject, Signal } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

import { OlympicService } from 'src/app/core/services/olympic.service';
import type { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  private route = inject(ActivatedRoute);
  private olympicService = inject(OlympicService);

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