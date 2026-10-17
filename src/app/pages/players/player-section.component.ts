import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player, PlayerType } from '../../models';

@Component({
  selector: 'app-player-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-section.component.html',
  styleUrl: './player-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerSectionComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) icon = '';
  @Input({ required: true }) type: PlayerType = 'line';
  @Input({ required: true }) players: Player[] = [];
  @Input({ required: true }) total = 0;
  @Output() remove = new EventEmitter<Player>();

  get typeLabel(): string {
    return this.type === 'line' ? 'Linha' : 'Goleiro';
  }
}
