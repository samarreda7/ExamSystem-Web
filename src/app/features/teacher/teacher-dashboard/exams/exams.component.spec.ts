import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ExamsComponent } from './exams.component';
import { ExamService } from '../../../../core/auth/services/exam.service';

describe('ExamsComponent', () => {
  let component: ExamsComponent;
  let fixture: ComponentFixture<ExamsComponent>;
  let examServiceSpy: jasmine.SpyObj<ExamService>;

  beforeEach(async () => {
    examServiceSpy = jasmine.createSpyObj('ExamService', ['AddExam', 'getAllTeacherExam']);
    examServiceSpy.getAllTeacherExam.and.returnValue(of([]));
    examServiceSpy.AddExam.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ExamsComponent],
      providers: [{ provide: ExamService, useValue: examServiceSpy }],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
