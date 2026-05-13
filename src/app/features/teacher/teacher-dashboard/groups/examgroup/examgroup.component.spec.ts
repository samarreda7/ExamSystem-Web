import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamgroupComponent } from './examgroup.component';

describe('ExamgroupComponent', () => {
  let component: ExamgroupComponent;
  let fixture: ComponentFixture<ExamgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamgroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
