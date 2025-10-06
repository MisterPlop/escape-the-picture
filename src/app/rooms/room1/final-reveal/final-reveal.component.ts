import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-final-reveal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './final-reveal.component.html',
  styleUrl: './final-reveal.component.scss'
})
export class FinalRevealComponent {
  @Output() continueToRoom2 = new EventEmitter<void>();

  artworkTitle = 'Autoportrait à la mèche';
  artist = 'Pablo Picasso';
  year = '1907';
  color = '#DF986C';
  colorDescription = '⅔ de rouge et ⅓ de jaune';

  onContinue(): void {
    this.continueToRoom2.emit();
  }
}
