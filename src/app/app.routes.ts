import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { StudentRegisterComponent } from './features/register/student-register/student-register.component';
import { TeacherRegisterComponent } from './features/register/teacher-register/teacher-register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { authGuard } from './core/auth/guards/auth-guard';
import { roleGuard } from './core/auth/guards/role-guard';
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './features/teacher/teacher-dashboard/teacher-dashboard.component';
import { guestGuard } from './core/auth/guards/guest-guard';

export const routes: Routes = [
 { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
     path: '',
     component: AuthLayoutComponent,
     canActivate:[guestGuard],
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
    canActivate: [authGuard],
    children: [

      // Student section
      {
        path: 'student',
        canActivate: [roleGuard('Student')],
        children: [
          
          { path: 'dashboard', component: StudentDashboardComponent },
        ],
      },

      // Teacher section
      {
        path: 'teacher',
        canActivate: [roleGuard('Teacher')],
        children: [
          
          { path: 'dashboard', component: TeacherDashboardComponent },
        ],
      },

    ],
  },
    { path: '**', component: NotfoundComponent },
];
