import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
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
  private toastTimeout?: number;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  async shareTeams(): Promise<void> {
    const result = this.formatTeamsForWhatsApp();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RachaMix - Times sorteados',
          text: result
        });
        return;
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === 'AbortError') {
          return;
        }
      }
    }

    let copied = false;

    try {
      await navigator.clipboard.writeText(result);
      copied = true;
    } catch (clipboardError) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = result;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand('copy');
        textarea.remove();
      } catch (fallbackError) {
        console.error('Erro ao copiar os times para a área de transferência.', {
          clipboardError,
          fallbackError
        });
        copied = false;
      }
    }

    if (!copied) {
      return;
    }

    this.copied = true;
    this.changeDetectorRef.markForCheck();
    window.clearTimeout(this.toastTimeout);
    this.toastTimeout = window.setTimeout(() => {
      this.copied = false;
      this.changeDetectorRef.markForCheck();
    }, 2000);
  }

 formatTeamsForWhatsApp(): string {
   const goalkeepers = this.goalkeepers.length
      ? `*Goleiros em revezamento:*\n${this.goalkeepers.map((player) => `• ${player.name}`).join('\n')}\n\n`
     : '';
   const teams = this.teams
      .map((team, index) => `*Time ${index + 1}* (${team.length} jogadores)\n${team.map((player) => `• ${player.name}`).join('\n')}`)
     .join('\n\n');

    return `*RachaMix — Times sorteados*\n\n${goalkeepers}${teams}`;
 }
}
