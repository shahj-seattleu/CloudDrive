import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesinfolderComponent } from './filesinfolder.component';

describe('FilesinfolderComponent', () => {
  let component: FilesinfolderComponent;
  let fixture: ComponentFixture<FilesinfolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesinfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesinfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
