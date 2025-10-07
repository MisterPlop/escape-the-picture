import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './shared/header/app-header.component';
import { AppFooterComponent } from './shared/footer/app-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent],
  template: `
    <app-header (resetAll)="onResetAll()" (resetEnigma)="onResetEnigma()"></app-header>
    <router-outlet></router-outlet>
    <app-footer (devSolve)="onDevSolve()"></app-footer>
  `,
  styles: [],
})
export class AppComponent {
  title = 'Escape The Picture';

  onResetAll(): void {
    window.dispatchEvent(new CustomEvent('reset-all'));
  }

  onResetEnigma(): void {
    window.dispatchEvent(new CustomEvent('reset-enigma'));
  }

  onDevSolve(): void {
    // Émettre un événement global pour résoudre l'énigme actuelle
    window.dispatchEvent(new CustomEvent('dev-solve-enigma'));
  }
}
