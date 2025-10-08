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
  selector: 'app-enigma6',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enigma6.component.html',
  styleUrl: './enigma6.component.scss',
})
export class Enigma6Component implements OnInit, OnDestroy {
  @Output() solved = new EventEmitter<string>();

  private devSolveListener?: (event: Event) => void;

  puzzleSolved = signal(false);
  userAnswer = signal('');
  showHint = signal(false);
  answerAttemptFailed = signal(false);
  private discoveryCounter = 0;

  // 5 vrais indices
  // Image: 1536x1024 pixels
  clues = signal<Clue[]>([
    // VRAIS INDICES (5)
    {
      id: 1,
      x: (743 / 1536) * 100, // 743px → 48.37%
      y: (813 / 1024) * 100, // 813px → 79.39%
      width: 161,
      height: 62,
      isReal: true,
      title: 'Couverture de livre',
      content: 'L\'art tourne ROND ?',
      discovered: false,
    },
    {
      id: 2,
      x: (310 / 1536) * 100, // 310px → 20.18%
      y: (800 / 1024) * 100, // 800px → 78.13%
      width: 126,
      height: 96,
      isReal: true,
      title: 'Une sphère',
      content: 'C\'est très... rond',
      discovered: false,
    },
    {
      id: 3,
      x: (476 / 1536) * 100, // 476px → 30.99%
      y: (636 / 1024) * 100, // 636px → 62.11%
      width: 312,
      height: 80,
      isReal: true,
      title: 'Couvertures de livres',
      content: 'Elles forment presque un mot...',
      discovered: false,
    },
    {
      id: 4,
      x: (1155 / 1536) * 100, // 1155px → 75.20%
      y: (249 / 1024) * 100, // 249px → 24.32%
      width: 285,
      height: 285,
      isReal: true,
      title: 'Un miroir',
      content: 'Dans un miroir, voit-on réellement le vrai reflet des choses ?',
      discovered: false,
    },
    {
      id: 5,
      x: (535 / 1536) * 100, // 535px → 34.83%
      y: (365 / 1024) * 100, // 365px → 35.64%
      width: 78,
      height: 78,
      isReal: true,
      title: 'Un autoportrait',
      content: 'Signé P.P.',
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
      !(charCode >= 97 && charCode <= 122)   // a-z
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
    if (answer === 'CUBISME') {
      this.answerAttemptFailed.set(false);
      this.puzzleSolved.set(true);
      setTimeout(() => {
        this.solved.emit('CUBISME');
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
    this.userAnswer.set('CUBISME');
    this.puzzleSolved.set(true);
    setTimeout(() => {
      this.solved.emit('CUBISME');
    }, 500);
  }
}
