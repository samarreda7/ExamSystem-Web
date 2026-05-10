import { AssignQuestion } from './../../models/assign-question.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ShowQuestions } from '../../models/show-questions.interface';
import { AddQuestion } from '../../models/add-question.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly httpClient = inject(HttpClient);

  getAllQuestion(): Observable<ShowQuestions[]> {
    return this.httpClient.get<ShowQuestions[]>(environment.baseUrl + `Question`);
  }
  AddQuestion(data: AddQuestion): Observable<string> {
    return this.httpClient.post(environment.baseUrl + `Question/add`, data, {
      responseType: 'text',
    });
  }
  QuestionIsAssignedToCurrentExam(questionId: string, examId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      environment.baseUrl + `ExamQuestion/${examId}/questions/${questionId}/is-assigned`,
    );
  }
  getAssignedQuestionsForExam(examId: string): Observable<ShowQuestions[]> {
    return this.httpClient.get<ShowQuestions[]>(
      environment.baseUrl + `ExamQuestion/${examId}/questions`,
    );
  }
  AssignQuestionToExam(data: AssignQuestion): Observable<string> {
    return this.httpClient.post(environment.baseUrl + `ExamQuestion/assign`, data, {
      responseType: 'text',
    });
  }
  UnAssignQuestionFromExam(examId: string, questionId: string): Observable<string> {
    return this.httpClient.delete(
      environment.baseUrl + `ExamQuestion/${examId}/questions/${questionId}`,
      {
        responseType: 'text',
      },
    );
  }
  DeleteQuestion(id: string): Observable<string> {
    return this.httpClient.delete(environment.baseUrl + `Question/${id}`, {
      responseType: 'text',
    });
  }
}
