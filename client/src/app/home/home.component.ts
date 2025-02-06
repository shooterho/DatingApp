import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-home',
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  registerMode = false;
  users: any;

  registerToggle() {
    this.registerMode = !this.registerMode;
  }
  cancelRegistrationMode(event: boolean) {
    console.log('cancelRegistrationMode called');
    this.registerMode = event;
  }
}
