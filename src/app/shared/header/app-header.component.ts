import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  onResetAll(): void {
    this.resetAll.emit();
  }

  onResetEnigma(): void {
    this.resetEnigma.emit();
  }
}
