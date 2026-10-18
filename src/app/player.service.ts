import { Injectable, isDevMode } from '@angular/core';
import type { Player, PlayerType } from './models';
import { getPlayerInitials } from './player-utils';
import { AppStorageService } from './app-storage.service';

export interface PlayerInput {
  name: string;
  type: PlayerType;
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly defaultPlayers: Player[] = [
    { name: 'Pedro', initials: 'PE', type: 'line', selected: true },
    { name: 'Lucas', initials: 'LU', type: 'line', selected: true },
    { name: 'Gabriel', initials: 'GA', type: 'line', selected: true },
    { name: 'Rafael', initials: 'RA', type: 'line', selected: true },
    { name: 'Bruno', initials: 'BR', type: 'line', selected: true },
    { name: 'Diego', initials: 'DI', type: 'line', selected: true },
    { name: 'Matheus', initials: 'MA', type: 'goalkeeper', selected: true },
    { name: 'Fernando', initials: 'FE', type: 'goalkeeper', selected: true },
    { name: 'Vinicius', initials: 'VI', type: 'goalkeeper', selected: true },
  ];
  private playerList: Player[];

  constructor(private readonly storage: AppStorageService) {
    this.playerList = isDevMode() ? this.defaultPlayers : this.storage.loadPlayers([]);
  }

  get players(): Player[] {
    return this.playerList;
  }

  add(input: PlayerInput): Player[] {
    this.playerList = [
      ...this.playerList,
      {
        name: input.name,
        initials: getPlayerInitials(input.name),
        type: input.type,
        selected: true,
      },
    ];
    this.storage.savePlayers(this.playerList);
    return this.playerList;
  }

  importLinePlayers(names: string[]): Player[] {
    const existingNames = new Set(this.playerList.map((player) => player.name.toLocaleLowerCase()));
    const importedPlayers = names
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .filter((name) => {
        const normalizedName = name.toLocaleLowerCase();
        if (existingNames.has(normalizedName)) {
          return false;
        }
        existingNames.add(normalizedName);
        return true;
      })
      .map((name) => ({
        name,
        initials: getPlayerInitials(name),
        type: 'line' as const,
        selected: true,
      }));

    this.playerList = [...this.playerList, ...importedPlayers];
    this.storage.savePlayers(this.playerList);
    return this.playerList;
  }

  update(playerToUpdate: Player, input: PlayerInput): Player[] {
    this.playerList = this.playerList.map((player) =>
      player === playerToUpdate
        ? { ...player, name: input.name, initials: getPlayerInitials(input.name), type: input.type }
        : player,
    );
    this.storage.savePlayers(this.playerList);
    return this.playerList;
  }

  remove(playerToRemove: Player): Player[] {
    this.playerList = this.playerList.filter((player) => player !== playerToRemove);
    this.storage.savePlayers(this.playerList);
    return this.playerList;
  }

  setSelected(playerToUpdate: Player, selected: boolean): Player[] {
    this.playerList = this.playerList.map((player) =>
      player === playerToUpdate ? { ...player, selected } : player,
    );
    this.storage.savePlayers(this.playerList);
    return this.playerList;
  }
}
