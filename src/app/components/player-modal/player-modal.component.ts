import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
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
export class PlayerModalComponent implements AfterViewInit, OnChanges {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() player: Player | null = null;
  @Input() existingPlayers: Player[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<PlayerFormValue>();
  @ViewChild('nameInput') nameInput?: ElementRef<HTMLInputElement>;
  @ViewChild('modal') modal?: ElementRef<HTMLElement>;

  name = '';
  type: PlayerType = 'line';
  isTypeMenuOpen = false;
  nameTouched = false;

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get nameError(): string {
    const normalizedName = this.name.trim().toLocaleLowerCase();
    if (normalizedName.length > 0 && normalizedName.length < 2) {
      return 'Digite pelo menos 2 caracteres.';
    }

    const duplicated = this.existingPlayers.some((player) =>
      player !== this.player && player.name.trim().toLocaleLowerCase() === normalizedName
    );
    return duplicated ? 'Já existe um jogador com esse nome.' : '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player'] || changes['mode']) {
      this.name = this.isEditMode && this.player ? this.player.name : '';
      this.type = this.isEditMode && this.player ? this.player.type : 'line';
      this.isTypeMenuOpen = false;
      this.nameTouched = false;
    }
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.nameInput?.nativeElement.focus());
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

  markNameAsTouched(): void {
    this.nameTouched = true;
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key !== 'Tab' || !this.modal) {
      return;
    }

    const focusable = Array.from(this.modal.nativeElement.querySelectorAll<HTMLElement>(
      'button, input, [tabindex]:not([tabindex="-1"])'
    ));
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  save(): void {
    const name = this.name.trim();
    this.nameTouched = true;
    if (name.length < 2 || this.nameError) {
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
