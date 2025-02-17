import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { LikesService } from '../_services/likes.service';
import { Member } from '../_models/member';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  imports: [FormsModule, MemberCardComponent, ButtonsModule, PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit, OnDestroy {
  baseUrl = environment.apiUrl;
  likesService = inject(LikesService);
  predicate = 'liked';
  members: Member[] = [];
  pageNumber = 1;
  pageSize = 5;

  ngOnInit() {
    this.loadLike();
  }

  ngOnDestroy(): void {
    this.likesService.paginatedResult.set(null);
  }

  getTitle() {
    switch (this.predicate) {
      case 'liked':
        return 'Members you like';
      case 'likedBy':
        return 'Members who like';
      default:
        return 'Mutual';
    }
  }

  loadLike() {
    console.log(this.predicate);
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize);
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadLike();
  }
}
