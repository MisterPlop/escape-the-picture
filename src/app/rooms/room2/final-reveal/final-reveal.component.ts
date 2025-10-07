import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-final-reveal-room2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './final-reveal.component.html',
  styleUrl: './final-reveal.component.scss',
})
export class FinalRevealRoom2Component {
  @Output() continue = new EventEmitter<void>();

  onContinue(): void {
    this.continue.emit();
  }
}
