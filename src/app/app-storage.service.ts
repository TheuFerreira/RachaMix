import { Injectable } from '@angular/core';
import type { Player } from './models';

const STORAGE_KEY = 'rachamix.app-state';
const STORAGE_VERSION = 1;

export interface PersistedDrawState {
  playersPerTeam: number;
  drawnTeams: Player[][];
  drawnGoalkeepers: Player[];
}

interface PersistedAppState extends PersistedDrawState {
  version: number;
  players: Player[];
}

@Injectable({ providedIn: 'root' })
export class AppStorageService {
  loadPlayers(fallback: Player[]): Player[] {
    const state = this.read();
    return state?.players?.length ? state.players : fallback;
  }

  loadDrawState(): PersistedDrawState {
    const state = this.read();
    return {
      playersPerTeam: state?.playersPerTeam && state.playersPerTeam >= 2 ? state.playersPerTeam : 4,
      drawnTeams: state?.drawnTeams ?? [],
      drawnGoalkeepers: state?.drawnGoalkeepers ?? [],
    };
  }

  savePlayers(players: Player[]): void {
    const current = this.read();
    this.write({
      version: STORAGE_VERSION,
      players,
      playersPerTeam: current?.playersPerTeam ?? 4,
      drawnTeams: current?.drawnTeams ?? [],
      drawnGoalkeepers: current?.drawnGoalkeepers ?? [],
    });
  }

  saveDrawState(state: PersistedDrawState, players: Player[]): void {
    this.write({
      version: STORAGE_VERSION,
      players,
      ...state,
    });
  }

  private read(): PersistedAppState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed: unknown = JSON.parse(raw);
      return this.isValidState(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  private write(state: PersistedAppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable in private browsing or when it is full.
    }
  }

  private isValidState(value: unknown): value is PersistedAppState {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const state = value as Partial<PersistedAppState>;
    return (
      state.version === STORAGE_VERSION &&
      Array.isArray(state.players) &&
      state.players.every(
        (player) =>
          player &&
          typeof player.name === 'string' &&
          typeof player.initials === 'string' &&
          (player.type === 'line' || player.type === 'goalkeeper') &&
          typeof player.selected === 'boolean',
      ) &&
      typeof state.playersPerTeam === 'number' &&
      Array.isArray(state.drawnTeams) &&
      Array.isArray(state.drawnGoalkeepers)
    );
  }
}
