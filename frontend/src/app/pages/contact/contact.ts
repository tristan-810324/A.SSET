import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-contact',
  templateUrl: './contact.html',
})
export class Contact {
  protected submitted = false;

  protected submitForm(): void {
    this.submitted = true;
  }
}
