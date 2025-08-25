import { Component, inject, OnInit } from '@angular/core';
import { OlympicService } from './core/services/olympic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private olympicService: OlympicService = inject(OlympicService);

  // AppComponent seems useless as OlympicService could initialize itself
  ngOnInit(): void {
    this.olympicService.loadInitialData();
  }
}
