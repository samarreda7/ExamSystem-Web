import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Subject } from '../../models/subject.interface';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private readonly httpClient = inject(HttpClient);

  getAllSubjects(): Observable<Subject[]> {
    return this.httpClient.get<Subject[]>(environment.baseUrl + `Subject`);
  }
}
