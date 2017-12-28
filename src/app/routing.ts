
import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { HomeResolver } from './home/home.resolver';
import { ConfigResolver } from './config-resolver';
export const  STOREROUTES: Routes = [
    {
        path : 'home',
        component : HomeComponent,
        resolve : {
            configResolver: ConfigResolver,
            apiListing : HomeResolver
        }
    },
    {
        path : '', redirectTo : 'home', pathMatch : 'full'
    }
];
