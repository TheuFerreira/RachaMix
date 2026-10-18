import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player, PlayerType } from '../../models';

export interface PlayerFormValue {
  name: string;
  type: PlayerType;
}

@Component({
  selector: 'app-player-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-modal.component.html',
  styleUrl: './player-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerModalComponent implements OnChanges {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() player: Player | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<PlayerFormValue>();

  name = '';
  type: PlayerType = 'line';
  isTypeMenuOpen = false;

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player'] || changes['mode']) {
      this.name = this.isEditMode && this.player ? this.player.name : '';
      this.type = this.isEditMode && this.player ? this.player.type : 'line';
      this.isTypeMenuOpen = false;
    }
  }

  close(): void {
    this.closed.emit();
  }

  toggleTypeMenu(): void {
    this.isTypeMenuOpen = !this.isTypeMenuOpen;
  }

  selectType(type: PlayerType): void {
    this.type = type;
    this.isTypeMenuOpen = false;
  }

  save(): void {
    const name = this.name.trim();
    if (name.length < 2) {
      return;
    }

    this.saved.emit({ name, type: this.type });
    if (!this.isEditMode) {
      this.name = '';
      this.type = 'line';
      this.isTypeMenuOpen = false;
    }
  }
}
