import { TestBed } from '@angular/core/testing';
import { ItemsStorageService } from './items-storage.service';

describe('ItemsStorageService', () => {
  let service: ItemsStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
