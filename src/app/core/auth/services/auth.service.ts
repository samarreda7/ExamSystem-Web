import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { UpdateUser } from '../../models/update-user.interface';
import { Studentinfo } from '../../models/studentinfo.interface';
import { Teacherinfo } from '../../models/teacherinfo.interface';

export type CurrentUserProfile = Studentinfo | Teacherinfo;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  currentUserData: CurrentUserProfile | null = null;

  //Student signup
  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'Student/add', data, {
      responseType: 'text',
    });
  }
  signUpTeacher(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'Teacher/add', data, {
      responseType: 'text',
    });
  }
  signIn(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'Auth/login', data);
  }
  getRole(): string | null {
    return localStorage.getItem('Examrole');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('Examtoken');
  }

  setCurrentUser(user: CurrentUserProfile): void {
    this.currentUserData = user;
  }

  getCurrentUser(): CurrentUserProfile | null {
    return this.currentUserData;
  }

  clearCurrentUser(): void {
    this.currentUserData = null;
  }

  DeleteMyAccount(): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `Auth/me`, { responseType: 'text' });
  }
  UpdateUser(data: UpdateUser): Observable<string> {
    return this.httpClient.put(environment.baseUrl + `Auth/me`, data, {
      responseType: 'text',
    });
  }
}
