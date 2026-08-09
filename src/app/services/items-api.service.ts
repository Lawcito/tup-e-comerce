import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemsApiService {
  private readonly apiUrl = 'https://makeup-api.herokuapp.com/api/v1/products.json';

  constructor(private http: HttpClient) {}

  fetchItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }
}
