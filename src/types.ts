export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    availableUntil?: string;
}

export interface CartItem extends Product {
    quantity: number;
    size: string;
}
