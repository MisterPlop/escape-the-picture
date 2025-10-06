import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LetterHint {
  letter: string;
  position: number;
  value: number;
  revealed: boolean;
}

@Component({
  selector: 'app-enigma3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enigma3.component.html',
  styleUrl: './enigma3.component.scss',
})
export class Enigma3Component {
  @Output() solved = new EventEmitter<string>();

  sequenceInput = signal('');
  showHint = signal(false);
  attemptFailed = signal(false);
  artistName = 'PICASSO';
  protected readonly String = String;

  letterHints = signal<LetterHint[]>([
    { letter: 'P', position: 1, value: 16, revealed: false },
    { letter: 'I', position: 2, value: 9, revealed: false },
    { letter: 'C', position: 3, value: 3, revealed: false },
    { letter: 'A', position: 4, value: 1, revealed: false },
    { letter: 'S', position: 5, value: 19, revealed: false },
    { letter: 'S', position: 6, value: 19, revealed: false },
    { letter: 'O', position: 7, value: 15, revealed: false },
  ]);

  // Séquence cible
  private readonly TARGET_SEQUENCE = '16,9,3,1,19,19,15';
  private readonly TARGET_VARIATIONS = [
    '16,9,3,1,19,19,15',
    '16 9 3 1 19 19 15',
    '1693119191',
    '16-9-3-1-19-19-15',
  ];

  onSequenceSubmit(): void {
    const input = this.sequenceInput().trim();

    if (this.TARGET_VARIATIONS.includes(input)) {
      this.solved.emit(this.TARGET_SEQUENCE);
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

  revealLetter(index: number): void {
    const hints = this.letterHints();
    hints[index].revealed = true;
    this.letterHints.set([...hints]);
  }

  getAlphabetPosition(letter: string): number {
    return letter.toUpperCase().charCodeAt(0) - 64;
  }
}
