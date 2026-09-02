import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { RouterLink } from '@angular/router';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  interfaceCategory
} from '../../../../interface/category';

import {
  interfaceitemenu
} from '../../../../interface/menuitem';

import {
  MenuService
} from '../../../../core/menuitem.service';

import {
  categoryService
} from '../../../../core/category.service';

import {
  AddToCartService
} from '../../../../core/addToCart.service';

import {
  UsdToKhrPipe
} from '../../../../shared/pipes/usd-to-khr';


@Component({

  selector: 'app-order-online',

  imports: [

    CommonModule,

    MatIconModule,

    RouterLink,

    MatProgressSpinnerModule,

    UsdToKhrPipe

  ],

  templateUrl: './order-online.html',

  styleUrl: './order-online.css',

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]

})


export class OrderOnline implements OnInit {

  constructor(
    public serviceMenuItem:MenuService,
    private categoryService:categoryService,
    private cartservice:AddToCartService,
    private drc:ChangeDetectorRef

  ) { }
  menuitems:interfaceitemenu[] = [];
  filteredMenuitems:interfaceitemenu[] = [];
  popularItems:interfaceitemenu[] = [];
  categorys:interfaceCategory[] = [];
  selectedCategoryId:string = 'all';
  searchText:string = '';

  isLoading:boolean = false;

  menuItem:interfaceitemenu = {

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


  ngOnInit(): void {
    this.loadCategories();
    this.loadMenuItems();

  }


  loadCategories(): void {
    this.categoryService.getCategory()
      .subscribe({
        next: (data) => {  
          this.categorys =data || [];
          this.drc.detectChanges();

        },

        error: (err) => {
          console.error(
            'CATEGORY ERROR:',
            err
          );
          this.categorys = [];

        }

      });

  }


  loadMenuItems(): void {

    this.isLoading = true;
    this.serviceMenuItem
      .getMenuItems()
      .subscribe({
        next: (data) => {
          this.menuitems =data.filter((item: any) =>item.isAvailable === true);
          this.popularItems =this.menuitems.slice(0, 8);
          this.refreshMenuItems();
          this.isLoading = false;
          this.drc.detectChanges();

        },
        error: (err) => {
          console.error(
            'MENU ERROR:',
            err
          );
          this.menuitems = [];
          this.filteredMenuitems = [];
          this.isLoading = false;
          this.drc.detectChanges();
        }

      });

  }

  filterCategory(categoryId: string | undefined): void {
    this.selectedCategoryId =String(categoryId);
    this.refreshMenuItems();

  }

  searchMenu(  event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    this.refreshMenuItems();
  }

  refreshMenuItems(): void {
    const search =this.searchText.trim().toLowerCase();
    this.filteredMenuitems =this.menuitems.filter((item: any) => {

        let itemCategoryId = '';
        if (item.categoryId) {

          if (typeof item.categoryId === 'object') {
            itemCategoryId =
              String(
                item.categoryId._id || ''
              );

          }
          else {

            itemCategoryId =
              String(
                item.categoryId
              );
          }
        }
        const matchCategory =this.selectedCategoryId === 'all' || itemCategoryId ===String(this.selectedCategoryId);

        const matchSearch =!search||
          item.name?.toLowerCase().includes(search)
          ||
          item.description?.toLowerCase().includes(search);
        return (
          matchCategory &&
          matchSearch
        );
      });
  }
  addToCart(item: interfaceitemenu): void {

    this.cartservice.addToCart(item,1,[]);
  }
  getImage(image: string): string {
    if (!image) {
      return 'assets/default-food.jpg';
    }
    if (image.startsWith('http')) {
      return image;
    }
    return image;

  }

  isOutOfStock(item: interfaceitemenu): boolean {
    if (!item.hasStock) {
      return false;
    }
    return (Number(item.stock || 0) <= 0);
  }


  canOrder(
    item: interfaceitemenu
  ): boolean {

    if (!item.isAvailable) {
      return false;
    }
    if (item.hasStock &&Number(item.stock || 0) <= 0) {
      return false;
    }
    return true;
  }
  scrollLeft(): void {
    const menuBar =document.querySelector('.menu-bar') as HTMLElement;
    if (menuBar) {
      menuBar.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {

    const menuBar =
      document.querySelector(
        '.menu-bar'
      ) as HTMLElement;


    if (menuBar) {

      menuBar.scrollBy({

        left: 300,

        behavior: 'smooth'

      });

    }

  }

}