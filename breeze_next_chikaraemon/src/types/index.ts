export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Pen {
    id: number;
    name: string;
    price: number;
    created_at: string;
    updated_at: string;
}

export interface Customer {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    customer_id: number;
    pen_id: number;
    num: number;
    orderday: string;
    shipping: boolean;
    created_at: string;
    updated_at: string;
    customer: Customer;
    pen: Pen;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export interface ApiResponse<T> {
    data: T;
    meta?: PaginationMeta;
    status?: string;
    message?: string;
}

export interface OrdersResponse {
    orders: Order[];
    meta: PaginationMeta;
}

export interface OrderCreateResponse {
    pens: Pen[];
    customers: Customer[];
}

export interface OrderEditResponse {
    data: Order;
    pens: Pen[];
    customers: Customer[];
}

export interface ErrorResponse {
    errors: {
        [key: string]: string[];
    };
    message: string;
}

export interface PensResponse {
    data: {
        data: Pen[];
        meta: PaginationMeta;
    };
}
