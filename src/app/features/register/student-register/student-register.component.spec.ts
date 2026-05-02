import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRegisterComponent } from './student-register.component';

describe('StudentRegisterComponent', () => {
  let component: StudentRegisterComponent;
  let fixture: ComponentFixture<StudentRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentRegisterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
