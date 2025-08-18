import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import type { Olympic } from 'src/app/core/models/Olympic';
import type { Participation } from 'src/app/core/models/Participation';

type ChartData = { name: string; value: number, extra: number };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null); // null could be used to notify error
  public single$: Observable<ChartData[]> = of([]);

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.single$ = this.olympics$.pipe(
      map((list: Olympic[] | null = []) => list?.map((o: Olympic) => this.toChartData(o)) || [])
    );
  }

  view: [number, number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Medals';

  colorScheme = 'cool'; // check values there : https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-vertical

  toChartData(olympic: Olympic): ChartData {
    return {
      "name": olympic.country,
      "value": olympic.participations.reduce((sum: number, participation: Participation) => sum + participation.medalsCount, 0),
      "extra": olympic.id
    };
  }

  // TODO use that event hander to route on the selected country
  onSelect(event: ChartData) {
    console.log(event); 
    console.log(JSON.stringify(event)); 
  }
}