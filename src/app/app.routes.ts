import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard, loginGuard } from './services/auth.guard';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent,
        canActivate: [loginGuard]
    },
    {
        path:'',
        component:LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path:'dashboard',
                component:DashboardComponent
            }
        ]
    }
];
