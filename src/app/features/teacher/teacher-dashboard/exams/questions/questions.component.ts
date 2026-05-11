import { AssignQuestion } from './../../../../../core/models/assign-question.interface';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { QuestionService } from '../../../../../core/auth/services/question.service';
import { AddQuestion } from '../../../../../core/models/add-question.interface';
import { ActivatedRoute } from '@angular/router';
import { ShowQuestions } from '../../../../../core/models/show-questions.interface';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { AddOption } from '../../../../../core/models/add-option.interface';
import { ShowOption } from '../../../../../core/models/show-option.interface';
import { UpdataOption } from '../../../../../core/models/updata-option.interface';

type QuestionItem = ShowQuestions & {
  isAssigned: boolean;
  isOptionsExpanded: boolean;
  isLoadingOptions: boolean;
  options: ShowOption[];
  newOptionText: string;
  newOptionIsCorrect: boolean;
  optionError: string;
  isSubmittingOption: boolean;
  isDeletingOption: string | null;
  editingOptionId: string | null;
  editingOptionText: string;
  editingOptionIsCorrect: boolean;
  isUpdatingOption: string | null;
};

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
    const previousQuestions = new Map(this.questions.map((question) => [question.id, question]));

    this.questionService
      .getAllQuestion()
      .pipe(
        switchMap((questions: ShowQuestions[]) => {
          if (!this.selectedExamId) {
            return of(
              questions.map((question): QuestionItem =>
                this.buildQuestionItem(question, false, previousQuestions.get(question.id)),
              ),
            );
          }

          const questionsWithAssignmentStatus = questions.map((question) => {
            const trimmedQuestionId = question.id.trim();

            if (!trimmedQuestionId) {
              return of<QuestionItem>(
                this.buildQuestionItem(question, false, previousQuestions.get(question.id)),
              );
            }

            return this.questionService
              .QuestionIsAssignedToCurrentExam(trimmedQuestionId, this.selectedExamId)
              .pipe(
                map((isAssigned): QuestionItem =>
                  this.buildQuestionItem(question, isAssigned, previousQuestions.get(question.id)),
                ),
              );
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

  private buildQuestionItem(
    question: ShowQuestions,
    isAssigned: boolean,
    previousQuestion?: QuestionItem,
  ): QuestionItem {
    return {
      ...question,
      isAssigned,
      isOptionsExpanded: previousQuestion?.isOptionsExpanded ?? false,
      isLoadingOptions: false,
      options: previousQuestion?.options ?? [],
      newOptionText: previousQuestion?.newOptionText ?? '',
      newOptionIsCorrect: previousQuestion?.newOptionIsCorrect ?? false,
      optionError: previousQuestion?.optionError ?? '',
      isSubmittingOption: false,
      isDeletingOption: null,
      editingOptionId: null,
      editingOptionText: '',
      editingOptionIsCorrect: false,
      isUpdatingOption: null,
    };
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

  toggleOptions(question: QuestionItem) {
    question.isOptionsExpanded = !question.isOptionsExpanded;

    if (question.isOptionsExpanded) {
      this.loadOptions(question);
    }
  }

  loadOptions(question: QuestionItem) {
    question.isLoadingOptions = true;

    this.questionService.ShowOption(question.id).subscribe({
      next: (res) => {
        question.options = res;
        question.optionError = '';
        question.isLoadingOptions = false;
      },
      error: (err) => {
        console.log(err);
        question.isLoadingOptions = false;
        question.optionError = 'Unable to load options right now.';
      },
    });
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
  AddOptionToQuestion(question: QuestionItem) {
    if (question.teacherOwnerId !== this.userId) {
      return;
    }

    const trimedText = question.newOptionText.trim();
    if (!trimedText || !question.id) {
      return;
    }

    const data: AddOption = {
      text: trimedText,
      isCorrect: question.newOptionIsCorrect,
      questionId: question.id,
    };

    question.optionError = '';
    question.isSubmittingOption = true;

    this.questionService.AddOptionToQuuestion(data).subscribe({
      next: (res) => {
        question.newOptionText = '';
        question.newOptionIsCorrect = false;
        question.isSubmittingOption = false;
        this.loadOptions(question);
      },
      error: (err) => {
        question.isSubmittingOption = false;
        question.optionError = this.getOptionErrorMessage(err);
      },
    });
  }

  DeleteOption(question: QuestionItem, optionId: string) {
    if (question.teacherOwnerId !== this.userId) {
      return;
    }

    question.optionError = '';
    question.isDeletingOption = optionId;

    this.questionService.DeleteOption(optionId).subscribe({
      next: (res) => {
        question.isDeletingOption = null;
        this.loadOptions(question);
      },
      error: (err) => {
        question.isDeletingOption = null;
        question.optionError = 'Unable to delete this option right now.';
      },
    });
  }

  startOptionEdit(question: QuestionItem, option: ShowOption) {
    if (question.teacherOwnerId !== this.userId) {
      return;
    }

    question.editingOptionId = option.id;
    question.editingOptionText = option.text;
    question.editingOptionIsCorrect = option.isCorrect;
    question.optionError = '';
  }

  cancelOptionEdit(question: QuestionItem) {
    question.editingOptionId = null;
    question.editingOptionText = '';
    question.editingOptionIsCorrect = false;
  }

  private getOptionErrorMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'string') {
      try {
        const parsedError = JSON.parse(error.error);
        return parsedError?.error || error.error;
      } catch {
        return error.error;
      }
    }

    return error.error?.error || error.message || 'Unable to save this option right now.';
  }

  UpdateOption(question: QuestionItem, id: string) {
    if (question.teacherOwnerId !== this.userId) {
      return;
    }

    const trimedText = question.editingOptionText.trim();
    if (!trimedText || !question.id) {
      return;
    }

    const data: UpdataOption = {
      text: trimedText,
      isCorrect: question.editingOptionIsCorrect,
    };

    question.optionError = '';
    question.isUpdatingOption = id;

    this.questionService.updateOption(id, data).subscribe({
      next: (res) => {
        console.log(res);
        question.isUpdatingOption = null;
        this.cancelOptionEdit(question);
        this.loadOptions(question);
      },
      error: (err) => {
        console.log(err);
        question.isUpdatingOption = null;
        question.optionError = this.getOptionErrorMessage(err);
      },
    });
  }
}
