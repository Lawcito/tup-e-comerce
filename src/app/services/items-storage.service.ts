import { Injectable } from '@angular/core';
import { Item } from '../models/item';

interface ItemsCache {
  data: Item[];
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class ItemsStorageService {
  private readonly cacheKey = 'items-cache';
  private readonly cacheDuration = 5 * 60 * 1000;

  getCachedItems(): Item[] | null {
    const cachedValue = localStorage.getItem(this.cacheKey);

    if (!cachedValue) {
      return null;
    }
    try {
      const cache: ItemsCache = JSON.parse(cachedValue);

      if (Date.now() > cache.expiresAt) {
        this.clearCache();
        return null;
      }
      return cache.data;
    } catch (error) {
      console.error('Error parsing cached value:', error);
      this.clearCache();
      return null;
    }
  }

  saveItemsInCache(items: Item[]): void {
    const cache: ItemsCache = {
      data: items,
      expiresAt: Date.now() + this.cacheDuration,
    };

    localStorage.setItem(this.cacheKey, JSON.stringify(cache));
  }

  clearCache(): void {
    localStorage.removeItem(this.cacheKey);
  }
}
