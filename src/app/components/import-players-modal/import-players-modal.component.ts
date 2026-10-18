import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  names = '';

  get importedCount(): number {
    return this.getNames().length;
  }

  close(): void {
    this.closed.emit();
  }

  import(): void {
    const names = this.getNames();
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
}
