import { AssignQuestion } from './../../models/assign-question.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ShowQuestions } from '../../models/show-questions.interface';
import { AddQuestion } from '../../models/add-question.interface';
import { AddOption } from '../../models/add-option.interface';
import { ShowOption } from '../../models/show-option.interface';
import { UpdataOption } from '../../models/updata-option.interface';

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
  UpdateQuestion(id: string, text: string): Observable<string> {
    return this.httpClient.put(
      environment.baseUrl + `Question/${id}`,
      { text },
      { responseType: 'text' },
    );
  }
  AddOptionToQuuestion(data: AddOption): Observable<string> {
    return this.httpClient.post(environment.baseUrl + `QuestionOption/assign`, data, {
      responseType: 'text',
    });
  }
  ShowOption(id: string): Observable<ShowOption[]> {
    return this.httpClient.get<ShowOption[]>(environment.baseUrl + `QuestionOption/question/${id}`);
  }
  DeleteOption(id: string): Observable<string> {
    return this.httpClient.delete(environment.baseUrl + `QuestionOption/${id}`, {
      responseType: 'text',
    });
  }
  updateOption(id: string, data: UpdataOption): Observable<string> {
    return this.httpClient.put(environment.baseUrl + `QuestionOption/${id}`, data, {
      responseType: 'text',
    });
  }
}
