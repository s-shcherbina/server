export interface IPayloadToken {
  email: string;
  name?: string;
  picture?: string;
}

export interface Response<T> {
  status_code: number;
  detail: T;
}

export enum Role {
  OWNWER = 1000,
  ADMIN = 500,
  MEMBER = 100,
}
