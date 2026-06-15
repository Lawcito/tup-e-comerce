import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ItemsService } from '../../services/items';
import { Item } from '../../models/item';
import i18next from '../../i18n';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule,
    TranslatePipe,
  ],
  templateUrl: './items.html',
  styleUrl: './items.css',
})
export class Items implements OnInit {
  items = signal<Item[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  private itemsService = inject(ItemsService);

  searchText = signal('');
  sortBy = signal('name');
  currentPage = signal(0);
  pageSize = signal(12);

  // Todos los items filtrados y ordenados (sin paginar)
  allFilteredItems = computed(() => {
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

  // Solo los items de la página actual
  filteredItems = computed(() => {
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    return this.allFilteredItems().slice(start, end);
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
    this.currentPage.set(0); // Volver a página 1 al buscar
  }

  onSortChange(value: string): void {
    this.sortBy.set(value);
    this.currentPage.set(0); // Volver a página 1 al ordenar
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
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
