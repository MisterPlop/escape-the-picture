export interface GameState {
  currentRoom: number;
  room1: Room1State;
}

export interface Room1State {
  enigma1Solved: boolean;
  enigma2Solved: boolean;
  enigma3Solved: boolean;
  currentEnigma: number;
  discoveredColor: string | null;
  discoveredSequence: string | null;
}

export const INITIAL_GAME_STATE: GameState = {
  currentRoom: 1,
  room1: {
    enigma1Solved: false,
    enigma2Solved: false,
    enigma3Solved: false,
    currentEnigma: 1,
    discoveredColor: null,
    discoveredSequence: null
  }
};
