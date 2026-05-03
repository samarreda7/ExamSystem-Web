import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from '../../models/subject.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  //Student signup
  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'Student/add', data,
      {responseType: 'text'});
  }
  signUpTeacher(data: object): Observable<any>{
     return this.httpClient.post(environment.baseUrl + 'Teacher/add', data,
      {responseType: 'text'});
  }
  signIn(data : object): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'Auth/login', data);
  }
  getRole(): string | null {
  return localStorage.getItem('Examrole');
}

isLoggedIn(): boolean {
  return !!localStorage.getItem('Examtoken');
}
}
