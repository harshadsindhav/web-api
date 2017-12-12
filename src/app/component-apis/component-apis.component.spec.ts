import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentApisComponent } from './component-apis.component';

describe('ComponentApisComponent', () => {
  let component: ComponentApisComponent;
  let fixture: ComponentFixture<ComponentApisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentApisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
