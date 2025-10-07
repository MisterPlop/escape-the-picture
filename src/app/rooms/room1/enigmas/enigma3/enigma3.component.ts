import { Component, signal, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LetterCard {
  letter: string;
  value: number;
}

interface LetterFeedback {
  letter: string;
  status: 'correct' | 'present' | 'absent';
}

@Component({
  selector: 'app-enigma3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enigma3.component.html',
  styleUrl: './enigma3.component.scss',
})
export class Enigma3Component implements OnInit, OnDestroy {
  @Output() solved = new EventEmitter<string>();
  @Output() reset = new EventEmitter<void>();

  private devSolveListener?: (event: Event) => void;

  // État du jeu
  artistGuess = signal('');
  artistGuessAttempts = signal<LetterFeedback[][]>([]);
  artistFound = signal(false);
  artistAttemptFailed = signal(false);
  showPhase2Content = signal(false);

  sequenceInput = signal('');
  sequenceAttemptFailed = signal(false);
  showHint = signal(false);
  puzzleSolved = signal(false);

  protected readonly String = String;

  // Réponse cible
  private readonly TARGET_ARTIST = 'PABLO PICASSO';
  private readonly ARTIST_NAME = 'PICASSO';

  // Cartes de lettres (seulement les lettres, pas les valeurs)
  letterCards = signal<LetterCard[]>([
    { letter: 'P', value: 16 },
    { letter: 'I', value: 9 },
    { letter: 'C', value: 3 },
    { letter: 'A', value: 1 },
    { letter: 'S', value: 19 },
    { letter: 'S', value: 19 },
    { letter: 'O', value: 15 },
  ]);

  // Séquence cible
  private readonly TARGET_SEQUENCE = '16,9,3,1,19,19,15';

  ngOnInit(): void {
    // Écouter l'événement global de résolution dev
    this.devSolveListener = () => this.devSolve();
    window.addEventListener('dev-solve-enigma', this.devSolveListener);
  }

  ngOnDestroy(): void {
    // Nettoyer l'écoute
    if (this.devSolveListener) {
      window.removeEventListener('dev-solve-enigma', this.devSolveListener);
    }
  }

  onArtistGuessSubmit(): void {
    const guess = this.artistGuess().trim().toUpperCase();
    const target = this.TARGET_ARTIST;

    if (guess === target) {
      // Créer la tentative réussie (toutes les lettres en correct)
      const successFeedback: LetterFeedback[] = target.split('').map((letter) => ({
        letter,
        status: 'correct' as const,
      }));

      // Vider les anciennes tentatives et afficher uniquement la réussite
      this.artistGuessAttempts.set([successFeedback]);

      this.artistFound.set(true);
      // Afficher le contenu de la phase 2 après 1.5 secondes
      setTimeout(() => {
        this.showPhase2Content.set(true);
      }, 1500);
      return;
    }

    // Calculer le feedback comme dans Tusmo/Motus
    const feedback: LetterFeedback[] = [];
    const targetLetters = target.split('');
    const guessLetters = guess.split('');
    const usedIndices = new Set<number>();

    // Premier passage : lettres correctes
    for (let i = 0; i < guessLetters.length; i++) {
      if (i < targetLetters.length && guessLetters[i] === targetLetters[i]) {
        feedback.push({ letter: guessLetters[i], status: 'correct' });
        usedIndices.add(i);
      } else {
        feedback.push({ letter: guessLetters[i], status: 'absent' });
      }
    }

    // Deuxième passage : lettres présentes mais mal placées
    for (let i = 0; i < guessLetters.length; i++) {
      if (feedback[i].status === 'absent') {
        for (let j = 0; j < targetLetters.length; j++) {
          if (!usedIndices.has(j) && guessLetters[i] === targetLetters[j]) {
            feedback[i].status = 'present';
            usedIndices.add(j);
            break;
          }
        }
      }
    }

    // Ajouter la tentative
    const attempts = this.artistGuessAttempts();
    attempts.push(feedback);
    this.artistGuessAttempts.set([...attempts]);

    this.artistAttemptFailed.set(true);
    setTimeout(() => {
      this.artistAttemptFailed.set(false);
    }, 2000);

    // Réinitialiser l'input
    this.artistGuess.set('');
  }

  formatArtistInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Ne garder que les lettres et espaces
    value = value.replace(/[^a-zA-Z ]/g, '');

    // Remplacer plusieurs espaces consécutifs par un seul
    value = value.replace(/\s+/g, ' ');

    // Mettre à jour la valeur
    this.artistGuess.set(value);
    input.value = value;
  }

  formatSequenceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Ne garder que les chiffres, virgules et espaces
    value = value.replace(/[^0-9, ]/g, '');

    // Remplacer plusieurs espaces consécutifs par un seul
    value = value.replace(/\s+/g, ' ');

    // Mettre à jour la valeur
    this.sequenceInput.set(value);
    input.value = value;
  }

  onSequenceSubmit(): void {
    let input = this.sequenceInput().trim();

    // Normaliser l'input : remplacer espaces par virgules et nettoyer
    input = input.replace(/\s+/g, ',').replace(/,+/g, ',');

    if (input === this.TARGET_SEQUENCE) {
      this.puzzleSolved.set(true);
      setTimeout(() => {
        this.solved.emit(this.TARGET_SEQUENCE);
      }, 1500);
    } else {
      this.sequenceAttemptFailed.set(true);
      setTimeout(() => {
        this.sequenceAttemptFailed.set(false);
      }, 2000);
    }
  }

  toggleHint(): void {
    this.showHint.set(!this.showHint());
  }

  resetEnigma(): void {
    this.reset.emit();
  }

  getArtistName(): string {
    return this.ARTIST_NAME;
  }

  // Méthode de dev pour résoudre l'énigme rapidement
  devSolve(): void {
    // Simuler la découverte de l'artiste
    const successFeedback: LetterFeedback[] = this.TARGET_ARTIST.split('').map((letter) => ({
      letter,
      status: 'correct' as const,
    }));
    this.artistGuessAttempts.set([successFeedback]);
    this.artistFound.set(true);
    this.showPhase2Content.set(true);

    // Résoudre directement l'énigme
    this.puzzleSolved.set(true);
    setTimeout(() => {
      this.solved.emit(this.TARGET_SEQUENCE);
    }, 500);
  }

  // Obtenir un tableau de feedback avec padding pour afficher toutes les cases
  getPaddedAttempt(attempt: LetterFeedback[]): LetterFeedback[] {
    const targetLength = this.TARGET_ARTIST.length;
    const padded: LetterFeedback[] = [...attempt];

    // Ajouter des cases vides pour atteindre la longueur cible
    while (padded.length < targetLength) {
      padded.push({ letter: '', status: 'absent' });
    }

    return padded;
  }
}
