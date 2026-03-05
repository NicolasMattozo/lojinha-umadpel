import type { Product } from '../types';

export const products: Product[] = [
    {
        id: 1,
        name: "Camiseta POR INTEIRO - Modelo 01",
        price: 50.00,
        image: "/modelo-01-jesus.jpg",
        description: "Camiseta vermelha vibrante com estampa minimalista frontal 'POR INTEIRO' e costas com ilustração artística de Jesus e versículo 'Pois nele vivemos'. Coleção 2026.",
        availableUntil: "2026-03-05T23:59:59-03:00"
    },
    {
        id: 2,
        name: "Camiseta POR INTEIRO - Modelo 02",
        price: 50.00,
        image: "/modelo-02-text.jpg",
        description: "Camiseta vermelha vibrante com estampa tipográfica 'POR INTEIRO' na frente e 'POIS NELE VIVEMOS' nas costas. Design moderno e impactante. Coleção 2026.",
        availableUntil: "2026-03-05T23:59:59-03:00"
    }
];
