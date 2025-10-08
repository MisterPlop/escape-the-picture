import { Component, signal, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LOCATION_UPGRADE_CONFIGURATION } from '@angular/common/upgrade';
import { StoryIntroComponent } from '../../../../shared/story-intro/story-intro.component';

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
  selector: 'app-enigma4',
  standalone: true,
  imports: [CommonModule, FormsModule, StoryIntroComponent],
  templateUrl: './enigma4.component.html',
  styleUrl: './enigma4.component.scss',
})
export class Enigma4Component implements OnInit, OnDestroy {
  @Output() solved = new EventEmitter<string>();

  private devSolveListener?: (event: Event) => void;

  storyText =
    "Vous pénétrez dans une nouvelle salle, plus sombre et mystérieuse. Des documents d'archives sont exposés sous verre. Pour comprendre l'œuvre de cet artiste, vous devez remonter à ses origines. Quand tout a-t-il commencé ?";

  puzzleSolved = signal(false);
  userDate = signal('');
  showHint = signal(false);
  dateAttemptFailed = signal(false); // Pour afficher l'erreur
  private discoveryCounter = 0; // Compteur pour l'ordre de découverte

  // 4 vrais indices + 5 faux indices
  // Image: 1536x1024 pixels
  clues = signal<Clue[]>([
    // VRAIS INDICES (4)
    {
      id: 1,
      x: (370 / 1536) * 100, // 305px → 19.86%
      y: (220 / 1024) * 100, // 220px → 21.48%
      width: 130,
      height: 60,
      isReal: true,
      title: 'Horloge numérique',
      content: '22 heures...',
      discovered: false,
    },
    {
      id: 2,
      x: (958 / 1536) * 100, // 958px → 62.37%
      y: (329 / 1024) * 100, // 329px → 32.13%
      width: 40,
      height: 40,
      isReal: true,
      title: '25',
      content: 'Un calendrier étrange indique le 25',
      discovered: false,
    },
    {
      id: 3,
      x: (965 / 1536) * 100, // 965px → 62.83%
      y: (582 / 1024) * 100, // 582px → 56.84%
      width: 20,
      height: 60,
      isReal: true,
      title: '18',
      content: "C'est le tôme 18. Ou peut-être 81...?",
      discovered: false,
    },
    {
      id: 4,
      x: (1225 / 1536) * 100, // 1225px → 79.75%
      y: (550 / 1024) * 100, // 590px → 57.62%
      width: 100,
      height: 160,
      isReal: true,
      title: 'Autoportrait à la mèche',
      content: 'Pablo Picasso adorait les autoportraits',
      discovered: false,
    },
    // FAUX INDICES (5)
    {
      id: 5,
      x: (192 / 1536) * 100, // 192px → 12.5%
      y: (519 / 1024) * 100, // 519px → 50.68%
      width: 80,
      height: 70,
      isReal: false,
      title: 'Suite de chiffres',
      content: "L'année 2375 ?",
      discovered: false,
    },
    {
      id: 6,
      x: (990 / 1536) * 100, // 980px → 63.80%
      y: (861 / 1024) * 100, // 861px → 84.08%
      width: 90,
      height: 40,
      isReal: false,
      title: '2-3-7-5',
      content: 'Une combinaison de coffre?',
      discovered: false,
    },
    {
      id: 7,
      x: (861 / 1536) * 100, // 856px → 55.73%
      y: (214 / 1024) * 100, // 214px → 20.90%
      width: 40,
      height: 40,
      isReal: false,
      title: '7',
      content: 'Le calendrier étrange indique le 7',
      discovered: false,
    },
    {
      id: 8,
      x: (824 / 1536) * 100, // 818px → 53.26%
      y: (633 / 1024) * 100, // 633px → 61.82%
      width: 25,
      height: 40,
      isReal: false,
      title: '9',
      content: "C'est le 9ème tôme.",
      discovered: false,
    },
    {
      id: 9,
      x: (895 / 1536) * 100, // 895px → 58.27%
      y: (617 / 1024) * 100, // 514px → 50.20%
      width: 25,
      height: 40,
      isReal: false,
      title: '1',
      content: "C'est le 1er tôme.",
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

  // Bloquer la saisie de caractères non numériques
  onKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    // Autoriser uniquement les chiffres (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // Formater l'input de date en JJ/MM/AAAA
  formatDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Garder que les chiffres

    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    this.userDate.set(value);
  }

  checkDate(): void {
    const date = this.userDate().trim();

    // Si la date est vide, ne rien faire
    if (date.length === 0) {
      return;
    }

    // Si c'est la bonne réponse
    if (date === '25/10/1881') {
      this.dateAttemptFailed.set(false);
      this.puzzleSolved.set(true);
      setTimeout(() => {
        this.solved.emit('25/10/1881');
      }, 500);
    } else {
      // Toute autre valeur non vide = mauvaise réponse
      this.dateAttemptFailed.set(true);
      setTimeout(() => {
        this.dateAttemptFailed.set(false);
      }, 3000); // Masquer après 3 secondes
    }
  }

  toggleHint(): void {
    this.showHint.set(!this.showHint());
  }

  // Liste des indices découverts (vrais ET faux, triés par ordre de découverte)
  get discoveredRealClues(): Clue[] {
    return this.clues()
      .filter((c) => c.discovered)
      .sort((a, b) => (a.discoveredOrder || 0) - (b.discoveredOrder || 0));
  }

  devSolve(): void {
    this.userDate.set('25/10/1881');
    this.puzzleSolved.set(true);
    setTimeout(() => {
      this.solved.emit('25/10/1881');
    }, 500);
  }
}
