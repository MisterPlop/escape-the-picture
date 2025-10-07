export interface GameState {
  currentRoom: number;
  room1: Room1State;
  room2: Room2State;
}

export interface Room1State {
  enigma1Solved: boolean;
  enigma2Solved: boolean;
  enigma3Solved: boolean;
  currentEnigma: number;
  discoveredColor: string | null;
  discoveredSequence: string | null;
}

export interface Room2State {
  enigma4Solved: boolean;
  enigma5Solved: boolean;
  enigma6Solved: boolean;
  currentEnigma: number;
  discoveredDate: string | null;
  enigma5Result: string | null;
  enigma6Result: string | null;
}

export const INITIAL_GAME_STATE: GameState = {
  currentRoom: 1,
  room1: {
    enigma1Solved: false,
    enigma2Solved: false,
    enigma3Solved: false,
    currentEnigma: 1,
    discoveredColor: null,
    discoveredSequence: null,
  },
  room2: {
    enigma4Solved: false,
    enigma5Solved: false,
    enigma6Solved: false,
    currentEnigma: 4,
    discoveredDate: null,
    enigma5Result: null,
    enigma6Result: null,
  },
};
