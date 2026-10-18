import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersPageComponent } from './pages/players/players-page.component';
import { DrawPageComponent } from './pages/draw/draw-page.component';
import { ResultsPageComponent } from './pages/results/results-page.component';
import { FormsModule } from '@angular/forms';
import { Player, PlayerType, Tab } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayersPageComponent, DrawPageComponent, ResultsPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
})
export class AppComponent {
  activeTab: Tab = 'players';
  players: Player[] = [
    { name: 'Pedro', initials: 'PE', type: 'line', selected: true }, { name: 'Lucas', initials: 'LU', type: 'line', selected: true },
    { name: 'Gabriel', initials: 'GA', type: 'line', selected: true }, { name: 'Rafael', initials: 'RA', type: 'line', selected: true },
    { name: 'Bruno', initials: 'BR', type: 'line', selected: true }, { name: 'Diego', initials: 'DI', type: 'line', selected: true },
    { name: 'Matheus', initials: 'MA', type: 'goalkeeper', selected: true }, { name: 'Fernando', initials: 'FE', type: 'goalkeeper', selected: true },
    { name: 'Vinicius', initials: 'VI', type: 'goalkeeper', selected: true }
  ];
  drawnTeams: Player[][] = [];
  drawnGoalkeepers: Player[] = [];
  playersPerTeam = 4;
  isAddPlayerModalOpen = false;
  newPlayerName = '';
  newPlayerType: PlayerType = 'line';

  setTab(tab: Tab): void { this.activeTab = tab; }

  openAddPlayerModal(): void {
    this.newPlayerName = '';
    this.newPlayerType = 'line';
    this.isAddPlayerModalOpen = true;
  }

  closeAddPlayerModal(): void {
    this.isAddPlayerModalOpen = false;
  }

  addPlayer(): void {
    const name = this.newPlayerName.trim();
    if (!name) {
      return;
    }

    this.players = [
      ...this.players,
      { name, initials: this.getInitials(name), type: this.newPlayerType, selected: true }
    ];
    this.closeAddPlayerModal();
  }

  private getInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
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
