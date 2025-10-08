import { Component, signal, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Clue {
  id: number;
  x: number; // Position en % par rapport à l'image
  y: number; // Position en % par rapport à l'image
  width: number; // Largeur du rectangle en px
  height: number; // Hauteur du rectangle en px
  isReal: boolean; // Vrai ou faux indice
  title: string;
  content: string;
  discovered: boolean;
  discoveredOrder?: number; // Ordre de découverte
}

@Component({
  selector: 'app-enigma5',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enigma5.component.html',
  styleUrl: './enigma5.component.scss',
})
export class Enigma5Component implements OnInit, OnDestroy {
  @Output() solved = new EventEmitter<string>();

  private devSolveListener?: (event: Event) => void;

  puzzleSolved = signal(false);
  userAnswer = signal('');
  showHint = signal(false);
  answerAttemptFailed = signal(false);
  private discoveryCounter = 0;

  // Image: 1536x1024 pixels
  clues = signal<Clue[]>([
    // VRAIS INDICES (4)
    {
      id: 1,
      x: (356 / 1536) * 100, // 356px → 23.18%
      y: (217 / 1024) * 100, // 217px → 21.19%
      width: 100,
      height: 80,
      isReal: true,
      title: 'Drapeau moderne',
      content: 'Un drapeau espagnol actuel... Anachronisme en 1881',
      discovered: false,
    },
    {
      id: 2,
      x: (421 / 1536) * 100, // 421px → 27.41%
      y: (495 / 1024) * 100, // 495px → 48.34%
      width: 40,
      height: 80,
      isReal: true,
      title: 'Cathédrale',
      content: "Le clocher d'une cathédrale",
      discovered: false,
    },
    {
      id: 3,
      x: (253 / 1536) * 100, // 253px → 16.47%
      y: (894 / 1024) * 100, // 894px → 87.30%
      width: 80,
      height: 90,
      isReal: true,
      title: 'Caisses de raisin',
      content: "Vignobles d'une production locale",
      discovered: false,
    },
    {
      id: 4,
      x: (1235 / 1536) * 100, // 1235px → 80.40%
      y: (891 / 1024) * 100, // 891px → 87.01%
      width: 30,
      height: 40,
      isReal: true,
      title: "Bitte d'amarrage",
      content: 'Le bateau est à quai',
      discovered: false,
    },
  ]);

  ngOnInit(): void {
    this.devSolveListener = () => this.devSolve();
    window.addEventListener('dev-solve-enigma', this.devSolveListener);
  }

  ngOnDestroy(): void {
    if (this.devSolveListener) {
      window.removeEventListener('dev-solve-enigma', this.devSolveListener);
    }
  }

  onClueClick(clue: Clue): void {
    if (this.puzzleSolved()) return;

    // Marquer l'indice comme découvert avec son ordre
    this.clues.update((clues) =>
      clues.map((c) =>
        c.id === clue.id && !c.discovered
          ? { ...c, discovered: true, discoveredOrder: ++this.discoveryCounter }
          : c
      )
    );
  }

  // Bloquer la saisie de caractères non alphabétiques
  onKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    // Autoriser uniquement les lettres (a-z, A-Z)
    if (
      !(charCode >= 65 && charCode <= 90) && // A-Z
      !(charCode >= 97 && charCode <= 122) // a-z
    ) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // Formater l'input en majuscules
  formatInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.userAnswer.set(input.value.toUpperCase());
  }

  checkAnswer(): void {
    const answer = this.userAnswer().trim();

    // Si la réponse est vide, ne rien faire
    if (answer.length === 0) {
      return;
    }

    // Si c'est la bonne réponse
    if (answer === 'MALAGA') {
      this.answerAttemptFailed.set(false);
      this.puzzleSolved.set(true);
      setTimeout(() => {
        this.solved.emit('MALAGA');
      }, 500);
    } else {
      // Toute autre valeur non vide = mauvaise réponse
      this.answerAttemptFailed.set(true);
      setTimeout(() => {
        this.answerAttemptFailed.set(false);
      }, 3000);
    }
  }

  toggleHint(): void {
    this.showHint.set(!this.showHint());
  }

  // Liste des indices découverts (vrais ET faux, triés par ordre de découverte)
  get discoveredClues(): Clue[] {
    return this.clues()
      .filter((c) => c.discovered)
      .sort((a, b) => (a.discoveredOrder || 0) - (b.discoveredOrder || 0));
  }

  devSolve(): void {
    this.userAnswer.set('MALAGA');
    this.puzzleSolved.set(true);
    setTimeout(() => {
      this.solved.emit('MALAGA');
    }, 500);
  }
}
