import { Component, ViewChild } from '@angular/core';
import { HomeComponent } from './home/home.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  @ViewChild(HomeComponent) homeComp: HomeComponent;

  performSearch() {
    console.log('perform search');
    this.homeComp.searchInAllApis();
  }
}
