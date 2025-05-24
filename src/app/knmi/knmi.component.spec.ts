import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnmiComponent } from './knmi.component';

describe('KnmiComponent', () => {
  let component: KnmiComponent;
  let fixture: ComponentFixture<KnmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnmiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
