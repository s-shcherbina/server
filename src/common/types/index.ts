export interface IPayloadToken {
  email: string;
  name?: string;
  picture?: string;
}

export interface Response<T> {
  status_code: number;
  detail: T;
}
