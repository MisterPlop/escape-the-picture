import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
})
export class AppFooterComponent {
  @Output() devSolve = new EventEmitter<void>();

  onDevSolve(): void {
    this.devSolve.emit();
  }
}
