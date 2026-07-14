/**
 * Shared, cross-cutting types used across the app.
 * Placeholder — to be expanded as features are implemented.
 */

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: string;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
