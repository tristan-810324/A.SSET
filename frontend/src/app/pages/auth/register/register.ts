import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',

})
export class Register {
  email: string = '';
  submitted: boolean = false;

  registerAccount() {
    console.log('Register submitted with email:', this.email);
    this.submitted = true;
    // Ilagay dito ang pansamantalang logic o redirection kung kinakailangan
  }

  signInWithGoogle() {
    console.log('Google Sign-In clicked in Register');
 
  }
}