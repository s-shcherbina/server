import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from '../types';

export class GeneralResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((data) => {
        if (data instanceof Error) {
          return {
            status_code: statusCode,
            detail: null,
            error: data.stack,
          };
        }
        return {
          status_code: statusCode,
          detail: data,
          result: 'working',
        };
      }),
    );
  }
}
