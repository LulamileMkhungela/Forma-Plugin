import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type KeyboardEvent, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Check, ChevronDown, LoaderCircle } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'quiet';
export type ControlSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ControlSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  className = '',
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={['forma-button', `forma-button--${variant}`, `forma-button--${size}`, fullWidth ? 'forma-button--full' : '', className].filter(Boolean).join(' ')}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle className="forma-button__spinner" size={15} aria-hidden="true" /> : leadingIcon}
      <span>{children}</span>
      {!loading && trailingIcon}
    </button>
  );
}

export interface FieldBaseProps {
  label: string;
  hint?: string;
  error?: string;
  size?: ControlSize;
  required?: boolean;
  className?: string;
}

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, FieldBaseProps {}

export function TextField({
  label,
  hint,
  error,
  size = 'md',
  required,
  className = '',
  id,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = [hint ? `${fieldId}-hint` : '', error ? `${fieldId}-error` : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className={['forma-field', className].filter(Boolean).join(' ')}>
      <label className="forma-field__label" htmlFor={fieldId}>
        <span>{label}</span>
        {required && <span className="forma-field__required" aria-label="required">*</span>}
      </label>
      <input
        id={fieldId}
        className={`forma-control forma-control--${size}${error ? ' is-invalid' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        required={required}
        {...inputProps}
      />
      {error ? <p className="forma-field__error" id={`${fieldId}-error`}>{error}</p> : hint ? <p className="forma-field__hint" id={`${fieldId}-hint`}>{hint}</p> : null}
    </div>
  );
}

export interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>, FieldBaseProps {}

export function TextAreaField({
  label,
  hint,
  error,
  size = 'md',
  required,
  className = '',
  id,
  ...textareaProps
}: TextAreaFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = [hint ? `${fieldId}-hint` : '', error ? `${fieldId}-error` : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className={['forma-field', className].filter(Boolean).join(' ')}>
      <label className="forma-field__label" htmlFor={fieldId}>
        <span>{label}</span>
        {required && <span className="forma-field__required" aria-label="required">*</span>}
      </label>
      <textarea
        id={fieldId}
        className={`forma-control forma-control--${size} forma-control--textarea${error ? ' is-invalid' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        required={required}
        {...textareaProps}
      />
      {error ? <p className="forma-field__error" id={`${fieldId}-error`}>{error}</p> : hint ? <p className="forma-field__hint" id={`${fieldId}-hint`}>{hint}</p> : null}
    </div>
  );
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>, FieldBaseProps {
  options: SelectOption[];
  placeholder?: string;
}

export function SelectField({
  label,
  hint,
  error,
  size = 'md',
  required,
  className = '',
  id,
  options,
  placeholder = 'Choose an option',
  ...selectProps
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = [hint ? `${fieldId}-hint` : '', error ? `${fieldId}-error` : ''].filter(Boolean).join(' ') || undefined;
  const { value, defaultValue, ...restSelectProps } = selectProps;
  const selectionState = value !== undefined ? { value } : { defaultValue: defaultValue ?? '' };

  return (
    <div className={['forma-field', className].filter(Boolean).join(' ')}>
      <label className="forma-field__label" htmlFor={fieldId}>
        <span>{label}</span>
        {required && <span className="forma-field__required" aria-label="required">*</span>}
      </label>
      <div className="forma-select-wrap">
        <select
          id={fieldId}
          className={`forma-control forma-control--${size} forma-select${error ? ' is-invalid' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          required={required}
          {...restSelectProps}
          {...selectionState}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
        </select>
        <ChevronDown size={16} className="forma-select__icon" aria-hidden="true" />
      </div>
      {error ? <p className="forma-field__error" id={`${fieldId}-error`}>{error}</p> : hint ? <p className="forma-field__hint" id={`${fieldId}-hint`}>{hint}</p> : null}
    </div>
  );
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: string;
  description?: string;
  size?: ControlSize;
}

export function Checkbox({ label, description, size = 'md', className = '', id, ...inputProps }: CheckboxProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  return (
    <label className={['forma-choice', `forma-choice--${size}`, className].filter(Boolean).join(' ')} htmlFor={controlId}>
      <span className="forma-choice__control">
        <input id={controlId} type="checkbox" className="forma-choice__input" {...inputProps} />
        <span className="forma-choice__indicator" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
      </span>
      <span className="forma-choice__copy">
        <span className="forma-choice__label">{label}</span>
        {description && <span className="forma-choice__description">{description}</span>}
      </span>
    </label>
  );
}

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: string;
  description?: string;
  size?: ControlSize;
}

export function Switch({ label, description, size = 'md', className = '', id, ...inputProps }: SwitchProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  return (
    <label className={['forma-switch-row', `forma-switch-row--${size}`, className].filter(Boolean).join(' ')} htmlFor={controlId}>
      <span className="forma-choice__copy">
        <span className="forma-choice__label">{label}</span>
        {description && <span className="forma-choice__description">{description}</span>}
      </span>
      <span className="forma-switch">
        <input id={controlId} className="forma-switch__input" type="checkbox" role="switch" {...inputProps} />
        <span className="forma-switch__track" aria-hidden="true"><span className="forma-switch__thumb" /></span>
      </span>
    </label>
  );
}

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
  size?: 'sm' | 'md';
}

export function Badge({ tone = 'neutral', dot = false, size = 'md', className = '', children, ...props }: BadgeProps) {
  return (
    <span className={['forma-badge', `forma-badge--${tone}`, `forma-badge--${size}`, className].filter(Boolean).join(' ')} {...props}>
      {dot && <span className="forma-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title: string;
  icon?: ReactNode;
}

export function Alert({ tone = 'info', title, icon, className = '', children, ...props }: AlertProps) {
  return (
    <div className={['forma-alert', `forma-alert--${tone}`, className].filter(Boolean).join(' ')} role={tone === 'danger' ? 'alert' : 'status'} {...props}>
      {icon && <span className="forma-alert__icon" aria-hidden="true">{icon}</span>}
      <div className="forma-alert__content">
        <p className="forma-alert__title">{title}</p>
        {children && <div className="forma-alert__body">{children}</div>}
      </div>
    </div>
  );
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ interactive = false, padding = 'md', className = '', ...props }: CardProps) {
  return <div className={['forma-card', `forma-card--${padding}`, interactive ? 'forma-card--interactive' : '', className].filter(Boolean).join(' ')} {...props} />;
}

export function CardHeader({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['forma-card__header', className].filter(Boolean).join(' ')} {...props} />;
}

export function CardTitle({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={['forma-card__title', className].filter(Boolean).join(' ')} {...props} />;
}

export function CardDescription({ className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={['forma-card__description', className].filter(Boolean).join(' ')} {...props} />;
}

export function CardContent({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['forma-card__content', className].filter(Boolean).join(' ')} {...props} />;
}

export function CardFooter({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['forma-card__footer', className].filter(Boolean).join(' ')} {...props} />;
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, src, size = 'md', className = '', ...props }: AvatarProps) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return (
    <span className={['forma-avatar', `forma-avatar--${size}`, className].filter(Boolean).join(' ')} role="img" aria-label={name} {...props}>
      {src ? <img src={src} alt="" /> : initials}
    </span>
  );
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  label: string;
  options: RadioOption[];
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  required?: boolean;
}

export function RadioGroup({
  label,
  options,
  name,
  value,
  defaultValue = '',
  onValueChange,
  orientation = 'vertical',
  required,
  className = '',
  ...props
}: RadioGroupProps) {
  const generatedId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value ?? internalValue;
  function select(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }
  return (
    <fieldset className={['forma-radio-group', `forma-radio-group--${orientation}`, className].filter(Boolean).join(' ')} {...props}>
      <legend className="forma-field__label">{label}{required && <span className="forma-field__required" aria-label="required">*</span>}</legend>
      <div className="forma-radio-group__options">
        {options.map((option, index) => (
          <label className={`forma-radio${option.disabled ? ' is-disabled' : ''}`} key={option.value}>
            <input
              className="forma-radio__input"
              type="radio"
              name={name ?? generatedId}
              value={option.value}
              checked={selectedValue === option.value}
              disabled={option.disabled}
              required={required && index === 0}
              onChange={() => select(option.value)}
            />
            <span className="forma-radio__indicator" aria-hidden="true" />
            <span className="forma-radio__copy">
              <span className="forma-choice__label">{option.label}</span>
              {option.description && <span className="forma-choice__description">{option.description}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  ariaLabel?: string;
}

export function Tabs({ tabs, value, defaultValue, onValueChange, ariaLabel = 'Content sections', className = '', ...props }: TabsProps) {
  const baseId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? tabs[0]?.id ?? '');
  const selectedValue = value ?? internalValue;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  function select(nextValue: string, focusIndex?: number) {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    if (focusIndex !== undefined) tabRefs.current[focusIndex]?.focus();
  }
  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const enabled = tabs.map((tab, tabIndex) => tab.disabled ? -1 : tabIndex).filter((tabIndex) => tabIndex >= 0);
    const enabledPosition = enabled.indexOf(index);
    let nextPosition = enabledPosition;
    if (event.key === 'ArrowRight') nextPosition = (enabledPosition + 1) % enabled.length;
    else if (event.key === 'ArrowLeft') nextPosition = (enabledPosition - 1 + enabled.length) % enabled.length;
    else if (event.key === 'Home') nextPosition = 0;
    else if (event.key === 'End') nextPosition = enabled.length - 1;
    else return;
    event.preventDefault();
    const nextIndex = enabled[nextPosition];
    select(tabs[nextIndex].id, nextIndex);
  }
  return (
    <div className={['forma-tabs', className].filter(Boolean).join(' ')} {...props}>
      <div className="forma-tabs__list" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab, index) => {
          const active = tab.id === selectedValue;
          return <button
            className="forma-tabs__tab"
            id={`${baseId}-${tab.id}-tab`}
            key={tab.id}
            ref={(element) => { tabRefs.current[index] = element; }}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`${baseId}-${tab.id}-panel`}
            tabIndex={active ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => select(tab.id)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
          >{tab.label}</button>;
        })}
      </div>
      {tabs.map((tab) => tab.id === selectedValue && <div
        className="forma-tabs__panel"
        id={`${baseId}-${tab.id}-panel`}
        key={tab.id}
        role="tabpanel"
        aria-labelledby={`${baseId}-${tab.id}-tab`}
        tabIndex={0}
      >{tab.content}</div>)}
    </div>
  );
}

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  defaultOpen?: string[];
  allowMultiple?: boolean;
}

export function Accordion({ items, defaultOpen = [], allowMultiple = true, className = '', ...props }: AccordionProps) {
  const baseId = useId();
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);
  function toggle(id: string) {
    setOpenItems((previous) => {
      if (previous.includes(id)) return previous.filter((itemId) => itemId !== id);
      return allowMultiple ? [...previous, id] : [id];
    });
  }
  return (
    <div className={['forma-accordion', className].filter(Boolean).join(' ')} {...props}>
      {items.map((item) => {
        const open = openItems.includes(item.id);
        return <section className="forma-accordion__item" key={item.id}>
          <h3 className="forma-accordion__heading">
            <button
              className="forma-accordion__trigger"
              id={`${baseId}-${item.id}-trigger`}
              type="button"
              aria-expanded={open}
              aria-controls={`${baseId}-${item.id}-panel`}
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
            >
              <span>{item.title}</span><ChevronDown size={16} aria-hidden="true" />
            </button>
          </h3>
          <div className="forma-accordion__panel" id={`${baseId}-${item.id}-panel`} role="region" aria-labelledby={`${baseId}-${item.id}-trigger`} hidden={!open}>
            {item.content}
          </div>
        </section>;
      })}
    </div>
  );
}

export interface DialogProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, title, description, children, className = '', ...props }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);
  function close() {
    onOpenChange(false);
  }
  return (
    <dialog
      ref={dialogRef}
      className={['forma-dialog', className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClose={() => { if (open) onOpenChange(false); }}
      onClick={(event) => { if (event.target === dialogRef.current) close(); }}
      {...props}
    >
      <div className="forma-dialog__header">
        <div><h2 className="forma-dialog__title" id={titleId}>{title}</h2>{description && <p className="forma-dialog__description" id={descriptionId}>{description}</p>}</div>
        <Button variant="quiet" size="sm" onClick={close} aria-label="Close dialog">Close</Button>
      </div>
      <div className="forma-dialog__content">{children}</div>
    </dialog>
  );
}

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: string;
  value?: number;
  max?: number;
  showValue?: boolean;
}

export function Progress({ label, value, max = 100, showValue = true, className = '', ...props }: ProgressProps) {
  const progressId = useId();
  const safeValue = value === undefined ? undefined : Math.min(max, Math.max(0, value));
  const percent = safeValue === undefined ? undefined : Math.round((safeValue / max) * 100);
  return (
    <div className={['forma-progress', className].filter(Boolean).join(' ')} {...props}>
      <div className="forma-progress__heading"><label htmlFor={progressId}>{label}</label>{showValue && percent !== undefined && <span>{percent}%</span>}</div>
      <progress id={progressId} className="forma-progress__bar" value={safeValue} max={max} aria-valuetext={percent === undefined ? 'In progress' : `${percent}%`} />
    </div>
  );
}

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children, className = '', ...props }: TooltipProps) {
  const tooltipId = useId();
  const trigger = isValidElement<{ className?: string; 'aria-describedby'?: string }>(children)
    ? cloneElement(children, {
        className: ['forma-tooltip__trigger', children.props.className].filter(Boolean).join(' '),
        'aria-describedby': [children.props['aria-describedby'], tooltipId].filter(Boolean).join(' ')
      })
    : <span className="forma-tooltip__trigger" tabIndex={0} aria-describedby={tooltipId}>{children}</span>;
  return (
    <span className={['forma-tooltip', className].filter(Boolean).join(' ')} {...props}>
      {trigger}
      <span className="forma-tooltip__bubble" id={tooltipId} role="tooltip">{content}</span>
    </span>
  );
}

export interface TableColumn {
  key: string;
  label: string;
  align?: 'start' | 'end';
}

export interface TableRow {
  id?: string;
  [key: string]: ReactNode | undefined;
}

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  caption: string;
  columns: TableColumn[];
  rows: TableRow[];
}

export function Table({ caption, columns, rows, className = '', ...props }: TableProps) {
  return (
    <div className={['forma-table-wrap', className].filter(Boolean).join(' ')} role="region" aria-label={caption} tabIndex={0} {...props}>
      <table className="forma-table">
        <caption>{caption}</caption>
        <thead><tr>{columns.map((column) => <th key={column.key} scope="col" className={column.align === 'end' ? 'is-end' : ''}>{column.label}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={row.id ?? index}>{columns.map((column) => <td key={column.key} className={column.align === 'end' ? 'is-end' : ''}>{row[column.key]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
