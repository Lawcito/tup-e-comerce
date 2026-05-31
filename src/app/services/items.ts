import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Item } from '../models/item';
import { ItemsApiService } from './items-api.service';
import { ItemsStorageService } from './items-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  constructor(
    private itemsApiService: ItemsApiService,
    private itemsStorageService: ItemsStorageService
  ) {}

  getItems(): Observable<Item[]> {
    const cachedItems = this.itemsStorageService.getCachedItems();

    if (cachedItems) {
      return of(cachedItems);
    }

    return this.itemsApiService.fetchItems().pipe(
      tap((items) => this.itemsStorageService.saveItemsInCache(items))
    );
  }
}
