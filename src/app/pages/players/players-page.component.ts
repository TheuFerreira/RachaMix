import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../models';
import { PlayerSectionComponent } from './player-section.component';

@Component({
  selector: 'app-players-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerSectionComponent],
  templateUrl: './players-page.component.html',
  styleUrl: './players-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersPageComponent {
  @Input({ required: true }) players: Player[] = [];
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Player>();
  @Output() importPlayers = new EventEmitter<void>();

  search = '';
  activeSection: 'all' | 'line' | 'goalkeeper' = 'all';
  playerPendingRemoval: Player | null = null;

  get linePlayers(): Player[] { return this.players.filter((player) => player.type === 'line'); }
  get goalkeepers(): Player[] { return this.players.filter((player) => player.type === 'goalkeeper'); }
  get filteredPlayers(): Player[] {
    const search = this.search.toLowerCase();

    return this.players.filter((player) => {
      const matchesSection = this.activeSection === 'all' || player.type === this.activeSection;
      const matchesSearch = player.name.toLowerCase().includes(search);
      return matchesSection && matchesSearch;
    });
  }

  get filteredGoalkeepers(): Player[] {
    return this.filteredPlayers.filter((player) => player.type === 'goalkeeper');
  }

  get filteredLinePlayers(): Player[] {
    return this.filteredPlayers.filter((player) => player.type === 'line');
  }

  setSection(section: 'all' | 'line' | 'goalkeeper'): void {
    this.activeSection = section;
  }

  removePlayer(playerToRemove: Player): void {
    this.players = this.players.filter((player) => player !== playerToRemove);
  }

  requestRemovePlayer(player: Player): void {
    this.playerPendingRemoval = player;
  }

  cancelRemovePlayer(): void {
    this.playerPendingRemoval = null;
  }

  confirmRemovePlayer(): void {
    if (this.playerPendingRemoval) {
      this.removePlayer(this.playerPendingRemoval);
      this.playerPendingRemoval = null;
    }
  }
}
