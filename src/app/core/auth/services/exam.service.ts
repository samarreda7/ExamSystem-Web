import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Exams } from '../../models/exams.interface';
import { StudentExam } from '../../models/student-exam.interface';
import { ExamQuestion } from '../../models/exam-question.interface';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private readonly httpClient = inject(HttpClient);

  getTeacherExamCount(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'Exam/count');
  }

  AddExam(name: string): Observable<string> {
    return this.httpClient.post(
      environment.baseUrl + `Exam/add`,
      { name },
      { responseType: 'text' },
    );
  }

  getAllTeacherExam(): Observable<Exams[]> {
    return this.httpClient.get<Exams[]>(environment.baseUrl + `Exam/all`);
  }

  DeleteExam(id: string): Observable<string> {
    return this.httpClient.delete(environment.baseUrl + `Exam/${id}`, { responseType: 'text' });
  }

  UpdateExamName(id: string, name: string): Observable<string> {
    return this.httpClient.put(
      environment.baseUrl + `Exam/${id}`,
      { name },
      { responseType: 'text' },
    );
  }
  //for student
  GetStudentExamCount(): Observable<number> {
    return this.httpClient.get<number>(environment.baseUrl + `ExamGroup/students/exams/count`);
  }
  GetStudentExam(): Observable<StudentExam[]> {
    return this.httpClient.get<StudentExam[]>(environment.baseUrl + `ExamGroup/students/exams`);
  }
  GetExamsByGroupId(id: string): Observable<StudentExam[]> {
    return this.httpClient.get<StudentExam[]>(environment.baseUrl + `ExamGroup/groups/${id}/exams`);
  }
  GetExam(id: string): Observable<ExamQuestion> {
    return this.httpClient.get<ExamQuestion>(
      environment.baseUrl + `ExamQuestion/${id}/questions/student`,
    );
  }
}
