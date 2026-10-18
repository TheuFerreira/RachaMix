import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersPageComponent } from './pages/players/players-page.component';
import { DrawPageComponent } from './pages/draw/draw-page.component';
import { ResultsPageComponent } from './pages/results/results-page.component';
import { Player, Tab } from './models';
import { PlayerFormValue, PlayerModalComponent } from './components/player-modal/player-modal.component';
import { PlayerService } from './player.service';
import { ImportPlayersModalComponent } from './components/import-players-modal/import-players-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PlayersPageComponent, DrawPageComponent, ResultsPageComponent, PlayerModalComponent, ImportPlayersModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
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

  setTab(tab: Tab): void { this.activeTab = tab; }

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

  generateDraw(playersPerTeam: number): void {
    this.playersPerTeam = playersPerTeam;
    const selectedLinePlayers = this.shuffle(
      this.players.filter((player) => player.type === 'line' && player.selected)
    );
    const selectedGoalkeepers = this.shuffle(
      this.players.filter((player) => player.type === 'goalkeeper' && player.selected)
    );

    const teamCount = Math.ceil(selectedLinePlayers.length / playersPerTeam);
    this.drawnTeams = Array.from({ length: teamCount }, () => [] as Player[]);
    selectedLinePlayers.forEach((player, index) => {
      this.drawnTeams[index % teamCount].push(player);
    });
    this.drawnGoalkeepers = selectedGoalkeepers;
  }

  redraw(): void {
    this.generateDraw(this.playersPerTeam);
  }

  private shuffle(players: Player[]): Player[] {
    const shuffled = [...players];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
  }
}
