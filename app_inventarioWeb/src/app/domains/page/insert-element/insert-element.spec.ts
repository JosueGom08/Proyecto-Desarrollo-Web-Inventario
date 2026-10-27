import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsertElement } from './insert-element';

describe('InsertElement', () => {
  let component: InsertElement;
  let fixture: ComponentFixture<InsertElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertElement],
    }).compileComponents();

    fixture = TestBed.createComponent(InsertElement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
