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
import { AppStorageService } from './app-storage.service';

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
  constructor(
    private readonly playerService: PlayerService,
    private readonly storage: AppStorageService,
  ) {
    this.players = this.playerService.players;
    const savedDraw = this.storage.loadDrawState();
    this.playersPerTeam = savedDraw.playersPerTeam;
    this.drawnTeams = savedDraw.drawnTeams;
    this.drawnGoalkeepers = savedDraw.drawnGoalkeepers;
  }

  activeTab: Tab = 'players';
  players: Player[] = [];
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

  setPlayersPerTeam(playersPerTeam: number): void {
    this.playersPerTeam = playersPerTeam;
    this.persistState();
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
    this.persistState();
  }

  saveEditedPlayer(form: PlayerFormValue): void {
    if (!this.editingPlayer) {
      return;
    }

    this.players = this.playerService.update(this.editingPlayer, form);
    this.persistState();
    this.closeEditPlayerModal();
  }

  importPlayers(names: string[]): void {
    this.players = this.playerService.importLinePlayers(names);
    this.persistState();
    this.closeImportPlayersModal();
  }

  removePlayer(player: Player): void {
    this.players = this.playerService.remove(player);
    this.persistState();
  }

  setPlayerSelected(player: Player, selected: boolean): void {
    this.players = this.playerService.setSelected(player, selected);
    this.persistState();
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
      this.persistState();
      return;
    }

    this.drawnTeams = drawTeams(selectedLinePlayers, playersPerTeam);
    this.drawnGoalkeepers = selectedGoalkeepers;
    this.persistState();
  }

  redraw(): void {
    this.generateDraw(this.playersPerTeam);
  }

  private persistState(): void {
    this.storage.saveDrawState(
      {
        playersPerTeam: this.playersPerTeam,
        drawnTeams: this.drawnTeams,
        drawnGoalkeepers: this.drawnGoalkeepers,
      },
      this.players,
    );
  }
}
