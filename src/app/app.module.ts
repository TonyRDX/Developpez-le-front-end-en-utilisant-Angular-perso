import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailsComponent } from './pages/details/details.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DelayInterceptor } from 'src/app/core/services/olympic.service';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, DetailsComponent, PieChartComponent, LineChartComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, NgxChartsModule, BrowserAnimationsModule],
  providers:  [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DelayInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}


// DEV ONLY
// import { isDevMode } from '@angular/core';
// import { Observable } from 'rxjs';

// if (isDevMode()) {
//   const _subscribe = Observable.prototype.subscribe;
//   (Observable.prototype as any).subscribe = function (...args: any[]) {
//     (window as any).__rxActive = (((window as any).__rxActive ?? 0) + 1) ;
//     console.log('[RX] subscribe →', (window as any).__rxActive);
//     const sub = _subscribe.apply(this, args as any);
//     const _unsubscribe = sub.unsubscribe.bind(sub);
//     sub.unsubscribe = () => {
//       (window as any).__rxActive--;
//       console.log('[RX] unsubscribe →', (window as any).__rxActive);
//       _unsubscribe();
//     };
//     return sub;
//   };
// }
