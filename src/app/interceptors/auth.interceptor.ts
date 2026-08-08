import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { getIdToken } from 'firebase/auth';
import { auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return next(req);
  }

  return from(getIdToken(currentUser)).pipe(
    switchMap((token) => {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(cloned);
    }),
  );
};
