export type Tab = 'players' | 'draw' | 'history';
export type PlayerType = 'line' | 'goalkeeper';

export interface Player {
  name: string;
  initials: string;
  type: PlayerType;
  selected: boolean;
}
