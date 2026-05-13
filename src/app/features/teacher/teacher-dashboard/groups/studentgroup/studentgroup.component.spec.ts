import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentgroupComponent } from './studentgroup.component';

describe('StudentgroupComponent', () => {
  let component: StudentgroupComponent;
  let fixture: ComponentFixture<StudentgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentgroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
