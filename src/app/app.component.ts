import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersPageComponent } from './pages/players/players-page.component';
import { DrawPageComponent } from './pages/draw/draw-page.component';
import { ResultsPageComponent } from './pages/results/results-page.component';
import { Player, Tab } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PlayersPageComponent, DrawPageComponent, ResultsPageComponent],
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

  setTab(tab: Tab): void { this.activeTab = tab; }

  addPlayer(): void {
    this.players = [...this.players, { name: 'Novo jogador', initials: 'NJ', type: 'line', selected: true }];
  }
}
