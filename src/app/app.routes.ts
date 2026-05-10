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
import { guestGuard } from './core/auth/guards/guest-guard';
import { HomeComponent as StudentHomeComponent } from './features/student/student-dashboard/home/home.component';
import { ExamsComponent as StudentExamsComponent } from './features/student/student-dashboard/exams/exams.component';
import { GroupsComponent as StudentGroupsComponent } from './features/student/student-dashboard/groups/groups.component';
import { HomeComponent as TeacherHomeComponent } from './features/teacher/teacher-dashboard/home/home.component';
import { ExamsComponent as TeacherExamsComponent } from './features/teacher/teacher-dashboard/exams/exams.component';
import { GroupsComponent as TeacherGroupsComponent } from './features/teacher/teacher-dashboard/groups/groups.component';
import { QuestionsComponent } from './features/teacher/teacher-dashboard/exams/questions/questions.component';

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
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'dashboard', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', component: StudentHomeComponent },
          { path: 'exams', component: StudentExamsComponent },
          { path: 'groups', component: StudentGroupsComponent },
        ],
      },

      // Teacher section
      {
        path: 'teacher',
        canActivate: [roleGuard('Teacher')],
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'dashboard', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', component: TeacherHomeComponent },
          { path: 'exams', component: TeacherExamsComponent },
          { path: 'exams/questions', component: QuestionsComponent },
          { path: 'groups', component: TeacherGroupsComponent },
        ],
      },

    ],
  },
    { path: '**', component: NotfoundComponent },
];
