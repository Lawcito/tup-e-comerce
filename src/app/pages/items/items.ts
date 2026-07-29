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
import { AnalyticsService } from '../../services/analytics.service';
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
  private analyticsService = inject(AnalyticsService);

  searchText = signal('');
  sortBy = signal('name');
  currentPage = signal(0);
  pageSize = signal(12);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);

  // ─── filtro por marca ────────────────────────────────────────────
  selectedBrands = signal<string[]>([]);
  showBrandDropdown = signal(false);

  availableBrands = computed(() => {
    const brands = this.items()
      .map((item) => item.brand)
      .filter((brand): brand is string => !!brand);

    return [...new Set(brands)].sort((a, b) => a.localeCompare(b));
  });

  // Todos los items filtrados y ordenados (sin paginar)
  allFilteredItems = computed(() => {
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

      const itemPrice = Number(item.price) || 0;
      const min = this.minPrice();
      const max = this.maxPrice();

      const minMatch = min === null || itemPrice >= min;
      const maxMatch = max === null || itemPrice <= max;

      return matchesText && matchesBrand && minMatch && maxMatch;
    });

    result = [...result].sort((a, b) => {
      let property = sortProperty;
      let order = 1;

      if (sortProperty === 'priceAsc') {
        property = 'price';
        order = 1;
      } else if (sortProperty === 'priceDesc') {
        property = 'price';
        order = -1;
      }

      const valueA = this.getSortValue(a, property);
      const valueB = this.getSortValue(b, property);

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * order;
      }

      return String(valueA).localeCompare(String(valueB)) * order;
    });

    return result;
  });

  // Solo los items de la página actual
  filteredItems = computed(() => {
    const all = this.allFilteredItems();
    const size = this.pageSize();
    let start = this.currentPage() * size;

    // Si por un evento inicial el "start" se pasa del total, lo reseteamos a 0
    if (start >= all.length) {
      start = 0;
    }

    return all.slice(start, start + size);
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
    this.currentPage.set(0); // Volver a página 1 al buscar
    if (value.trim() !== '') {
      this.analyticsService.sendEvent('search', { search_term: value });
    }
  }

  onSortChange(value: string): void {
    this.sortBy.set(value);
    this.currentPage.set(0); // Volver a página 1 al ordenar
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    // Hacer scroll hacia arriba suavemente al cambiar de página
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

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

  onMinPriceChange(value: string | number | null): void {
    this.minPrice.set(value && value !== '' ? Number(value) : null);
  }

  onMaxPriceChange(value: string | number | null): void {
    this.maxPrice.set(value && value !== '' ? Number(value) : null);
  }

  hideBrokenImage(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.includes('assets/logo_clocknails.png')) {
      image.src = 'assets/logo_clocknails.png';
    } else {
      image.style.display = 'none';
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
