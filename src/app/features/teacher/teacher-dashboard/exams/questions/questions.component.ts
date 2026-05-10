import { AssignQuestion } from './../../../../../core/models/assign-question.interface';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../../../core/auth/services/question.service';
import { AddQuestion } from '../../../../../core/models/add-question.interface';
import { ActivatedRoute } from '@angular/router';
import { ShowQuestions } from '../../../../../core/models/show-questions.interface';
import { forkJoin, map, of, switchMap } from 'rxjs';

type QuestionItem = ShowQuestions & { isAssigned: boolean };

@Component({
  selector: 'app-questions',
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css',
})
export class QuestionsComponent implements OnInit {
  private readonly questionService = inject(QuestionService);
  private readonly activatedRoute = inject(ActivatedRoute);
  selectedExamId = '';
  selectedExamName = '';
  questions: QuestionItem[] = [];
  questionText = '';
  questionType: 0 | 1 = 0;
  editQuestionId = '';
  editQuestionText = '';
  isCreatingQuestion = false;
  userId: string = localStorage.getItem('ExamuserId') ?? '';

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.selectedExamId = params.get('examId') ?? '';
      this.selectedExamName = params.get('examName') ?? '';
      this.getAllQuestions();
    });
  }

  getAllQuestions() {
    this.questionService
      .getAllQuestion()
      .pipe(
        switchMap((questions: ShowQuestions[]) => {
          if (!this.selectedExamId) {
            return of(
              questions.map((question): QuestionItem => ({ ...question, isAssigned: false })),
            );
          }

          const questionsWithAssignmentStatus = questions.map((question) => {
            const trimmedQuestionId = question.id.trim();

            if (!trimmedQuestionId) {
              return of<QuestionItem>({ ...question, isAssigned: false });
            }

            return this.questionService
              .QuestionIsAssignedToCurrentExam(trimmedQuestionId, this.selectedExamId)
              .pipe(map((isAssigned): QuestionItem => ({ ...question, isAssigned })));
          });

          return forkJoin(questionsWithAssignmentStatus);
        }),
      )
      .subscribe({
        next: (res: QuestionItem[]) => {
          this.questions = res;
          console.log(this.questions);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  AddQuestion(text: string, type: 0 | 1) {
    const trimmedText = text.trim();

    if (!trimmedText) {
      console.log('Question text is required.');
      return;
    }

    if (type !== 0 && type !== 1) {
      console.log('Question type must be 0 or 1.');
      return;
    }

    const data: AddQuestion = { text: trimmedText, type };

    this.isCreatingQuestion = true;
    this.questionService.AddQuestion(data).subscribe({
      next: (res) => {
        console.log(res);
        this.questionText = '';
        this.questionType = 0;
        this.isCreatingQuestion = false;
        this.getAllQuestions();
      },
      error: (err) => {
        console.log(err);
        this.isCreatingQuestion = false;
      },
    });
  }

  getQuestionType(type: number): string {
    return type === 0 ? 'Multiple choice' : 'True / False';
  }

  AssignQuestion(questionId: string) {
    const trimmedQuestionId = questionId.trim();
    if (!trimmedQuestionId || !this.selectedExamId) return;

    const data: AssignQuestion = {
      examId: this.selectedExamId,
      questionId: trimmedQuestionId,
    };

    this.questionService.AssignQuestionToExam(data).subscribe({
      next: (res) => {
        console.log(res);
        this.getAllQuestions();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  UnAssignQuestionFromExam(questionId: string) {
    const trimmedQuestionId = questionId.trim();
    if (!trimmedQuestionId || !this.selectedExamId) return;

    this.questionService
      .UnAssignQuestionFromExam(this.selectedExamId, trimmedQuestionId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.getAllQuestions();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  DeleteQuestion(id: string) {
    this.questionService.DeleteQuestion(id).subscribe({
      next: (res) => {
        console.log(res);
        this.getAllQuestions();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openEditModal(question: QuestionItem) {
    this.editQuestionId = question.id;
    this.editQuestionText = question.text;
  }

  closeEditModal() {
    this.editQuestionId = '';
    this.editQuestionText = '';
  }

  UpdateQuestion() {
    const trimmedText = this.editQuestionText.trim();

    if (!trimmedText || !this.editQuestionId) {
      return;
    }

    this.questionService.UpdateQuestion(this.editQuestionId, trimmedText).subscribe({
      next: (res) => {
        console.log(res);
        this.closeEditModal();
        this.getAllQuestions();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
