import { AfterViewInit, Component, computed, ElementRef, inject, input, OnDestroy } from '@angular/core';

import type { Olympic } from 'src/app/core/models/Olympic';
import type { Participation } from 'src/app/core/models/Participation';

type ChartData = { name: string; series: ParticipationChartData[]};
type ParticipationChartData = { name: string; value: number};

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements AfterViewInit, OnDestroy {
  olympic = input<Olympic>();
  single = computed<ChartData>(() =>
    this.toChartData(this.olympic() ?? { id: -1, country: '', participations: [] })
  );
  private host = inject(ElementRef<HTMLElement>);

  view: [number, number] = [0, 0];
  private ro?: ResizeObserver;

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      this.updateViewSize();
    });

    this.ro = new ResizeObserver(() => {
      this.updateViewSize();
    });

    this.ro.observe(this.host.nativeElement);
  }

  ngOnDestroy() {
    this.ro?.disconnect();
  }

  private updateViewSize() {
    const el = this.host.nativeElement;
    this.view = [Math.max(0, el.clientWidth - 20), Math.max(0, el.clientHeight - 20)];
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

  toChartData(olympic: Olympic): ChartData {
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