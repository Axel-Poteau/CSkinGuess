import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkinGuessComponent } from './skin-guess.component';

describe('SkinGuessComponent', () => {
  let component: SkinGuessComponent;
  let fixture: ComponentFixture<SkinGuessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkinGuessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkinGuessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
