import assert from 'node:assert/strict';
import test from 'node:test';
import { getPlayerInitials, getPlayerNameError } from '../src/app/player-utils.ts';

const players = [
  { name: 'Pedro Silva', initials: 'PS', type: 'line', selected: true },
  { name: 'Lucas', initials: 'LU', type: 'line', selected: true }
];

test('gera iniciais usando os dois primeiros nomes', () => {
  assert.equal(getPlayerInitials('  Maria  Clara Souza '), 'MC');
});

test('rejeita nomes com menos de dois caracteres', () => {
  assert.equal(getPlayerNameError(' P ', players), 'Digite pelo menos 2 caracteres.');
});

test('rejeita nomes duplicados sem diferenciar maiúsculas', () => {
  assert.equal(getPlayerNameError('pedro silva', players), 'Já existe um jogador com esse nome.');
});

test('permite que o jogador mantenha o próprio nome na edição', () => {
  assert.equal(getPlayerNameError('Pedro Silva', players, players[0]), '');
});
