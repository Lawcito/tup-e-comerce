import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class ItemsApiService {
  private readonly apiUrl = 'http://localhost:3000/items';
  private http = inject(HttpClient);

  fetchItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }
}
