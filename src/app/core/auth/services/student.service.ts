import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ShowStudent } from '../../models/show-student.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  public readonly httpClient = inject(HttpClient);

  getStudentInfo(Id: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `Student/${Id}`);
  }
  getAllStudent(): Observable<ShowStudent[]> {
    return this.httpClient.get<ShowStudent[]>(environment.baseUrl + `Student/all`);
  }
  
}
