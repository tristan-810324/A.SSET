import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { About } from '../about/about';
import { Contact } from '../contact/contact';

@Component({
  imports: [RouterLink, About, Contact],
  selector: 'app-hero',
  templateUrl: './hero.html',
})
export class Hero {}
