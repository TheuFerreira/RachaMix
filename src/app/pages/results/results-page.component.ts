import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsPageComponent {
  @Input({ required: true }) players: Player[] = [];
  @Output() back = new EventEmitter<void>();
  @Output() redraw = new EventEmitter<void>();

  get linePlayers(): Player[] { return this.players.filter((player) => player.type === 'line'); }
  get goalkeepers(): Player[] { return this.players.filter((player) => player.type === 'goalkeeper'); }
}
