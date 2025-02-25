import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      console.log('error status :', error.status);
      switch (error.status) {
        case 400:
          console.log(error);
          if (error.error.errors) {
            console.log('error: ', error);
            console.log('error.error: ', error.error);
            console.log('error.error.errors: ', error.error.errors);
            const modalStateErrors = [];
            for (const key in error.error.errors) {
              modalStateErrors.push(error.error.errors[key]);
            }
            throw modalStateErrors.flat();
          } else if (Array.isArray(error.error)) {
            // Extract error messages from the array of error objects
            const errorMessagesArray: string[] = error.error.map(
              (err: any) => err.description || err.message
            );

            // Prepare a single string for the toastr display by joining messages with a newline
            const toastrErrorMessage: string = errorMessagesArray.join('\n');

            toastr.error(toastrErrorMessage, error.status.toString());
            console.log('errorsArray', error.error);

            // Throw the array of error messages so the component can handle it
            throw errorMessagesArray;
          } else {
            toastr.error(error.error, error.statusCode);
          }
          break;
        case 401:
          toastr.error('Unauthorized', error.status);
          break;
        case 404:
          router.navigateByUrl('/not-found');
          break;
        case 500:
          console.log('error: ', error.messages);
          const navigationExtra: NavigationExtras = {
            state: { error: error.error },
          };
          router.navigateByUrl('/server-error', navigationExtra);
          break;
        default:
          console.log(error);
          toastr.error('Something unexpected went wrong');
          break;
      }

      throw error;
    })
  );
};
