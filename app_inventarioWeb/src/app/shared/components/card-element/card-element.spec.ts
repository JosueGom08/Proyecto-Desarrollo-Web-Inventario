import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardElement } from './card-element';

describe('CardElement', () => {
  let component: CardElement;
  let fixture: ComponentFixture<CardElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardElement],
    }).compileComponents();

    fixture = TestBed.createComponent(CardElement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
