import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
 { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
     path: '',
     component: AuthLayoutComponent,
     children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
   },
    {
     path: '',
     component: MainLayoutComponent,
    },
];
