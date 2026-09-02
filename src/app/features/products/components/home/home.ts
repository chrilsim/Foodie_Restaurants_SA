import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule,MatSpinner} from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { interfaceCategory } from '../../../../interface/category';
import { interfaceitemenu } from '../../../../interface/menuitem';
import { MenuService } from '../../../../core/menuitem.service';
import { categoryService } from '../../../../core/category.service';
import { AddToCartService } from '../../../../core/addToCart.service';
import { UsdToKhrPipe } from '../../../../shared/pipes/usd-to-khr';
@Component({
  selector: 'app-home',

  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSpinner,
    ScrollingModule,
    UsdToKhrPipe
  ],

  templateUrl: './home.html',

  styleUrl: './home.css',

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Home implements OnInit, OnDestroy {

  @ViewChild('loadMoreTrigger')
  loadMoreTrigger?: ElementRef<HTMLElement>;

  private observer?: IntersectionObserver;
  menuitems: interfaceitemenu[] = [];
  filteredMenuitems: interfaceitemenu[] = [];
  popularItems: interfaceitemenu[] = [];
  categorys: interfaceCategory[] = [];
  selectedCategoryId: string = 'all';
  isLoading = false;
  isLoadingMore = false;

  currentPage = 1;
  pageSize = 10;
  hasMore = true;

  menuItem: interfaceitemenu = {
    _id: '',
    categoryId: '',
    name: '',
    description: '',
    price: 0,
    image: '',
    stock: 0,
    cost: 0,
    hasStock: false,
    isAvailable: false
  };

  constructor(
    public serviceMenuItem: MenuService,
    private categoryService: categoryService,
    private drc: ChangeDetectorRef,
    private cartservice: AddToCartService,
    private ngZone: NgZone
  ) {

  }
  ngOnInit(): void {
    this.loadCategories();
    this.loadMenuItems();
  }
  loadCategories(): void {
    this.categoryService.getCategory().subscribe({
        next: (data) => {
          this.categorys = data ?? [];
          this.drc.detectChanges();
        },
        error: (err) => {
          console.error('CATEGORY ERROR:',err);
        }
      });
  }
loadMenuItems(): void {
  this.isLoading = true;
  this.currentPage = 1;
  this.hasMore = true;
  this.serviceMenuItem.getMenuItemsPagination(this.currentPage,this.pageSize)
    .subscribe({
      next: (response) => {
        const items: interfaceitemenu[] =response?.data ?? [];
        this.menuitems = items;
        this.filteredMenuitems = [...items];
        this.popularItems = items.filter((item: interfaceitemenu) =>item.isPopular).slice(0, 10);
        this.hasMore =response?.pagination?.hasMore ?? false;
        this.isLoading = false;
        this.drc.detectChanges();
        setTimeout(() => {
          this.setupLoadMoreObserver();
        }, 0);

      },

      error: (err) => {
        console.error('MENU PAGINATION ERROR:',err);
        this.menuitems = [];
        this.filteredMenuitems = [];
        this.popularItems = [];

        this.hasMore = false;
        this.isLoading = false;
        this.drc.detectChanges();

      }

    });

}
private setupLoadMoreObserver(): void {
  const trigger = this.loadMoreTrigger;

  if (!trigger ||!this.hasMore) {
    return;
  }
  this.observer?.disconnect();
  this.ngZone.runOutsideAngular(() => {
    this.observer =new IntersectionObserver(
        (entries) => {
          const entry =entries[0];
          if (entry.isIntersecting &&!this.isLoadingMore &&this.hasMore) {
            this.ngZone.run(() => {
              this.loadMoreMenuItems();
            });
          }
        },
        {
          root: null,
          rootMargin: '1000px 0px',
          threshold: 0
        }
      );
    this.observer.observe(
      trigger.nativeElement
    );
  });

}
loadMoreMenuItems(): void {
  if (this.isLoadingMore ||!this.hasMore) {
    return;
  }
  this.isLoadingMore = true;
  const nextPage =this.currentPage + 1;
  this.serviceMenuItem.getMenuItemsPagination(nextPage,this.pageSize)
    .subscribe({
      next: (response) => {
        const newItems: interfaceitemenu[] =response?.data ?? [];
        if (newItems.length > 0) {
          this.menuitems.push(
            ...newItems
          );
          if (this.selectedCategoryId === 'all') {
            this.filteredMenuitems.push(
              ...newItems
            );
          }

          else {
            const selectedId =String(this.selectedCategoryId);
            const filteredNewItems =
              newItems.filter((item: interfaceitemenu) => {
                  const categoryId =typeof item.categoryId === 'object'? String((item.categoryId as any)?._id ?? '')
                      : String(
                          item.categoryId ?? ''
                        );
                  return (
                    categoryId === selectedId
                  );
                }
              );

            this.filteredMenuitems.push(...filteredNewItems);

          }
          this.currentPage =nextPage;
        }
        this.hasMore =response?.pagination?.hasMore ?? false;
        this.isLoadingMore = false;
        this.drc.detectChanges();
        setTimeout(() => {
          this.setupLoadMoreObserver();
        }, 0);
      },
      error: (err) => {
        console.error('❌ LOAD MORE ERROR:',err);
        this.isLoadingMore = false;
        this.drc.detectChanges();
        setTimeout(() => {
          this.setupLoadMoreObserver();
        }, 0);
      }

    });

}

  filterCategory(
    categoryId: string ): void {
    this.selectedCategoryId =String(categoryId);
    this.refreshMenuItems();
    
  }
  refreshMenuItems(): void {
    const selectedCategory =String(this.selectedCategoryId);
    if (selectedCategory === 'all') {
      this.filteredMenuitems =this.menuitems;
      return;
    }
    this.filteredMenuitems =this.menuitems.filter((item: any) => {
          let itemCategoryId = '';
          if (item.categoryId &&typeof item.categoryId === 'object') {
            itemCategoryId =String(item.categoryId?._id ?? '');
          }
          else {
            itemCategoryId =String(item.categoryId ?? '');
          }
          return (
            itemCategoryId ===selectedCategory
          );

        }
      );

  }
  addToCart(item: interfaceitemenu): void {
    this.cartservice.addToCart(item,1,[]);
  }
  ngOnDestroy(): void {
    this.observer?.disconnect();

  }

}