import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { OlympicService } from 'src/app/core/services/olympic.service';
import type { Olympic } from 'src/app/core/models/Olympic';
import type { Participation } from 'src/app/core/models/Participation';
import { ActivatedRoute } from '@angular/router';

type ChartData = { name: string; series: ParticipationChartData[]};
type ParticipationChartData = { name: string; value: number};

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  public olympics$: Observable<Olympic[] | null> = of(null); // null could be used to notify error
  public multi$: Observable<ChartData> = of({"name":"", "series": []});

  constructor(private olympicService: OlympicService, private route: ActivatedRoute) {}

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef<HTMLDivElement>;
  view: [number, number] = [0, 0];
  private ro?: ResizeObserver;

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      this.updateViewSize();
    });

    this.ro = new ResizeObserver(() => {
      this.updateViewSize();
    });

    this.ro.observe(this.chartContainer.nativeElement);
  }

  ngOnDestroy() {
    this.ro?.disconnect();
  }

  private updateViewSize() {
    const el = this.chartContainer.nativeElement;
    this.view = [Math.max(0, el.clientWidth - 20), Math.max(0, el.clientHeight - 20)];
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.multi$ = this.route.paramMap.pipe(
      map(params => params.get('name')),
      switchMap((name) =>
        this.olympics$.pipe(
          map((data) => data?.find((entry: Olympic) => entry.country.toLowerCase() === name?.toLowerCase())),
          map(data => this.toChartData(data))
        )
      )
    );
  }

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = 'cool'; // check values there : https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-vertical

  toChartData(olympic: Olympic = { id: -1, country: '', participations: [] }): ChartData {
    return {
      "name": olympic.country,
      "series": olympic.participations.map(el => this.participationToChartData(el))
    };
  }

  participationToChartData(participation: Participation): ParticipationChartData {
    return {
      "value": participation.medalsCount,
      "name": participation.year.toString()
    };
  }
}