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
  copied = false;

  async shareTeams(): Promise<void> {
    const result = this.formatTeams();
    let copied = false;

    try {
      await navigator.clipboard.writeText(result);
      copied = true;
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = result;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand('copy');
        textarea.remove();
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      return;
    }

    this.copied = true;
    window.setTimeout(() => {
      this.copied = false;
    }, 2000);
  }

  private formatTeams(): string {
    const goalkeepers = this.goalkeepers.length
      ? `Goleiros em revezamento:\n${this.goalkeepers.map((player) => `- ${player.name}`).join('\n')}\n\n`
      : '';
    const teams = this.teams
      .map((team, index) => `Time ${index + 1}:\n${team.map((player) => `- ${player.name}`).join('\n')}`)
      .join('\n\n');

    return `${goalkeepers}${teams}`;
  }
}
