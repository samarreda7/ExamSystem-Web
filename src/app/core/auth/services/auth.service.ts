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

  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'Student/add', data,
      {responseType: 'text'});
  }
}
