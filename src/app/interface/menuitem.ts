export interface MenuChoice {

  name: string;

  price: number;

}


export interface MenuOption {

  _id?: string;

  name: string;

  type: 'single' | 'multiple';

  required: boolean;

  choices: MenuChoice[];

}


export interface SelectedMenuOption {

  optionName: string;

  choiceName: string;

  price: number;

}


export interface interfaceitemenu {

  _id: string;

  categoryId: string;

  name: string;

  description: string;

  price: number;

  cost: number;

  image: string;

  stock: number;

  hasStock: boolean;

  isAvailable: boolean;

  options?: MenuOption[];

  preparationTime?: number;

  kitchenNote?: string;

  isFeatured?: boolean;

  isPopular?: boolean;

}


export interface CartItem
  extends interfaceitemenu {

  quantity: number;

  selectedOptions?: SelectedMenuOption[];

  finalPrice: number;

}
export interface CartItem
  extends interfaceitemenu {

  cartItemId?: string;

  quantity: number;

  selectedOptions?: SelectedMenuOption[];

  finalPrice: number;
}