export interface Product {
    id: number;
    name: string;
    price: number;
    span: string;
    image: string;
    description: string;
    availableUntil?: string;
}

export interface CartItem extends Product {
    quantity: number;
    size: string;
}
