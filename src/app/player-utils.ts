import type { Player } from './models';

export function getPlayerInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function getPlayerNameError(
  name: string,
  players: Player[],
  currentPlayer: Player | null = null,
): string {
  const normalizedName = name.trim().toLocaleLowerCase();
  if (normalizedName.length > 0 && normalizedName.length < 2) {
    return 'Digite pelo menos 2 caracteres.';
  }

  const duplicated = players.some(
    (player) =>
      player !== currentPlayer && player.name.trim().toLocaleLowerCase() === normalizedName,
  );
  return duplicated ? 'J\u00E1 existe um jogador com esse nome.' : '';
}
