import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ItemsService } from '../../services/items';
import { Item } from '../../models/item';
import i18next from '../../i18n';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { AnalyticsService } from '../../services/analytics.service';
@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule, MatCardModule, TranslatePipe],
  templateUrl: './items.html',
  styleUrl: './items.css',
})
export class Items implements OnInit {
  items = signal<Item[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  private itemsService = inject(ItemsService);
  private analyticsService = inject(AnalyticsService);

  searchText = signal('');
  sortBy = signal('name');

  filteredItems = computed(() => {
    const text = this.searchText().toLowerCase().trim();
    const sortProperty = this.sortBy();

    let result = this.items().filter((item) => {
      return (
        item.name?.toLowerCase().includes(text) ||
        item.brand?.toLowerCase().includes(text) ||
        item.description?.toLowerCase().includes(text) ||
        item.category?.toLowerCase().includes(text) ||
        item.product_type?.toLowerCase().includes(text)
      );
    });

    result = [...result].sort((a, b) => {
      const valueA = this.getSortValue(a, sortProperty);
      const valueB = this.getSortValue(b, sortProperty);

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
      }

      return String(valueA).localeCompare(String(valueB));
    });

    return result;
  });

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.itemsService.getItems().subscribe({
      next: (items) => {
        const itemsWithImage = items.filter((item) => item.image_link);

        this.items.set(itemsWithImage);
        this.loading.set(false);
        this.analyticsService.sendEvent('view_item_list');
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
        this.errorMessage.set(i18next.t('items.error'));
        this.loading.set(false);
      },
    });
  }

  onSearchChange(value: string): void {
    this.searchText.set(value);
    if (value.trim() !== '') {
      this.analyticsService.sendEvent('search', { search_term: value });
    }
  }

  onSortChange(value: string): void {
    this.sortBy.set(value);
  }

  hideBrokenImage(event: Event): void {
    const image = event.target as HTMLImageElement;
    const card = image.closest('.item-card') as HTMLElement;
    if (card) {
      card.style.display = 'none';
    }
  }

  private getSortValue(item: Item, property: string): string | number {
    switch (property) {
      case 'price':
        return Number(item.price) || 0;

      case 'rating':
        return item.rating || 0;

      case 'brand':
        return item.brand || '';

      case 'category':
        return item.category || '';

      case 'product_type':
        return item.product_type || '';

      case 'name':
      default:
        return item.name || '';
    }
  }
}
