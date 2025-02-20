import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountSerivce = inject(AccountService);
  const toastr = inject(ToastrService);

  if (
    accountSerivce.roles().includes('Admin') ||
    accountSerivce.roles().includes('Moderator')
  ) {
    return true;
  } else {
    toastr.error('You cannot enter this area');
    return false;
  }
};
