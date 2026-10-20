import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FormaButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'quiet';
export type FormaControlSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'forma-button',
  standalone: true,
  template: `
    <button
      [class]="buttonClass"
      [type]="type"
      [disabled]="disabled || loading"
      [attr.aria-busy]="loading ? 'true' : null">
      <span *ngIf="loading" class="forma-button__spinner" aria-hidden="true">◌</span>
      <ng-content></ng-content>
    </button>
  `,
  imports: [CommonModule]
})
export class FormaButtonComponent {
  @Input() variant: FormaButtonVariant = 'primary';
  @Input() size: FormaControlSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;

  get buttonClass() {
    return `forma-button forma-button--${this.variant} forma-button--${this.size}${this.fullWidth ? ' forma-button--full' : ''}`;
  }
}
