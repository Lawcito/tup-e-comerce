import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ItemsApiService } from './items-api.service';

describe('ItemsApiService', () => {
  let service: ItemsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ItemsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
