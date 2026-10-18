import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Player } from '../../models';

@Component({
  selector: 'app-import-players-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './import-players-modal.component.html',
  styleUrl: './import-players-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportPlayersModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() imported = new EventEmitter<string[]>();
  @Input() existingPlayers: Player[] = [];

  names = '';

  get importedCount(): number {
    return this.getImportableNames().length;
  }

  get duplicateCount(): number {
    return this.getNames().length - this.importedCount;
  }

  close(): void {
    this.closed.emit();
  }

  import(): void {
    const names = this.getImportableNames();
    if (names.length > 0) {
      this.imported.emit(names);
    }
  }

  private getNames(): string[] {
    const uniqueNames = new Map<string, string>();
    this.names.split(/\r?\n/)
      .map((name) => name.trim())
      .filter(Boolean)
      .forEach((name) => uniqueNames.set(name.toLocaleLowerCase(), name));
    return [...uniqueNames.values()];
  }

  private getImportableNames(): string[] {
    const existingNames = new Set(
      this.existingPlayers.map((player) => player.name.trim().toLocaleLowerCase())
    );
    return this.getNames().filter((name) => !existingNames.has(name.toLocaleLowerCase()));
  }
}
