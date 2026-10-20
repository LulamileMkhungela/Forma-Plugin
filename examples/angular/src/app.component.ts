import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormaAlertComponent, FormaBadgeComponent, FormaButtonComponent, FormaCheckboxComponent,
  FormaSelectComponent, FormaSwitchComponent, FormaTextFieldComponent, FormaSelectOption
} from './index';

@Component({
  selector: 'forma-angular-demo',
  standalone: true,
  imports: [CommonModule, FormaAlertComponent, FormaBadgeComponent, FormaButtonComponent, FormaCheckboxComponent, FormaSelectComponent, FormaSwitchComponent, FormaTextFieldComponent],
  template: `
    <main class="angular-demo">
      <header class="angular-demo__header">
        <div class="brand-lockup"><img class="brand-mark" src="/forma-icon-128.png" alt="" /><span class="brand-text"><strong>forma<span>.</span></strong><small>ANGULAR ADAPTER</small></span></div>
        <forma-badge tone="success" [dot]="true">Local demo</forma-badge>
      </header>
      <div class="angular-demo__layout">
        <section class="angular-demo__intro">
          <div class="eyebrow"><span class="eyebrow-dot"></span> FORMS · COMPOSED WITH CARE</div>
          <h1>A shared language.<br /><span>Angular native.</span></h1>
          <p>These standalone components use the same DTCG tokens and interaction patterns as Forma’s React library.</p>
          <div class="angular-demo__author"><span class="avatar-stack"><span>LM</span><i>F</i><i>DS</i></span>Built by <strong>Lulamile Mkhungela</strong></div>
          <div class="angular-demo__principles"><span><i>✓</i> Shared semantic tokens</span><span><i>✓</i> Native accessible controls</span><span><i>✓</i> Typed component inputs</span></div>
        </section>
        <section class="angular-demo__panel">
          <div class="angular-demo__panel-head"><span class="signup-step"><span>01</span> YOUR WORKSPACE</span><h2>Start with the basics.</h2><p>Set up your team’s Forma workspace in a few steps.</p></div>
          <form class="angular-demo__form" (submit)="submit($event)" novalidate>
            <forma-text-field label="Work email" type="email" placeholder="you@company.com" autocomplete="email" [required]="true" [value]="email" [error]="emailError" hint="A work address helps your team find you." (valueChange)="email = $event" />
            <forma-select label="Team size" placeholder="Select a range" [options]="teamSizes" [value]="teamSize" [required]="true" [error]="teamError" (valueChange)="teamSize = $event" />
            <forma-checkbox label="Send me thoughtful product updates" description="Occasional notes when something new ships." [checked]="updates" (checkedChange)="updates = $event" />
            <forma-switch label="Weekly summary" description="A quick digest, delivered every Monday." [checked]="weeklySummary" (checkedChange)="weeklySummary = $event" />
            <forma-button type="submit" [fullWidth]="true">Create your workspace <span aria-hidden="true">→</span></forma-button>
            <p class="angular-demo__footnote">A runnable Angular 22 example · shared CSS tokens from the Forma source.</p>
            <forma-alert *ngIf="submitted" tone="success" title="You're all set.">Your workspace request is ready. Welcome to Forma.</forma-alert>
          </form>
        </section>
      </div>
      <footer class="angular-demo__footer"><span>Forma Design System</span><span>Tokens → Angular → Storybook</span><strong>By Lulamile Mkhungela</strong></footer>
    </main>
  `
})
export class AppComponent {
  email = '';
  teamSize = '';
  emailError = '';
  teamError = '';
  updates = true;
  weeklySummary = true;
  submitted = false;
  teamSizes: FormaSelectOption[] = [
    { value: 'solo', label: 'Just me' },
    { value: '2-5', label: '2–5 people' },
    { value: '6-20', label: '6–20 people' },
    { value: '21+', label: '21+ people' }
  ];

  submit(event: Event) {
    event.preventDefault();
    this.emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) ? '' : 'Enter a valid work email.';
    this.teamError = this.teamSize ? '' : 'Choose a team size to continue.';
    this.submitted = !this.emailError && !this.teamError;
  }
}
