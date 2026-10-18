import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Player, PlayerType } from '../../models';
import { getPlayerTypeIcon } from '../../player-utils';

@Component({
  selector: 'app-player-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-section.component.html',
  styleUrl: './player-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerSectionComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) icon = '';
  @Input({ required: true }) type: PlayerType = 'line';
  @Input({ required: true }) players: Player[] = [];
  @Input({ required: true }) total = 0;
  @Input() collapsible = true;
  @Output() remove = new EventEmitter<Player>();
  @Output() edit = new EventEmitter<Player>();

  showAll = false;

  get typeLabel(): string {
    return this.type === 'line' ? 'Linha' : 'Goleiro';
  }

  get typeIcon(): string {
    return getPlayerTypeIcon(this.type);
  }

  get visiblePlayers(): Player[] {
    return !this.collapsible || this.showAll ? this.players : this.players.slice(0, 5);
  }

  toggleExpanded(): void {
    this.showAll = !this.showAll;
  }

  activatePlayer(event: KeyboardEvent, player: Player): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.edit.emit(player);
    }
  }
}
