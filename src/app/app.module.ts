import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule} from '@angular/http';
import { RouterModule} from '@angular/router';

import { STOREROUTES} from './routing';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HomeResolver } from './home/home.resolver';
import { ApiDocService } from './services/apidoc.service';
import { CategoryfilterPipe} from './custompipes/categoryfilter.pipe';
import { MainCategoryComponent } from './main-category/main-category.component';
import { ChildCategoryComponent } from './child-category/child-category.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ComponentApisComponent } from './component-apis/component-apis.component';
import { HttpMethodDirective } from './http-method.directive';
import { ConfigResolver } from './config-resolver';
import { ApiTemplateComponent } from './api-template/api-template.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainCategoryComponent,
    ChildCategoryComponent,
    CategoryfilterPipe,
    SearchResultComponent,
    ComponentApisComponent,
    HttpMethodDirective,
    IFrameResizerDirective,
    ApiTemplateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(STOREROUTES)
  ],
  providers: [ApiDocService, HomeResolver, ConfigResolver],
  entryComponents: [ ApiTemplateComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
