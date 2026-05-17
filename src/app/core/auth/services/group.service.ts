import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ShowGroup } from '../../models/show-group.interface';
import { AssignStudentToGroup } from '../../models/assign-student-to-group.interface';
import { AssignExam } from '../../models/assign-exam.interface';
import { StudentGroup } from '../../models/student-group.interface';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private readonly httpClient = inject(HttpClient);

  getTeacherGroupsCount(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `Group/teacher/count`);
  }
  GetAllGroups(): Observable<ShowGroup[]> {
    return this.httpClient.get<ShowGroup[]>(environment.baseUrl + `Group/teacher/all`);
  }
  AddGroup(name: string): Observable<string> {
    return this.httpClient.get(environment.baseUrl + `Group/add`, {
      responseType: 'text',
    });
  }
  AssignStudent(data: AssignStudentToGroup): Observable<string> {
    return this.httpClient.post(environment.baseUrl + `StudentGroup/assign`, data, {
      responseType: 'text',
    });
  }
  UnAssignStudent(studentId: string, groupId: string): Observable<string> {
    return this.httpClient.delete(
      environment.baseUrl + `StudentGroup/${groupId}/students/${studentId}`,
      {
        responseType: `text`,
      },
    );
  }
  IsStudentAssigned(studentId: string, groupId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      environment.baseUrl + `StudentGroup/${groupId}/students/${studentId}/is-assigned`,
    );
  }
  StudentCountOnGroup(groupId: string): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `StudentGroup/group/${groupId}/students/count`,
    );
  }
  AssignExam(data: AssignExam): Observable<string> {
    return this.httpClient.post(environment.baseUrl + `ExamGroup/assign`, data, {
      responseType: 'text',
    });
  }
  UnAssignExam(examId: string, groupId: string): Observable<string> {
    return this.httpClient.delete(environment.baseUrl + `ExamGroup/${examId}/groups/${groupId}`, {
      responseType: `text`,
    });
  }
  IsExamAssigned(examId: string, groupId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      environment.baseUrl + `ExamGroup/${examId}/groups/${groupId}/is-assigned`,
    );
  }
  ExamCountOnGroup(groupId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `ExamGroup/groups/${groupId}/exams/count`);
  }
  //for student
  GetStudentGroupCount(): Observable<number> {
    return this.httpClient.get<number>(environment.baseUrl + `StudentGroup/my-groups/count`);
  }
  GetStudentGroup(): Observable<StudentGroup[]> {
    return this.httpClient.get<StudentGroup[]>(environment.baseUrl + `StudentGroup/my-groups`);
  }
}
