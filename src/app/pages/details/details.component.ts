import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LegendPosition } from '@swimlane/ngx-charts';

import { OlympicService } from 'src/app/core/services/olympic.service';
import type { Olympic } from 'src/app/core/models/Olympic';
import type { Participation } from 'src/app/core/models/Participation';

type ChartData = { name: string; value: number, extra: number };

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  public olympics$: Observable<Olympic[] | null> = of(null); // null could be used to notify error
  public multi$: Observable<ChartData[]> = of([]);
  public multi = [
    {
      "name": "United Kingdom",
      "series": [
        {
          "value": 2062,
          "name": "2016-09-22T09:39:26.191Z"
        },
        {
          "value": 2863,
          "name": "2016-09-13T23:28:23.840Z"
        },
        {
          "value": 6920,
          "name": "2016-09-13T15:17:32.906Z"
        },
        {
          "value": 4834,
          "name": "2016-09-23T10:35:54.956Z"
        },
        {
          "value": 6252,
          "name": "2016-09-14T14:49:40.786Z"
        }
      ]
    },
    {
      "name": "South Sudan",
      "series": [
        {
          "value": 6384,
          "name": "2016-09-22T09:39:26.191Z"
        },
        {
          "value": 2564,
          "name": "2016-09-13T23:28:23.840Z"
        },
        {
          "value": 5674,
          "name": "2016-09-13T15:17:32.906Z"
        },
        {
          "value": 6524,
          "name": "2016-09-23T10:35:54.956Z"
        },
        {
          "value": 3189,
          "name": "2016-09-14T14:49:40.786Z"
        }
      ]
    },
    {
      "name": "Mongolia",
      "series": [
        {
          "value": 3047,
          "name": "2016-09-22T09:39:26.191Z"
        },
        {
          "value": 3060,
          "name": "2016-09-13T23:28:23.840Z"
        },
        {
          "value": 4242,
          "name": "2016-09-13T15:17:32.906Z"
        },
        {
          "value": 3993,
          "name": "2016-09-23T10:35:54.956Z"
        },
        {
          "value": 2320,
          "name": "2016-09-14T14:49:40.786Z"
        }
      ]
    },
    {
      "name": "Mongolia",
      "series": [
        {
          "value": 6691,
          "name": "2016-09-22T09:39:26.191Z"
        },
        {
          "value": 4581,
          "name": "2016-09-13T23:28:23.840Z"
        },
        {
          "value": 5210,
          "name": "2016-09-13T15:17:32.906Z"
        },
        {
          "value": 2421,
          "name": "2016-09-23T10:35:54.956Z"
        },
        {
          "value": 3137,
          "name": "2016-09-14T14:49:40.786Z"
        }
      ]
    },
    {
      "name": "Christmas Island",
      "series": [
        {
          "value": 3176,
          "name": "2016-09-22T09:39:26.191Z"
        },
        {
          "value": 3626,
          "name": "2016-09-13T23:28:23.840Z"
        },
        {
          "value": 3022,
          "name": "2016-09-13T15:17:32.906Z"
        },
        {
          "value": 2836,
          "name": "2016-09-23T10:35:54.956Z"
        },
        {
          "value": 3180,
          "name": "2016-09-14T14:49:40.786Z"
        }
      ]
    }
  ];

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
    // this.single$ = this.olympics$.pipe(
    //   map((list: Olympic[] | null = []) => list?.map((o: Olympic) => this.toChartData(o)) || [])
    // );
  }

  // options
  legend: boolean = true;
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