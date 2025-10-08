import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  @Output() resetAll = new EventEmitter<void>();
  @Output() resetEnigma = new EventEmitter<void>();

  showHomeWarning = signal(false);

  constructor(private router: Router) {}

  onResetAll(): void {
    this.resetAll.emit();
  }

  onResetEnigma(): void {
    this.resetEnigma.emit();
  }

  showHomeConfirmation(): void {
    this.showHomeWarning.set(true);
  }

  cancelHomeNavigation(): void {
    this.showHomeWarning.set(false);
  }

  confirmHomeNavigation(): void {
    // Wipe toutes les données de progression
    window.dispatchEvent(new CustomEvent('reset-all'));
    this.showHomeWarning.set(false);
    // Retourner à l'accueil
    this.router.navigate(['/']);
  }
}
