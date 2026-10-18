import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Player } from '../../models';
import { getPlayerTypeIcon } from '../../player-utils';

@Component({
  selector: 'app-draw-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './draw-page.component.html',
  styleUrl: './draw-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawPageComponent {
  @Input({ required: true }) players: Player[] = [];
  @Input({ required: true }) playersPerTeam = 4;
  @Output() back = new EventEmitter<void>();
  @Output() generate = new EventEmitter<number>();
  @Output() playersPerTeamChange = new EventEmitter<number>();
  @Output() selectionChange = new EventEmitter<{ player: Player; selected: boolean }>();

  get linePlayers(): Player[] {
    return this.players.filter((player) => player.type === 'line');
  }
  get goalkeepers(): Player[] {
    return this.players.filter((player) => player.type === 'goalkeeper');
  }
  get selectedLinePlayers(): number {
    return this.linePlayers.filter((player) => player.selected).length;
  }
  get selectedGoalkeepers(): number {
    return this.goalkeepers.filter((player) => player.selected).length;
  }
  get lineIcon(): string {
    return getPlayerTypeIcon('line');
  }
  get goalkeeperIcon(): string {
    return getPlayerTypeIcon('goalkeeper');
  }
  get canGenerate(): boolean {
    return this.selectedLinePlayers >= 2 && this.playersPerTeam >= 2;
  }
  get generationError(): string {
    if (this.selectedLinePlayers === 0) {
      return 'Selecione pelo menos dois jogadores de linha para sortear os times.';
    }
    if (this.selectedLinePlayers === 1) {
      return 'Selecione mais um jogador de linha para sortear os times.';
    }
    return '';
  }

  togglePlayer(player: Player): void {
    this.selectionChange.emit({ player, selected: !player.selected });
  }

  decreasePlayersPerTeam(): void {
    if (this.playersPerTeam > 2) {
      this.playersPerTeamChange.emit(this.playersPerTeam - 1);
    }
  }

  increasePlayersPerTeam(): void {
    this.playersPerTeamChange.emit(this.playersPerTeam + 1);
  }
}
