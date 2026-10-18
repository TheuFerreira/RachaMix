import type { Player } from './models';

export function shufflePlayers(players: Player[], random: () => number = Math.random): Player[] {
  const shuffled = [...players];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

export function drawTeams(
  players: Player[],
  playersPerTeam: number,
  random: () => number = Math.random
): Player[][] {
  if (players.length < 2 || playersPerTeam < 2) {
    return [];
  }

  const shuffled = shufflePlayers(players, random);
  const teamCount = Math.ceil(shuffled.length / playersPerTeam);
  const teams = Array.from({ length: teamCount }, () => [] as Player[]);

  shuffled.forEach((player, index) => {
    teams[index % teamCount].push(player);
  });

  return teams;
}
