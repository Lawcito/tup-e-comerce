import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ItemsService } from '../../services/items';
import { Item } from '../../models/item';
import i18next from '../../i18n';
import { TranslatePipe } from '../../pipes/translate.pipe';

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

  searchText = signal('');
  sortBy = signal('name');

  // ─── filtro por marca ────────────────────────────────────────────
  selectedBrands = signal<string[]>([]);
  showBrandDropdown = signal(false);

  availableBrands = computed(() => {
    const brands = this.items()
      .map((item) => item.brand)
      .filter((brand): brand is string => !!brand);

    return [...new Set(brands)].sort((a, b) => a.localeCompare(b));
  });

  filteredItems = computed(() => {
    const text = this.searchText().toLowerCase().trim();
    const sortProperty = this.sortBy();
    const brands = this.selectedBrands();

    let result = this.items().filter((item) => {
      const matchesText =
        item.name?.toLowerCase().includes(text) ||
        item.brand?.toLowerCase().includes(text) ||
        item.description?.toLowerCase().includes(text) ||
        item.category?.toLowerCase().includes(text) ||
        item.product_type?.toLowerCase().includes(text);

      const matchesBrand =
        brands.length === 0 || (item.brand ? brands.includes(item.brand) : false);

      return matchesText && matchesBrand;
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
  }

  onSortChange(value: string): void {
    this.sortBy.set(value);
  }

  // ─── filtro por marca ────────────────────────────────────────────
  toggleBrandDropdown(): void {
    this.showBrandDropdown.set(!this.showBrandDropdown());
  }

  closeBrandDropdown(): void {
    this.showBrandDropdown.set(false);
  }

  isBrandSelected(brand: string): boolean {
    return this.selectedBrands().includes(brand);
  }

  toggleBrand(brand: string): void {
    const current = this.selectedBrands();
    if (current.includes(brand)) {
      this.selectedBrands.set(current.filter((b) => b !== brand));
    } else {
      this.selectedBrands.set([...current, brand]);
    }
  }

  clearBrandFilter(): void {
    this.selectedBrands.set([]);
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
