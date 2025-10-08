import { Component, signal, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoryIntroComponent } from '../../../../shared/story-intro/story-intro.component';

@Component({
  selector: 'app-enigma2',
  standalone: true,
  imports: [CommonModule, FormsModule, StoryIntroComponent],
  templateUrl: './enigma2.component.html',
  styleUrl: './enigma2.component.scss',
})
export class Enigma2Component implements OnInit, OnDestroy {
  @Output() solved = new EventEmitter<string>();

  private devSolveListener?: (event: Event) => void;

  storyText =
    "Le portrait révélé semble être celui d'un grand maître... Mais qui est-il ? Sur le mur adjacent, vous remarquez une installation étrange : des zones de couleurs mystérieuses qui semblent cacher un message. Peut-être un indice sur l'identité de l'artiste ?";

  // Coordonnées de souris pour chaque zone
  redZoneMouseX = signal(0);
  redZoneMouseY = signal(0);
  yellowZoneMouseX = signal(0);
  yellowZoneMouseY = signal(0);

  // Valeurs des sliders RGB
  redValue = signal(0);
  greenValue = signal(0);
  blueValue = signal(0);

  // Input de guess
  colorGuess = signal('');
  attemptFailed = signal(false);

  // État des découvertes
  redDiscovered = signal(false);
  yellowDiscovered = signal(false);

  // État des zones révélées complètement
  redZoneRevealed = signal(false);
  yellowZoneRevealed = signal(false);

  // État de succès
  isSuccess = signal(false);

  showHint = signal(false);

  // Couleurs cibles
  private readonly RED_COLOR = '#F69874'; // Rouge plus très jaune
  private readonly YELLOW_COLOR = '#C89864'; // Jaune plus très jaune
  private readonly TARGET_COLOR = '#DF986C'; // Couleur à deviner
  private revealRadius = 2; // 40px en rem

  // Positions aléatoires des textes
  redTextPosition = {
    top: Math.random() * 60 + 20, // Entre 20% et 80%
    left: Math.random() * 60 + 20, // Entre 20% et 80%
  };

  yellowTextPosition = {
    top: Math.random() * 60 + 20, // Entre 20% et 80%
    left: Math.random() * 60 + 20, // Entre 20% et 80%
  };

  ngOnInit(): void {
    this.devSolveListener = () => this.devSolve();
    window.addEventListener('dev-solve-enigma', this.devSolveListener);
  }

  ngOnDestroy(): void {
    if (this.devSolveListener) {
      window.removeEventListener('dev-solve-enigma', this.devSolveListener);
    }
  }

  devSolve(): void {
    this.redDiscovered.set(true);
    this.yellowDiscovered.set(true);
    this.redZoneRevealed.set(true);
    this.yellowZoneRevealed.set(true);
    this.redValue.set(223);
    this.greenValue.set(152);
    this.blueValue.set(108);
    this.isSuccess.set(true);
    setTimeout(() => {
      this.solved.emit(this.TARGET_COLOR);
    }, 500);
  }

  onRedZoneMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.redZoneMouseX.set(event.clientX - rect.left);
    this.redZoneMouseY.set(event.clientY - rect.top);

    // Découvrir la couleur rouge si on survole
    this.redDiscovered.set(true);
  }

  onYellowZoneMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.yellowZoneMouseX.set(event.clientX - rect.left);
    this.yellowZoneMouseY.set(event.clientY - rect.top);

    // Découvrir la couleur jaune si on survole
    this.yellowDiscovered.set(true);
  }

  onRedZoneClick(): void {
    if (!this.redZoneRevealed()) {
      this.redZoneRevealed.set(true);
    }
  }

  onYellowZoneClick(): void {
    if (!this.yellowZoneRevealed()) {
      this.yellowZoneRevealed.set(true);
    }
  }

  updateRedValue(event: any): void {
    const value = parseInt(event.target.value);
    this.redValue.set(value);
  }

  updateGreenValue(event: any): void {
    const value = parseInt(event.target.value);
    this.greenValue.set(value);
  }

  updateBlueValue(event: any): void {
    const value = parseInt(event.target.value);
    this.blueValue.set(value);
  }

  getMixedColor(): string {
    return `rgb(${this.redValue()}, ${this.greenValue()}, ${this.blueValue()})`;
  }

  getHexColor(): string {
    const toHex = (value: number) => {
      const hex = value.toString(16).toUpperCase();
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(this.redValue())}${toHex(this.greenValue())}${toHex(this.blueValue())}`;
  }

  onGuessSubmit(): void {
    const guess = this.colorGuess().trim().toUpperCase();
    const target = this.TARGET_COLOR.toUpperCase();

    if (guess === target) {
      this.isSuccess.set(true);
      setTimeout(() => {
        this.solved.emit(this.TARGET_COLOR);
      }, 3000); // Délai pour voir le message de succès
    } else {
      this.attemptFailed.set(true);
      setTimeout(() => {
        this.attemptFailed.set(false);
      }, 2000);
    }
  }

  getRedHex(): string {
    return this.RED_COLOR;
  }

  getYellowHex(): string {
    return this.YELLOW_COLOR;
  }

  toggleHint(): void {
    this.showHint.set(!this.showHint());
  }

  getRevealRadius(): number {
    return this.revealRadius;
  }

  getRedTextTop(): number {
    return this.redTextPosition.top;
  }

  getRedTextLeft(): number {
    return this.redTextPosition.left;
  }

  getYellowTextTop(): number {
    return this.yellowTextPosition.top;
  }

  getYellowTextLeft(): number {
    return this.yellowTextPosition.left;
  }

  // Vérifier si les deux zones sont révélées pour changer le curseur
  areBothZonesRevealed(): boolean {
    return this.redZoneRevealed() && this.yellowZoneRevealed();
  }
}
