import { Component, computed, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { Enigma1Component } from './enigmas/enigma1/enigma1.component';
import { Enigma2Component } from './enigmas/enigma2/enigma2.component';
import { Enigma3Component } from './enigmas/enigma3/enigma3.component';
import { FinalRevealComponent } from './final-reveal/final-reveal.component';

@Component({
  selector: 'app-room1',
  standalone: true,
  imports: [
    CommonModule,
    Enigma1Component,
    Enigma2Component,
    Enigma3Component,
    FinalRevealComponent,
  ],
  templateUrl: './room1.component.html',
  styleUrl: './room1.component.scss',
})
export class Room1Component implements OnInit, OnDestroy {
  private gameState = inject(GameStateService);
  private router = inject(Router);
  private resetAllListener?: (event: Event) => void;
  private resetEnigmaListener?: (event: Event) => void;

  currentEnigma = computed(() => this.gameState.getCurrentEnigma());
  isComplete = computed(() => this.gameState.isRoom1Complete());

  constructor() {
    // Remonter en haut à chaque changement d'énigme
    effect(() => {
      this.currentEnigma();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  ngOnInit(): void {
    this.resetAllListener = () => this.resetRoom();
    this.resetEnigmaListener = () => this.resetCurrentEnigma();
    window.addEventListener('reset-all', this.resetAllListener);
    window.addEventListener('reset-enigma', this.resetEnigmaListener);
  }

  ngOnDestroy(): void {
    if (this.resetAllListener) {
      window.removeEventListener('reset-all', this.resetAllListener);
    }
    if (this.resetEnigmaListener) {
      window.removeEventListener('reset-enigma', this.resetEnigmaListener);
    }
  }

  onEnigma1Solved(): void {
    this.gameState.solveEnigma1();
  }

  onEnigma2Solved(color: string): void {
    this.gameState.solveEnigma2(color);
  }

  onEnigma3Solved(sequence: string): void {
    this.gameState.solveEnigma3(sequence);
  }

  onContinueToRoom2(): void {
    this.router.navigate(['/room2']);
  }

  resetRoom(): void {
    if (confirm('Êtes-vous sûr de vouloir recommencer la salle 1 ?')) {
      this.gameState.resetRoom1();
    }
  }

  resetCurrentEnigma(): void {
    const currentEnigma = this.currentEnigma();
    if (confirm(`Êtes-vous sûr de vouloir réinitialiser l'énigme ${currentEnigma} ?`)) {
      this.gameState.resetCurrentEnigmaRoom1(currentEnigma);
      window.location.reload();
    }
  }
}
