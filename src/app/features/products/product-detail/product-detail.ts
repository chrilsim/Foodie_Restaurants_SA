import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule} from '@angular/common';
import { MatSnackBar} from '@angular/material/snack-bar';
import {MenuService} from '../../../core/menuitem.service';
import {AddToCartService} from '../../../core/addToCart.service';
import { categoryService} from '../../../core/category.service';
import {
  interfaceitemenu,
  MenuOption,
  MenuChoice,
  SelectedMenuOption,
  CartItem
} from '../../../interface/menuitem';
import {interfaceCategory} from '../../../interface/category';
import {UsdToKhrPipe} from '../../../shared/pipes/usd-to-khr';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector:'app-product-detail',
  standalone:true,
  imports: [
    CommonModule,
    MatIconModule,
    UsdToKhrPipe,
    MatProgressSpinnerModule
  ],
  templateUrl:'./product-detail.html',
  styleUrl:'./product-detail.css'

})
export class ProductDetail implements OnInit {

  isLoading = true;
  menuItem:  interfaceitemenu = {
      _id: '',
      categoryId: '',
      name: '',
      description: '',
      price: 0,
      cost: 0,
      image: '',
      stock: 0,
      hasStock: false,
      isAvailable: false,
      options: [],
      preparationTime: 0,
      kitchenNote: '',
      isFeatured: false,
      isPopular: false
    };
  category:interfaceCategory[] = [];
  quantity = 1;
  selectedOptions:SelectedMenuOption[] = [];
  constructor(
    private route:ActivatedRoute,
    public menuService:MenuService,
    private cartservice:AddToCartService,
    private categoryService:categoryService,
    private snackBar:MatSnackBar,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategory();
    this.loadProduct();
  }
  loadProduct(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe({
      next: params => {
        const id =params.get('id');
        if (!id) {
          this.isLoading = false;
          this.showMessage('មិនមាន Product ID'
          );
          return;
        }
        this.menuService.getMenuItems().subscribe({
            next:(data:interfaceitemenu[]) => {
                const item =data.find(x =>String(x._id) ===String(id));
                if (!item) {
                  this.isLoading = false;
                  this.showMessage('រកមិនឃើញម្ហូបនេះទេ');
                  return;
                }
                this.menuItem = {...item,
                  options:item.options ?? []
                };
                this.quantity = 1;
                this.selectedOptions = [];
                this.isLoading = false;
                this.cdr.detectChanges();
              },
            error:
              error => {
                console.error(
                  'PRODUCT API ERROR:',
                  error
                );
                this.isLoading = false;
                this.showMessage('Failed to load product');
              }
          });
      }

    });

  }
  loadCategory(): void {
    this.categoryService.getCategory().subscribe({
        next:(data:interfaceCategory[]) => {
            this.category = data;
          },
        error:
          error => {
            console.error(
              'CATEGORY ERROR:',
              error
            );

          }

      });

  }
  getCurrentCategory():interfaceCategory | undefined {
    return this.category.find(
      category =>String(category._id) ===String(this.menuItem.categoryId)
    );
  }
  increaseQty(): void {
    if (!this.menuItem.hasStock) {
      this.quantity++;
      return;
    }
    if (this.menuItem.stock <= 0) {
      this.showMessage('ម្ហូបនេះអស់ស្តុកហើយ');
      return;
    }
    if (this.quantity <this.menuItem.stock) {
      this.quantity++;
      return;
    }
    this.showMessage(`មានតែ ${this.menuItem.stock} មុខ`);
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }

  }
  selectSingleOption(option: MenuOption,choice: MenuChoice): void {
    this.selectedOptions =this.selectedOptions.filter(
        selected =>selected.optionName !==option.name
      );
    this.selectedOptions.push({
      optionName:option.name,
      choiceName:choice.name,
      price:Number(choice.price) || 0
    });
  }
  toggleMultipleOption(option: MenuOption,choice: MenuChoice,event: Event): void {
    const checkbox =event.target as HTMLInputElement;
    if (checkbox.checked) {

      const exists =this.selectedOptions.some(
          selected =>selected.optionName ===option.name &&selected.choiceName ===choice.name
        );
      if (!exists) {
        this.selectedOptions.push({
          optionName:option.name,
          choiceName:choice.name,
          price:Number(choice.price) || 0
        });
      }
    }
    else {
      this.selectedOptions =
        this.selectedOptions.filter(
          selected =>!(selected.optionName ===option.name &&selected.choiceName ===choice.name));
    }
  }
  validateOptions(): boolean {
    const options =this.menuItem.options ?? [];
    for (const option of options) {
      if (!option.required) {
        continue;
      }

      const selected =this.selectedOptions.some(item =>item.optionName ===option.name );
      if (!selected) {
        this.showMessage(
          `សូមជ្រើសរើស ${option.name}`
        );
        return false;
      }
    }
    return true;
  }
  getOptionsPrice(): number {
    return this.selectedOptions.reduce(
      (total,option) =>
        total +
        Number(option.price || 0),
      0
    );
  }
  getUnitPrice(): number {
    return (
      Number(this.menuItem.price) +
      this.getOptionsPrice()
    );

  }
  getTotalPrice(): number {
    return (this.getUnitPrice() *this.quantity
    );

  }
addToCart(): void {
  if (!this.menuItem._id) {this.showMessage('Product មិនត្រឹមត្រូវ');return;}
  if (!this.menuItem.isAvailable) {
    this.showMessage(
      'ម្ហូបនេះមិនមានសម្រាប់កម្ម៉ង់ទេ'
    );
    return;
  }
  if (this.menuItem.hasStock &&this.menuItem.stock <= 0) {
    this.showMessage(
      'ម្ហូបនេះអស់ស្តុកហើយ'
    );
    return;
  }

  if (!this.validateOptions()) {
    return;
  }

  const finalPrice =this.getUnitPrice();
  this.cartservice.addToCart(
    this.menuItem,
    this.quantity,
    [...this.selectedOptions]
  );
  // this.showMessage(`${this.menuItem.name} បានបន្ថែមទៅកន្ត្រក`);

}

  private showMessage(message: string): void {
    this.snackBar.open(
      message,
      'OK',
      {
        duration: 2500,
        horizontalPosition:'center',
        verticalPosition:'top'
      }

    );

  }

}