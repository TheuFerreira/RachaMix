import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../models';

@Component({
  selector: 'app-players-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersPageComponent {
  @Input({ required: true }) players: Player[] = [];
  @Output() add = new EventEmitter<void>();

  search = '';

  get linePlayers(): Player[] { return this.players.filter((player) => player.type === 'line'); }
  get goalkeepers(): Player[] { return this.players.filter((player) => player.type === 'goalkeeper'); }
  get filteredPlayers(): Player[] {
    return this.players.filter((player) => player.name.toLowerCase().includes(this.search.toLowerCase()));
  }
}
