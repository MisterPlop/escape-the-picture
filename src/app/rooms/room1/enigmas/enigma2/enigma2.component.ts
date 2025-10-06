import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enigma2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enigma2.component.html',
  styleUrl: './enigma2.component.scss'
})
export class Enigma2Component {
  @Output() solved = new EventEmitter<string>();

  mouseX = signal(0);
  mouseY = signal(0);
  colorInput = signal('');
  showHint = signal(false);
  attemptFailed = signal(false);
  revealedZones = signal<{ red: boolean; yellow: boolean }>({ red: false, yellow: false });

  // Couleur cible
  private readonly TARGET_COLOR = '#DF986C';
  private readonly TARGET_COLOR_VARIATIONS = [
    '#DF986C',
    '#df986c',
    'DF986C',
    'df986c',
  ];

  onMouseMove(event: MouseEvent): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.mouseX.set(event.clientX - rect.left);
    this.mouseY.set(event.clientY - rect.top);
  }

  onColorSubmit(): void {
    const input = this.colorInput().trim();
    
    if (this.TARGET_COLOR_VARIATIONS.includes(input)) {
      this.solved.emit(this.TARGET_COLOR);
    } else {
      this.attemptFailed.set(true);
      setTimeout(() => {
        this.attemptFailed.set(false);
      }, 2000);
    }
  }

  toggleHint(): void {
    this.showHint.set(!this.showHint());
  }

  onRedZoneClick(): void {
    this.revealedZones.set({ ...this.revealedZones(), red: true });
  }

  onYellowZoneClick(): void {
    this.revealedZones.set({ ...this.revealedZones(), yellow: true });
  }
}
