import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { AccountService } from './account.service';
import { of, single, tap } from 'rxjs';
import { Photo } from '../_models/photo';
import { UserParams } from '../_models/userParams';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);
  accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null); //a list of current page of users
  memberCache = new Map(); //used to cache browsed pages of users
  userParams = signal<UserParams>(
    new UserParams(this.accountService.currentUser())
  );

  getMembers() {
    const response = this.memberCache.get(
      Object.values(this.userParams()).join('-')
    );
    if (response) return setPaginatedResponse(response, this.paginatedResult);

    let params = setPaginationHeaders(
      this.userParams().pageNumber,
      this.userParams().pageSize
    );

    //Extra query params for filter
    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    return this.http
      .get<Member[]>(this.baseUrl + 'users', {
        observe: 'response', //get normal response instead of only body
        params: params,
      })
      .subscribe({
        next: (response) => {
          setPaginatedResponse(response, this.paginatedResult);
          this.memberCache.set(
            Object.values(this.userParams()).join('-'),
            response
          );
        },
      });
  }

  resetUserParams() {
    this.userParams.set(new UserParams(this.accountService.currentUser()));
  }

  getMember(userName: string) {
    const member: Member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: Member) => m.userName === userName);

    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + userName);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      tap(() => {
        // this.members.update((members) => {
        //   return members.map((m) =>
        //     m.userName === member.userName ? member : m
        //   );
        // });
      })
    );
  }

  deletePhoto(photo: Photo) {
    return this.http
      .delete(this.baseUrl + 'users/delete-photo/' + photo.id)
      .pipe(
        tap(() => {
          // this.members.update((members) => {
          //   return members.map((member) => {
          //     if (member.photos.includes(photo)) {
          //       member.photos = member.photos.filter((p) => {
          //         return p.id !== photo.id;
          //       });
          //     }
          //     return member;
          //   });
          // });
        })
      );
  }

  setMainPhoto(photo: Photo) {
    return this.http
      .put(this.baseUrl + 'users/set-main-photo/' + photo.id, {})
      .pipe(
        tap(() => {
          // this.updatePhotoUrl(photo);
        })
      );
  }

  updatePhotoUrl(photo: Photo) {
    this.members.update((members) => {
      return members.map((member) => {
        if (member.photos.includes(photo)) {
          member.photoUrl = photo.url;
        }
        return member;
      });
    });
  }
}
