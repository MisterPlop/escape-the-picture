import { Injectable, signal } from '@angular/core';
import { GameState, INITIAL_GAME_STATE, Room1State } from '../models/game-state.model';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private readonly STORAGE_KEY = 'escape-the-picture-state';
  
  // Signal pour l'état réactif
  gameState = signal<GameState>(this.loadState());

  constructor() {
    // Sauvegarder automatiquement à chaque changement
    this.gameState.set(this.loadState());
  }

  private loadState(): GameState {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Erreur lors du chargement de l\'état:', e);
        return INITIAL_GAME_STATE;
      }
    }
    return INITIAL_GAME_STATE;
  }

  private saveState(state: GameState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    this.gameState.set(state);
  }

  // Getters
  getRoom1State(): Room1State {
    return this.gameState().room1;
  }

  getCurrentEnigma(): number {
    return this.gameState().room1.currentEnigma;
  }

  isEnigma1Solved(): boolean {
    return this.gameState().room1.enigma1Solved;
  }

  isEnigma2Solved(): boolean {
    return this.gameState().room1.enigma2Solved;
  }

  isEnigma3Solved(): boolean {
    return this.gameState().room1.enigma3Solved;
  }

  isRoom1Complete(): boolean {
    const room1 = this.gameState().room1;
    return room1.enigma1Solved && room1.enigma2Solved && room1.enigma3Solved;
  }

  // Actions
  solveEnigma1(): void {
    const state = this.gameState();
    this.saveState({
      ...state,
      room1: {
        ...state.room1,
        enigma1Solved: true,
        currentEnigma: 2
      }
    });
  }

  solveEnigma2(color: string): void {
    const state = this.gameState();
    this.saveState({
      ...state,
      room1: {
        ...state.room1,
        enigma2Solved: true,
        discoveredColor: color,
        currentEnigma: 3
      }
    });
  }

  solveEnigma3(sequence: string): void {
    const state = this.gameState();
    this.saveState({
      ...state,
      room1: {
        ...state.room1,
        enigma3Solved: true,
        discoveredSequence: sequence,
        currentEnigma: 4
      }
    });
  }

  resetGame(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.gameState.set(INITIAL_GAME_STATE);
  }

  resetRoom1(): void {
    const state = this.gameState();
    this.saveState({
      ...state,
      room1: INITIAL_GAME_STATE.room1
    });
  }
}
