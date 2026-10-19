import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
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

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

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
    private readonly changeDetector: ChangeDetectorRef,
  ) {
    this.players = this.playerService.players;
    const savedDraw = this.storage.loadDrawState();
    this.playersPerTeam = savedDraw.playersPerTeam;
    this.drawnTeams = savedDraw.drawnTeams;
    this.drawnGoalkeepers = savedDraw.drawnGoalkeepers;
    this.setupInstallPrompt();
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
  showInstallAction = false;

  private installPrompt: InstallPromptEvent | null = null;

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

  async installApp(): Promise<void> {
    if (!this.installPrompt) {
      window.alert(
        'Para instalar no iPhone ou iPad, abra o menu Compartilhar do Safari e escolha “Adicionar à Tela de Início”.',
      );
      return;
    }

    await this.installPrompt.prompt();
    await this.installPrompt.userChoice;
    this.installPrompt = null;
    this.showInstallAction = false;
    this.changeDetector.markForCheck();
  }

  private setupInstallPrompt(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    this.showInstallAction = isIos && !isStandalone;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => undefined);
    }

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPrompt = event as InstallPromptEvent;
      this.showInstallAction = true;
      this.changeDetector.markForCheck();
    });

    window.addEventListener('appinstalled', () => {
      this.installPrompt = null;
      this.showInstallAction = false;
      this.changeDetector.markForCheck();
    });
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
