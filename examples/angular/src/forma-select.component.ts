import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormaControlSize } from './forma-button.component';

export interface FormaSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

let nextSelectId = 0;

@Component({
  selector: 'forma-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="forma-field">
      <label class="forma-field__label" [attr.for]="id">
        <span>{{ label }}</span><span *ngIf="required" class="forma-field__required" aria-label="required">*</span>
      </label>
      <div class="forma-select-wrap">
        <select
          [id]="id"
          class="forma-control forma-select"
          [class.forma-control--sm]="size === 'sm'"
          [class.forma-control--md]="size === 'md'"
          [class.forma-control--lg]="size === 'lg'"
          [class.is-invalid]="!!error"
          [value]="value"
          [required]="required"
          [disabled]="disabled"
          [attr.aria-invalid]="error ? 'true' : 'false'"
          [attr.aria-describedby]="descriptionId"
          (change)="onChange($event)">
          <option value="" disabled>{{ placeholder }}</option>
          <option *ngFor="let option of options" [value]="option.value" [disabled]="option.disabled">{{ option.label }}</option>
        </select>
        <span class="forma-select__icon" aria-hidden="true">⌄</span>
      </div>
      <p *ngIf="error" class="forma-field__error" [id]="id + '-error'">{{ error }}</p>
      <p *ngIf="!error && hint" class="forma-field__hint" [id]="id + '-hint'">{{ hint }}</p>
    </div>
  `
})
export class FormaSelectComponent {
  @Input() id = `forma-angular-select-${++nextSelectId}`;
  @Input() label = '';
  @Input() value = '';
  @Input() placeholder = 'Choose an option';
  @Input() options: FormaSelectOption[] = [];
  @Input() size: FormaControlSize = 'md';
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string>();

  get descriptionId() {
    return this.error ? `${this.id}-error` : this.hint ? `${this.id}-hint` : null;
  }

  onChange(event: Event) {
    const nextValue = (event.target as HTMLSelectElement).value;
    this.value = nextValue;
    this.valueChange.emit(nextValue);
  }
}
