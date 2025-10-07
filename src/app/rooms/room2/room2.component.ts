import { Component, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { Enigma4Component } from './enigmas/enigma4/enigma4.component';
import { Enigma5Component } from './enigmas/enigma5/enigma5.component';
import { Enigma6Component } from './enigmas/enigma6/enigma6.component';
import { FinalRevealRoom2Component } from './final-reveal/final-reveal.component';

@Component({
  selector: 'app-room2',
  standalone: true,
  imports: [
    CommonModule,
    Enigma4Component,
    Enigma5Component,
    Enigma6Component,
    FinalRevealRoom2Component,
  ],
  templateUrl: './room2.component.html',
  styleUrl: './room2.component.scss',
})
export class Room2Component implements OnInit, OnDestroy {
  private gameState = inject(GameStateService);
  private resetAllListener?: (event: Event) => void;
  private resetEnigmaListener?: (event: Event) => void;

  currentEnigma = computed(() => this.gameState.getRoom2State().currentEnigma);
  isComplete = computed(() => this.gameState.isRoom2Complete());

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

  onEnigma4Solved(date: string): void {
    this.gameState.solveEnigma4(date);
  }

  onEnigma5Solved(result: string): void {
    this.gameState.solveEnigma5(result);
  }

  onEnigma6Solved(result: string): void {
    this.gameState.solveEnigma6(result);
  }

  onContinueToRoom3(): void {
    // TODO: Navigation vers la salle 3
    alert("Salle 3 à venir ! Merci d'avoir joué. 🎉");
  }

  resetRoom(): void {
    if (confirm('Êtes-vous sûr de vouloir recommencer la salle 2 ?')) {
      this.gameState.resetRoom2();
    }
  }

  resetCurrentEnigma(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser cette énigme ?')) {
      window.location.reload();
    }
  }
}
