import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private readonly httpClient = inject(HttpClient);

  getTeacherGroupsCount(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `Group/teacher/count`);
  }
}
