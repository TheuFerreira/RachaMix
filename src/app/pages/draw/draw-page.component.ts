import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models';

@Component({
  selector: 'app-draw-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './draw-page.component.html',
  styleUrl: './draw-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawPageComponent {
  @Input({ required: true }) players: Player[] = [];
  @Output() back = new EventEmitter<void>();
  @Output() generate = new EventEmitter<void>();
  teams = 2;

  get linePlayers(): Player[] { return this.players.filter((player) => player.type === 'line'); }
  get goalkeepers(): Player[] { return this.players.filter((player) => player.type === 'goalkeeper'); }
  get selectedLinePlayers(): number { return this.linePlayers.filter((player) => player.selected).length; }
  get selectedGoalkeepers(): number { return this.goalkeepers.filter((player) => player.selected).length; }

  togglePlayer(player: Player): void {
    player.selected = !player.selected;
  }
}
