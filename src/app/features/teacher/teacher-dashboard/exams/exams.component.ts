import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../../../core/auth/services/exam.service';
import { Exams } from '../../../../core/models/exams.interface';

@Component({
  selector: 'app-teacher-exams',
  imports: [CommonModule, FormsModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit {
  private readonly examService = inject(ExamService);
  private feedbackTimeoutId: ReturnType<typeof setTimeout> | null = null;
  Exams: Exams[] = [];
  examName = '';
  editExamId = '';
  editExamName = '';
  isLoading = false;
  isSubmitting = false;
  isUpdating = false;
  deletingExamId = '';
  feedbackMessage = '';
  feedbackType: 'success' | 'error' | '' = '';

  ngOnInit(): void {
    this.getAllTeacherExam();
  }

  ngOnDestroy(): void {
    if (this.feedbackTimeoutId) {
      clearTimeout(this.feedbackTimeoutId);
    }
  }

  AddExam(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      this.setFeedback('Please enter an exam name before creating it.', 'error');
      return;
    }

    this.isSubmitting = true;
    this.examService.AddExam(trimmedName).subscribe({
      next: (res) => {
        console.log(res);
        this.examName = '';
        this.setFeedback('Exam created successfully.', 'success');
        this.isSubmitting = false;
        this.getAllTeacherExam();
      },
      error: (err) => {
        console.log(err);
        this.isSubmitting = false;
        this.setFeedback('Unable to create the exam right now.', 'error');
      },
    });
  }
  getAllTeacherExam() {
    this.isLoading = true;
    this.examService.getAllTeacherExam().subscribe({
      next: (res) => {
        this.Exams = res;
        console.log(this.Exams);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.setFeedback('Unable to load your exams right now.', 'error');
      },
    });
  }

  trackByExamId(index: number, exam: Exams): string {
    return exam.id || index.toString();
  }

  private setFeedback(message: string, type: 'success' | 'error') {
    if (this.feedbackTimeoutId) {
      clearTimeout(this.feedbackTimeoutId);
    }

    this.feedbackMessage = message;
    this.feedbackType = type;

    this.feedbackTimeoutId = setTimeout(() => {
      this.feedbackMessage = '';
      this.feedbackType = '';
      this.feedbackTimeoutId = null;
    }, 3000);
  }

  DeleteExam(id: string) {
    this.deletingExamId = id;
    this.examService.DeleteExam(id).subscribe({
      next: (res) => {
        console.log(res);
        this.deletingExamId = '';
        this.setFeedback('Exam deleted successfully.', 'success');
        this.getAllTeacherExam();
      },
      error: (err) => {
        console.log(err);
        this.deletingExamId = '';
        this.setFeedback('Unable to delete the exam right now.', 'error');
      },
    });
  }

  openEditModal(exam: Exams) {
    this.editExamId = exam.id;
    this.editExamName = exam.name;
  }

  closeEditModal() {
    this.editExamId = '';
    this.editExamName = '';
    this.isUpdating = false;
  }

  UpdateExam() {
    const trimmedName = this.editExamName.trim();

    if (!trimmedName || !this.editExamId) {
      this.setFeedback('Please enter a valid exam name before updating.', 'error');
      return;
    }

    this.isUpdating = true;
    this.examService.UpdateExamName(this.editExamId, trimmedName).subscribe({
      next: (res) => {
        console.log(res);
        this.setFeedback('Exam updated successfully.', 'success');
        this.closeEditModal();
        this.getAllTeacherExam();
      },
      error: (err) => {
        console.log(err);
        this.isUpdating = false;
        this.setFeedback('Unable to update the exam right now.', 'error');
      },
    });
  }
}
