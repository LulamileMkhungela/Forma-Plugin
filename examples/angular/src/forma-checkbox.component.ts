import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormaControlSize } from './forma-button.component';

let nextCheckboxId = 0;

@Component({
  selector: 'forma-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="forma-choice" [class.forma-choice--sm]="size === 'sm'" [class.forma-choice--lg]="size === 'lg'" [attr.for]="id">
      <span class="forma-choice__control">
        <input [id]="id" class="forma-choice__input" type="checkbox" [checked]="checked" [disabled]="disabled" (change)="onChange($event)" />
        <span class="forma-choice__indicator" aria-hidden="true">✓</span>
      </span>
      <span class="forma-choice__copy"><span class="forma-choice__label">{{ label }}</span><span *ngIf="description" class="forma-choice__description">{{ description }}</span></span>
    </label>
  `
})
export class FormaCheckboxComponent {
  @Input() id = `forma-angular-checkbox-${++nextCheckboxId}`;
  @Input() label = '';
  @Input() description = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() size: FormaControlSize = 'md';
  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(event: Event) {
    this.checked = (event.target as HTMLInputElement).checked;
    this.checkedChange.emit(this.checked);
  }
}
