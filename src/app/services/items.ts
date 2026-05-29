import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Item } from '../models/item';

interface ItemsCache {
  data: Item[];
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private readonly apiUrl = 'http://makeup-api.herokuapp.com/api/v1/products.json';
  private readonly cacheKey = 'items-cache';
  private readonly cacheDuration = 5 * 60 * 1000;
  private http = inject(HttpClient);

  getItems(): Observable<Item[]> {
    const cachedItems = this.getCachedItems();

    if (cachedItems) {
      return of(cachedItems);
    }

    return this.http.get<Item[]>(this.apiUrl).pipe(
      tap((items) => this.saveItemsInCache(items))
    );
  }

  private getCachedItems(): Item[] | null {
    const cachedValue = localStorage.getItem(this.cacheKey);

    if (!cachedValue) {
      return null;
    }

    const cache: ItemsCache = JSON.parse(cachedValue);

    if (Date.now() > cache.expiresAt) {
      localStorage.removeItem(this.cacheKey);
      return null;
    }

    return cache.data;
  }

  private saveItemsInCache(items: Item[]): void {
    const cache: ItemsCache = {
      data: items,
      expiresAt: Date.now() + this.cacheDuration
    };

    localStorage.setItem(this.cacheKey, JSON.stringify(cache));
  }
}
