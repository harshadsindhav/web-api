
import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { HomeResolver } from './home/home.resolver';
import { ApiDetailComponent } from './api-detail/api-detail.component'
import { ConfigResolver } from './config-resolver';
export const  STOREROUTES: Routes = [
    {
        path : 'apireference',
        component : HomeComponent,
        children: [
          { path: '', redirectTo: 'apidetail', pathMatch: 'full' },
          { path: 'apidetail',
            component: ApiDetailComponent
          },
        ],
        resolve : {
            configResolver: ConfigResolver,
            apiListing : HomeResolver
        }
    },
    {
        path : '', redirectTo : 'apireference', pathMatch : 'full'
    }
];
