import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatSlideToggleModule
} from '@angular/material/slide-toggle';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  MatMenuModule
} from '@angular/material/menu';

import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  MatCardModule
} from '@angular/material/card';

import { CommonModule } from '@angular/common';

import { UsdToKhrPipe } from '../../../shared/pipes/usd-to-khr';

import { MenuService } from '../../../core/menuitem.service';

import {
  interfaceitemenu,
  MenuOption,
  MenuChoice
} from '../../../interface/menuitem';

import {
  interfaceCategory
} from '../../../interface/category';

import {
  categoryService
} from '../../../core/category.service';
import { NgxImageCompressService } from 'ngx-image-compress';
@Component({
  selector: 'app-menu-management',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    UsdToKhrPipe,
    FormsModule


  ],

  templateUrl: './menu-management.html',
  styleUrl: './menu-management.css'
})
export class MenuManagement implements OnInit {


  @ViewChild('addItemDialog')
  addItemDialog!: TemplateRef<any>;

  @ViewChild('editItemDialog')
  editItemDialog!: TemplateRef<any>;
  form!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  menuitems: interfaceitemenu[] = [];
  categorys: interfaceCategory[] = [];
  selectedItem: interfaceitemenu | null = null;
  options: MenuOption[] = [];
  menuItem: interfaceitemenu = {
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

    preparationTime: 15,

    kitchenNote: '',

    isFeatured: false,

    isPopular: false

  };


  category: interfaceCategory = {

    _id: '',

    name: '',

    description: ''

  };

  selectedCategoryId: string = 'all';

  filteredMenuitems: interfaceitemenu[] = [];



  constructor(

    private snackBar: MatSnackBar,

    private cdr: ChangeDetectorRef,

    private dialog: MatDialog,

    private fb: FormBuilder,

    public menuitemService: MenuService,

    public categoeyService: categoryService,

    private imageCompress: NgxImageCompressService
  ) { }


  ngOnInit(): void {

    this.form = this.fb.group({
      categoryId: [''],
      name: [''],

      description: [''],
      price: [0],
      cost: [0],
      stock: [0],

      hasStock: [false],

      isAvailable: [true],
      preparationTime: [15],

      kitchenNote: [''],
      isFeatured: [false],

      isPopular: [false]

    });


    this.loadMenuItems();
    this.categoeyService.getCategory().subscribe({
      next: (data) => {
        this.categorys = data;
        this.cdr.detectChanges();

      },

      error: (err) => {
        console.error(
          'CATEGORY ERROR:',
          err
        );

        this.snackBar.open(
          '❌ Failed to load categories',
          'Close',
          {
            duration: 3000
          }
        );

      }

    });

  }

  loadMenuItems(): void {

    this.isLoading = true;

    this.menuitemService.getMenuItems().subscribe({
      next: (data) => {
        this.menuitems = [...data];
        this.refreshMenuItems();
        this.isLoading = false;
        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(
          'MENU ERROR:',
          err
        );


        this.isLoading = false;


        this.snackBar.open(
          '❌ Failed to load menu items',
          'Close',
          {
            duration: 3000
          }
        );


        this.cdr.detectChanges();

      }

    });

  }
  searchText: string = '';

  selectedAvailability: string = 'all';

  get totalMenu(): number {

    return this.menuitems.length;

  }


  get availableMenu(): number {

    return this.menuitems.filter(
      item => item.isAvailable
    ).length;

  }
  get unavailableMenu(): number {

    return this.menuitems.filter(
      item => !item.isAvailable
    ).length;

  }
  get popularMenu(): number {

    return this.menuitems.filter(
      item => item.isPopular
    ).length;

  }

  get displayedMenuitems(): interfaceitemenu[] {

    const search =
      this.searchText
        .toLowerCase()
        .trim();

    return this.filteredMenuitems.filter(
      item => {

        const matchSearch =

          !search ||

          item.name
            ?.toLowerCase()
            .includes(search)

          ||

          item.description
            ?.toLowerCase()
            .includes(search);


        const matchStatus =

          this.selectedAvailability === 'all'

          ||

          (
            this.selectedAvailability ===
            'available' &&
            item.isAvailable
          )

          ||

          (
            this.selectedAvailability ===
            'unavailable' &&
            !item.isAvailable
          )

          ||

          (
            this.selectedAvailability ===
            'popular' &&
            item.isPopular
          );


        return (
          matchSearch &&
          matchStatus
        );

      }
    );

  }

