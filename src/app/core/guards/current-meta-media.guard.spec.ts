import { TestBed } from '@angular/core/testing';

import { CurrentMetaMediaGuard } from './current-meta-media.guard';

describe('CurrentMetaMediaGuard', () => {
  let guard: CurrentMetaMediaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CurrentMetaMediaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
