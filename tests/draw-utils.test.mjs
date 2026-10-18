import assert from 'node:assert/strict';
import test from 'node:test';
import { drawTeams, shufflePlayers } from '../src/app/draw-utils.ts';

const players = Array.from({ length: 10 }, (_, index) => ({
  name: 'Player ' + (index + 1),
  initials: 'P' + (index + 1),
  type: 'line',
  selected: true
}));

test('distribui todos os jogadores em times equilibrados', () => {
  const teams = drawTeams(players, 4, () => 0.5);
  const sizes = teams.map((team) => team.length);

  assert.deepEqual(sizes, [4, 3, 3]);
  assert.equal(teams.flat().length, players.length);
  assert.equal(new Set(teams.flat()).size, players.length);
});

test('não cria times com dados insuficientes', () => {
  assert.deepEqual(drawTeams(players.slice(0, 1), 4, () => 0.5), []);
  assert.deepEqual(drawTeams(players, 1, () => 0.5), []);
});

test('embaralha sem alterar a lista original', () => {
  const shuffled = shufflePlayers(players, () => 0);

  assert.equal(shuffled.length, players.length);
  assert.deepEqual(
    players.map((player) => player.name),
    Array.from({ length: 10 }, (_, index) => 'Player ' + (index + 1))
  );
  assert.notDeepEqual(shuffled.map((player) => player.name), players.map((player) => player.name));
});
