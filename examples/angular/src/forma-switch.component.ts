import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormaControlSize } from './forma-button.component';

let nextSwitchId = 0;

@Component({
  selector: 'forma-switch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="forma-switch-row" [class.forma-switch-row--sm]="size === 'sm'" [class.forma-switch-row--lg]="size === 'lg'" [attr.for]="id">
      <span class="forma-choice__copy"><span class="forma-choice__label">{{ label }}</span><span *ngIf="description" class="forma-choice__description">{{ description }}</span></span>
      <span class="forma-switch"><input [id]="id" class="forma-switch__input" type="checkbox" role="switch" [checked]="checked" [disabled]="disabled" [attr.aria-checked]="checked" (change)="onChange($event)" /><span class="forma-switch__track" aria-hidden="true"><span class="forma-switch__thumb"></span></span></span>
    </label>
  `
})
export class FormaSwitchComponent {
  @Input() id = `forma-angular-switch-${++nextSwitchId}`;
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
