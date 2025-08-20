import { AfterViewInit, Component, computed, ElementRef, inject, input, OnDestroy, output } from '@angular/core';
import { LegendPosition, PieData } from '@swimlane/ngx-charts';

import type { Olympic } from 'src/app/core/models/Olympic';
import type { Participation } from 'src/app/core/models/Participation';

type ChartData = { name: string; value: number, extra: number };

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements AfterViewInit, OnDestroy {
  selectedOlympic = output<Olympic>();
  olympics = input<Olympic[]>([]);
  single = computed<ChartData[]>(() =>
    (this.olympics() ?? []).map(o => this.toChartData(o))
  );

  private host = inject(ElementRef<HTMLElement>);

  view: [number, number] = [0, 0];
  private ro?: ResizeObserver;

  ngAfterViewInit() {
    // a promise to init and delay of one tick
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

  // TODO check if possible to extract in dedicated file
  tooltipText({data}: PieData): string {
    return `${data.name}<br />🏅${data.value}`;
  }

  onSelect(data: ChartData): void {
    let country = this.olympics().find(e => e.country === data.name);
    if (typeof country !== "undefined")
      this.selectedOlympic.emit(country);
  }
}