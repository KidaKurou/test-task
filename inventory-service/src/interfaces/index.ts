// Интерфейсы для запросов
export interface CreateProductDto {
    plu: string;
    name: string;
}

export interface CreateInventoryDto {
    product_plu: string;
    shop_id: number;
    shelf_quantity: number;
    order_quantity: number;
}

export interface UpdateInventoryQuantityDto {
    shelf_quantity?: number;
    order_quantity?: number;
}

// Интерфейсы для фильтров
export interface ProductFilters {
    name?: string;
    plu?: string;
}

export interface InventoryFilters {
    plu?: string;
    shop_id?: number;
    shelf_quantity_from?: number;
    shelf_quantity_to?: number;
    order_quantity_from?: number;
    order_quantity_to?: number;
}

// Интерфейс для отправки событий в history-service
export interface InventoryEvent {
    shop_id: number;
    plu: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    changes: {
        shelf_quantity?: {
            before?: number;
            after?: number;
        };
        order_quantity?: {
            before?: number;
            after?: number;
        };
    };
    timestamp: Date;
}