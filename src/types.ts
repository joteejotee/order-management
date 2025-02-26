export interface ApiResponse<T> {
    data: T;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Pen {
    id: number;
    name: string;
    // 他の必要なプロパティ
}

export interface Customer {
    id: number;
    name: string;
    // 他の必要なプロパティ
}

export interface Order {
    id: number;
    // 他の必要なプロパティ
}

export interface Pagination {
    current_page: number;
    total: number;
    // 他の必要なプロパティ
}

export interface RegisterProps {
    setErrors: (errors: any) => void;
    setStatus: (status: string | null) => void;
    name?: string;
    email?: string;
}
