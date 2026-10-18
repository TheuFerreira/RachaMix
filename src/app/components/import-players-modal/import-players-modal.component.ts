import type { AfterViewInit, ElementRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Player } from '../../models';

@Component({
  selector: 'app-import-players-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './import-players-modal.component.html',
  styleUrl: './import-players-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportPlayersModalComponent implements AfterViewInit {
  @Output() closed = new EventEmitter<void>();
  @Output() imported = new EventEmitter<string[]>();
  @Input() existingPlayers: Player[] = [];
  @ViewChild('modal') modal?: ElementRef<HTMLElement>;

  names = '';

  ngAfterViewInit(): void {
    queueMicrotask(() => this.modal?.nativeElement.querySelector<HTMLElement>('textarea')?.focus());
  }

  get importedCount(): number {
    return this.getImportableNames().length;
  }

  get duplicateCount(): number {
    return this.getNames().length - this.importedCount;
  }

  close(): void {
    this.closed.emit();
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

    const focusable = Array.from(
      this.modal.nativeElement.querySelectorAll<HTMLElement>(
        'button, textarea, input, [tabindex]:not([tabindex="-1"])',
      ),
    );
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

  import(): void {
    const names = this.getImportableNames();
    if (names.length > 0) {
      this.imported.emit(names);
    }
  }

  private getNames(): string[] {
    const uniqueNames = new Map<string, string>();
    this.names
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter(Boolean)
      .forEach((name) => uniqueNames.set(name.toLocaleLowerCase(), name));
    return [...uniqueNames.values()];
  }

  private getImportableNames(): string[] {
    const existingNames = new Set(
      this.existingPlayers.map((player) => player.name.trim().toLocaleLowerCase()),
    );
    return this.getNames().filter((name) => !existingNames.has(name.toLocaleLowerCase()));
  }
}
