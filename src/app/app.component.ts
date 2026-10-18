import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersPageComponent } from './pages/players/players-page.component';
import { DrawPageComponent } from './pages/draw/draw-page.component';
import { ResultsPageComponent } from './pages/results/results-page.component';
import type { Player, Tab } from './models';
import type { PlayerFormValue } from './components/player-modal/player-modal.component';
import { PlayerModalComponent } from './components/player-modal/player-modal.component';
import { PlayerService } from './player.service';
import { ImportPlayersModalComponent } from './components/import-players-modal/import-players-modal.component';
import { drawTeams, shufflePlayers } from './draw-utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    PlayersPageComponent,
    DrawPageComponent,
    ResultsPageComponent,
    PlayerModalComponent,
    ImportPlayersModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private readonly playerService: PlayerService) {}

  activeTab: Tab = 'players';
  players: Player[] = this.playerService.players;
  drawnTeams: Player[][] = [];
  drawnGoalkeepers: Player[] = [];
  playersPerTeam = 4;
  isAddPlayerModalOpen = false;
  isEditPlayerModalOpen = false;
  isImportPlayersModalOpen = false;
  editingPlayer: Player | null = null;

  setTab(tab: Tab): void {
    this.activeTab = tab;
  }

  openAddPlayerModal(): void {
    this.isAddPlayerModalOpen = true;
  }

  closeAddPlayerModal(): void {
    this.isAddPlayerModalOpen = false;
  }

  openEditPlayerModal(player: Player): void {
    this.editingPlayer = player;
    this.isEditPlayerModalOpen = true;
  }

  closeEditPlayerModal(): void {
    this.isEditPlayerModalOpen = false;
    this.editingPlayer = null;
  }

  openImportPlayersModal(): void {
    this.isImportPlayersModalOpen = true;
  }

  closeImportPlayersModal(): void {
    this.isImportPlayersModalOpen = false;
  }

  addPlayer(form: PlayerFormValue): void {
    this.players = this.playerService.add(form);
  }

  saveEditedPlayer(form: PlayerFormValue): void {
    if (!this.editingPlayer) {
      return;
    }

    this.players = this.playerService.update(this.editingPlayer, form);
    this.closeEditPlayerModal();
  }

  importPlayers(names: string[]): void {
    this.players = this.playerService.importLinePlayers(names);
    this.closeImportPlayersModal();
  }

  removePlayer(player: Player): void {
    this.players = this.playerService.remove(player);
  }

  setPlayerSelected(player: Player, selected: boolean): void {
    this.players = this.playerService.setSelected(player, selected);
  }

  generateDraw(playersPerTeam: number): void {
    this.playersPerTeam = playersPerTeam;
    const selectedLinePlayers = this.players.filter(
      (player) => player.type === 'line' && player.selected,
    );
    const selectedGoalkeepers = shufflePlayers(
      this.players.filter((player) => player.type === 'goalkeeper' && player.selected),
    );

    if (selectedLinePlayers.length < 2 || playersPerTeam < 2) {
      this.drawnTeams = [];
      this.drawnGoalkeepers = [];
      return;
    }

    this.drawnTeams = drawTeams(selectedLinePlayers, playersPerTeam);
    this.drawnGoalkeepers = selectedGoalkeepers;
  }

  redraw(): void {
    this.generateDraw(this.playersPerTeam);
  }
}