  clearSearch(): void {

    this.searchText = '';

  }



  resetFilters(): void {

    this.searchText = '';

    this.selectedAvailability = 'all';

    this.selectedCategoryId = 'all';

    this.refreshMenuItems();

  }
  filterCategory(
    categoryId: string
  ): void {

    this.selectedCategoryId =
      categoryId;


    this.refreshMenuItems();

  }

  refreshMenuItems(): void {

    if (
      this.selectedCategoryId === 'all'
    ) {

      this.filteredMenuitems =
        [...this.menuitems];

      this.cdr.detectChanges();

      return;

    }


    this.filteredMenuitems =
      this.menuitems.filter(

        item => {

          const itemCategoryId =
            typeof item.categoryId === 'object'
              ? (item.categoryId as any)._id
              : item.categoryId;


          return String(itemCategoryId) ===
            String(this.selectedCategoryId);

        }

      );


    this.cdr.detectChanges();

  }


  toggleAvailability(
    item: interfaceitemenu
  ): void {

    const oldStatus =
      item.isAvailable;


    const newStatus = !oldStatus;
    item.isAvailable =
      newStatus;


    this.menuitemService
      .updateAvailability(
        item._id,
        newStatus
      )
      .subscribe({

        next: () => {

          item.isAvailable =
            newStatus;


          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'AVAILABILITY ERROR:',
            err
          );
          item.isAvailable = oldStatus;

          this.snackBar.open(
            '❌ Failed to update availability',
            'Close',
            {
              duration: 3000
            }
          );

          this.cdr.detectChanges();

        }

      });

  }
  openAddItem(): void {
    this.resetForm(); this.dialog.open(
      this.addItemDialog,
      {
        width: '650px',
        maxWidth: '95vw'
      }
    );
  }
  resetForm(): void {
    this.form.reset({
      categoryId: '',
      name: '',
      description: '',
      price: 0,
      cost: 0,
      stock: 0,
      hasStock: false,
      isAvailable: true,
      preparationTime: 15,
      kitchenNote: '',
      isFeatured: false,
      isPopular: false

    });
    this.selectedFile = null;
    this.selectedItem = null;
    this.options = [];
    this.cdr.detectChanges();

  }

  // onFileChange(event: Event): void {
  //   const input =event.target as HTMLInputElement;
  //   if (input.files &&input.files.length > 0) {
  //     this.selectedFile =input.files[0];
  //   }

  // }
  async onFileChange(event: Event): Promise<void> {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image');
      return;
    }

    console.log('Original:', file.size);
    const base64 = await this.fileToBase64(file);
    const compressedBase64 =
      await this.imageCompress.compressFile(
        base64,
        -1,
        70,
        70
      );

    this.imagePreview = compressedBase64;
    this.selectedFile =this.base64ToFile(
        compressedBase64,
        file.name
      );
    console.log('Compressed:',this.selectedFile.size);
  }
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  private base64ToFile(base64: string,fileName: string): File {

    const parts = base64.split(',');
    const mime =parts[0].match(/:(.*?);/)?.[1]|| 'image/jpeg';

    const byteString = atob(parts[1]);

    const bytes =
      new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      bytes[i] =
        byteString.charCodeAt(i);
    }

    return new File(
      [bytes],
      fileName,
      {
        type: mime
      }
    );
  }
  addOption(): void {
    this.options.push({

      name: '',

      type: 'single',

      required: false,

      choices: []

    });

    this.cdr.detectChanges();
  }

  removeOption(
    optionIndex: number
  ): void {

    if (
      optionIndex < 0 ||
      optionIndex >= this.options.length
    ) {

      return;

    }


    this.options.splice(
      optionIndex,
      1
    );


    this.cdr.detectChanges();

  }

  addChoice(
    optionIndex: number
  ): void {

    if (
      !this.options[optionIndex]
    ) {

      return;

    }


    this.options[
      optionIndex
    ].choices.push({

      name: '',

      price: 0

    });


    this.cdr.detectChanges();

  }


  removeChoice(
    optionIndex: number,
    choiceIndex: number
  ): void {

    if (
      !this.options[optionIndex]
    ) {

      return;

    }


    this.options[
      optionIndex
    ].choices.splice(
      choiceIndex,
      1
    );


    this.cdr.detectChanges();

  }

  onSubmit(): void {

    if (
      this.form.invalid
    ) {

      this.snackBar.open(
        '⚠️ Please fill all required fields',
        'Close',
        {
          duration: 3000
        }
      );

      return;

    }
    if (
      !this.validateOptions()
    ) {

      return;

    }

    const formData = new FormData();
    formData.append(
      'categoryId',
      this.form.value.categoryId || ''
    );


    formData.append(
      'name',
      this.form.value.name || ''
    );


    formData.append(
      'description',
      this.form.value.description || ''
    );


    formData.append(
      'price',
      String(
        this.form.value.price ?? 0
      )
    );


    formData.append(
      'cost',
      String(
        this.form.value.cost ?? 0
      )
    );


    formData.append(
      'stock',
      String(
        this.form.value.stock ?? 0
      )
    );


    formData.append(
      'hasStock',
      String(
        this.form.value.hasStock ?? false
      )
    );


    formData.append(
      'isAvailable',
      String(
        this.form.value.isAvailable ?? true
      )
    );
    formData.append(
      'options',
      JSON.stringify(
        this.options
      )
    );
    formData.append(
      'preparationTime',
      String(
        this.form.value.preparationTime ?? 15
      )
    );


    formData.append(
      'kitchenNote',
      this.form.value.kitchenNote || ''
    );


    formData.append(
      'isFeatured',
      String(
        this.form.value.isFeatured ?? false
      )
    );


    formData.append(
      'isPopular',
      String(
        this.form.value.isPopular ?? false
      )
    );


    if (
      this.selectedFile
    ) {

      formData.append(
        'image',
        this.selectedFile
      );

    }

    this.isLoading = true;
    this.menuitemService
      .create(formData)
      .subscribe({

        next: (response: any) => {
          const newItem =
            response?.menuItem ||
            response;

          this.menuitems = [

            newItem,

            ...this.menuitems

          ];

          this.refreshMenuItems();
          this.isLoading = false;
          this.snackBar.open(
            '✅ Saved successfully',
            'Close',
            {
              duration: 3000,

              horizontalPosition:
                'right',

              verticalPosition:
                'top'
            }
          );
          this.dialog.closeAll();
          this.resetForm();
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(
            'CREATE ERROR:',
            err
          );

          this.isLoading = false;
          this.snackBar.open(
            err?.error?.message ||
            '❌ Save failed',
            'Close',
            {
              duration: 3000,

              horizontalPosition:
                'right',

              verticalPosition:
                'top'
            }
          );

          this.cdr.detectChanges();
        }

      });

  }

  validateOptions(): boolean {
    for (
      let i = 0;
      i < this.options.length;
      i++
    ) {

      const option =
        this.options[i];
      if (
        !option.name.trim()
      ) {

        this.snackBar.open(
          `⚠️ Option ${i + 1} needs a name`,
          'Close',
          {
            duration: 3000
          }
        );

        return false;

      }

      if (
        option.choices.length === 0
      ) {

        this.snackBar.open(
          `⚠️ "${option.name}" needs at least one choice`,
          'Close',
          {
            duration: 3000
          }
        );

        return false;

      }

      for (
        let j = 0;
        j < option.choices.length;
        j++
      ) {

        const choice =
          option.choices[j];


        if (
          !choice.name.trim()
        ) {

          this.snackBar.open(
            `⚠️ Choice ${j + 1} in "${option.name}" needs a name`,
            'Close',
            {
              duration: 3000
            }
          );

          return false;

        }


        if (
          choice.price < 0
        ) {

          this.snackBar.open(
            `⚠️ Price cannot be negative`,
            'Close',
            {
              duration: 3000
            }
          );

          return false;

        }

      }

    }


    return true;

  }
  openEditDialog(id: string): void {
    const item = this.menuitems.find(x => x._id === id);
    if (!item) {
      this.snackBar.open(
        '❌ Menu item not found',
        'Close',
        {
          duration: 3000
        }
      );

      return;

    }
    this.selectedItem = item;
    this.form.patchValue({
      categoryId:
        this.getCategoryId(
          item.categoryId
        ),

      name:
        item.name,

      description:
        item.description,

      price:
        item.price,

      cost:
        item.cost,

      stock:
        item.stock,

      hasStock:
        item.hasStock,

      isAvailable:
        item.isAvailable,

      preparationTime:
        item.preparationTime ??
        15,

      kitchenNote:
        item.kitchenNote ??
        '',

      isFeatured:
        item.isFeatured ??
        false,

      isPopular:
        item.isPopular ??
        false

    });

    this.options = item.options
      ? JSON.parse(
        JSON.stringify(
          item.options
        )
      )
      : [];


    this.selectedFile = null;
    this.dialog.open(
      this.editItemDialog,
      {
        width: '650px',
        maxWidth: '95vw'
      }
    );

  }


  getCategoryId(
    categoryId: any
  ): string {

    if (
      typeof categoryId === 'object' &&
      categoryId !== null
    ) {

      return String(
        categoryId._id || ''
      );

    }


    return String(
      categoryId || ''
    );

  }


  closeDialog(): void {

    this.dialog.closeAll();
    this.resetForm();

  }
  onUpdate(item: interfaceitemenu): void {

    if (!this.form.valid) {
      this.snackBar.open(
        '⚠️ Please fill all required fields',
        'Close',
        {
          duration: 3000
        }
      );
      return;
    }
    if (!this.validateOptions()) {
      return;
    }
    const formData = new FormData();
    formData.append(
      'categoryId',
      this.form.value.categoryId || ''
    );


    formData.append(
      'name',
      this.form.value.name || ''
    );


    formData.append(
      'description',
      this.form.value.description || ''
    );


    formData.append(
      'price',
      String(
        this.form.value.price ?? 0
      )
    );


    formData.append(
      'cost',
      String(
        this.form.value.cost ?? 0
      )
    );

    formData.append(
      'stock',
      String(
        this.form.value.stock ?? 0
      )
    );


    formData.append(
      'hasStock',
      String(
        this.form.value.hasStock ?? false
      )
    );


    formData.append(
      'isAvailable',
      String(
        this.form.value.isAvailable ?? true
      )
    );

    formData.append(
      'options',
      JSON.stringify(
        this.options
      )
    );

    formData.append(
      'preparationTime',
      String(
        this.form.value.preparationTime ?? 15
      )
    );


    formData.append(
      'kitchenNote',
      this.form.value.kitchenNote || ''
    );
    formData.append(
      'isFeatured',
      String(
        this.form.value.isFeatured ?? false
      )
    );


    formData.append(
      'isPopular',
      String(
        this.form.value.isPopular ?? false
      )
    );
    if (this.selectedFile) {
      formData.append(
        'image',
        this.selectedFile
      );

    }
    this.isLoading = true;
    this.menuitemService.update(item._id, formData).subscribe({
      next: (response: any) => {
        const updatedItem =
          response?.menuItem ||
          response;
        const index = this.menuitems.findIndex(x => x._id === updatedItem._id);

        if (index !== -1) {

          this.menuitems[index] =
            updatedItem;

        }
        this.menuitems =
          [...this.menuitems];


        this.refreshMenuItems();


        this.isLoading =
          false;


        this.snackBar.open(
          '✅ Updated successfully',
          'Close',
          {
            duration: 3000,

            horizontalPosition:
              'right',

            verticalPosition:
              'top'
          }
        );

        this.dialog.closeAll();
        this.resetForm();
        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(
          'UPDATE ERROR:',
          err
        );

        this.isLoading = false;
        this.snackBar.open(
          err?.error?.message ||
          '❌ Update failed',
          'Close',
          {
            duration: 3000,

            horizontalPosition:
              'right',

            verticalPosition:
              'top'
          }
        );
        this.cdr.detectChanges();

      }

    });
  }
  deleteItem(id: string): void {
    if (!id) {

      return;

    }
    const confirmDelete =
      confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) {
      return;
    }
    this.isLoading = true;
    this.menuitemService.delete(id).subscribe({
      next: () => {
        this.menuitems =
          this.menuitems.filter(

            item =>
              item._id !== id

          );
        this.refreshMenuItems();
        this.isLoading = false;
        this.snackBar.open(
          '✅ Deleted successfully',
          'Close',
          {
            duration: 3000,

            horizontalPosition:
              'right',

            verticalPosition:
              'top'
          }
        );


        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(
          'DELETE ERROR:',
          err
        );


        this.isLoading =
          false;


        this.snackBar.open(
          err?.error?.message ||
          '❌ Delete failed',
          'Close',
          {
            duration: 3000,

            horizontalPosition:
              'right',

            verticalPosition:
              'top'
          }
        );


        this.cdr.detectChanges();

      }

    });

  }

}