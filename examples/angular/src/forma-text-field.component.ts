import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormaControlSize } from './forma-button.component';

let nextFieldId = 0;

@Component({
  selector: 'forma-text-field',
  standalone: true,
  template: `
    <div class="forma-field">
      <label class="forma-field__label" [attr.for]="id">
        <span>{{ label }}</span><span *ngIf="required" class="forma-field__required" aria-label="required">*</span>
      </label>
      <input
        [id]="id"
        class="forma-control"
        [class.forma-control--sm]="size === 'sm'"
        [class.forma-control--md]="size === 'md'"
        [class.forma-control--lg]="size === 'lg'"
        [class.is-invalid]="!!error"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [required]="required"
        [disabled]="disabled"
        [attr.autocomplete]="autocomplete || null"
        [attr.aria-invalid]="error ? 'true' : 'false'"
        [attr.aria-describedby]="descriptionId"
        (input)="onInput($event)" />
      <p *ngIf="error" class="forma-field__error" [id]="id + '-error'">{{ error }}</p>
      <p *ngIf="!error && hint" class="forma-field__hint" [id]="id + '-hint'">{{ hint }}</p>
    </div>
  `,
  imports: [CommonModule]
})
export class FormaTextFieldComponent {
  @Input() id = `forma-angular-field-${++nextFieldId}`;
  @Input() label = '';
  @Input() type = 'text';
  @Input() size: FormaControlSize = 'md';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() error = '';
  @Input() value = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() autocomplete = '';
  @Output() valueChange = new EventEmitter<string>();

  get descriptionId() {
    return this.error ? `${this.id}-error` : this.hint ? `${this.id}-hint` : null;
  }

  onInput(event: Event) {
    const nextValue = (event.target as HTMLInputElement).value;
    this.value = nextValue;
    this.valueChange.emit(nextValue);
  }
}
