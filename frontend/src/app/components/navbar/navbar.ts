import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-navbar',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected isScrolled = false;
  protected isMenuOpen = false;

  @HostListener('window:scroll')
  protected handleScroll(): void {
    this.isScrolled = window.scrollY > 24;
    if (this.isScrolled) {
      this.isMenuOpen = false;
    }
  }

  protected toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
