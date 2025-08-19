import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LegendPosition } from '@swimlane/ngx-charts';

import { OlympicService } from 'src/app/core/services/olympic.service';
import type { Olympic } from 'src/app/core/models/Olympic';
import type { Participation } from 'src/app/core/models/Participation';

type ChartData = { name: string; value: number, extra: number };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  public olympics$: Observable<Olympic[] | null> = of(null); // null could be used to notify error
  public single$: Observable<ChartData[]> = of([]);

  constructor(private olympicService: OlympicService) {}

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
    this.single$ = this.olympics$.pipe(
      map((list: Olympic[] | null = []) => list?.map((o: Olympic) => this.toChartData(o)) || [])
    );
  }

  // options
  gradient: boolean = false;
  showLegend: boolean = false; // renders really bad because it is added outised
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;
  maxLabelLength: number = 12;

  colorScheme = 'cool'; // check values there : https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-vertical

  toChartData(olympic: Olympic): ChartData {
    return {
      "name": olympic.country,
      "value": olympic.participations.reduce(
        (sum: number, participation: Participation) => sum + participation.medalsCount, 0
      ),
      "extra": olympic.id
    };
  }

  tooltipText({ data }: any): string {
    return `${data.name}<br />🏅${data.value}`;
  }

  // TODO use that event hander to route on the selected country
  onSelect(data: any): void {
    var countryName: string = data?.name || data;
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}