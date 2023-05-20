import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuserComponent } from './juser.component';

describe('JuserComponent', () => {
  let component: JuserComponent;
  let fixture: ComponentFixture<JuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
