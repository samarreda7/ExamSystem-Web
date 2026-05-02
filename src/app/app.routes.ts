import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { StudentRegisterComponent } from './features/register/student-register/student-register.component';
import { TeacherRegisterComponent } from './features/register/teacher-register/teacher-register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NotfoundComponent } from './features/notfound/notfound.component';

export const routes: Routes = [
 { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
     path: '',
     component: AuthLayoutComponent,
     children: [
      { path: 'login', component: LoginComponent },
      {
        path: 'register',
        component: RegisterComponent,
        children: [
          { path: '', redirectTo: 'student', pathMatch: 'full' },
          { path: 'student', component: StudentRegisterComponent },
          { path: 'teacher', component: TeacherRegisterComponent },
        ],
      },
    ],
   },
    {
     path: '',
     component: MainLayoutComponent,
    },
    { path: '**', component: NotfoundComponent },
];
