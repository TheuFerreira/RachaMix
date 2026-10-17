import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsPageComponent {
  @Input({ required: true }) players: Player[] = [];
  @Input({ required: true }) teams: Player[][] = [];
  @Input({ required: true }) goalkeepers: Player[] = [];
  @Output() back = new EventEmitter<void>();
  @Output() redraw = new EventEmitter<void>();

}
