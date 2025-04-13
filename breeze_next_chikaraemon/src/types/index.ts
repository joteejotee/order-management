import type { User, UserData } from './user';

export interface ApiResponse<T> {
  data: T;
}

export type { User, UserData };
