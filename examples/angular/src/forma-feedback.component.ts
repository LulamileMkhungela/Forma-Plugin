import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FormaBadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
export type FormaAlertTone = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'forma-badge',
  standalone: true,
  template: '<span class="forma-badge" [class]="badgeClass"><span *ngIf="dot" class="forma-badge__dot" aria-hidden="true"></span><ng-content></ng-content></span>',
  imports: [CommonModule]
})
export class FormaBadgeComponent {
  @Input() tone: FormaBadgeTone = 'neutral';
  @Input() size: 'sm' | 'md' = 'md';
  @Input() dot = false;
  get badgeClass() { return `forma-badge forma-badge--${this.tone} forma-badge--${this.size}`; }
}

@Component({
  selector: 'forma-alert',
  standalone: true,
  template: `
    <div class="forma-alert" [class]="alertClass" [attr.role]="tone === 'danger' ? 'alert' : 'status'">
      <span class="forma-alert__icon" aria-hidden="true">{{ iconForTone }}</span>
      <div class="forma-alert__content"><p class="forma-alert__title">{{ title }}</p><div class="forma-alert__body"><ng-content></ng-content></div></div>
    </div>
  `,
  imports: [CommonModule]
})
export class FormaAlertComponent {
  @Input() tone: FormaAlertTone = 'info';
  @Input() title = '';
  get alertClass() { return `forma-alert forma-alert--${this.tone}`; }
  get iconForTone() { return this.tone === 'success' ? '✓' : this.tone === 'warning' ? '!' : this.tone === 'danger' ? '×' : 'i'; }
}
