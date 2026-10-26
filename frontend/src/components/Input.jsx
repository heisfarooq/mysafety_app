import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({ label, error, hint, type = 'text', multiline = false, id, className = '', ...rest }) {
  const autoId = useId();
  const inputId = id || autoId;
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  const common = {
    id: inputId,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    className: `field__control${error ? ' is-invalid' : ''}`,
    ...rest,
  };

  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={inputId} className="field__label">
        {label}
      </label>
      <div className="field__wrap">
        {multiline ? (
          <textarea rows={6} {...common} />
        ) : (
          <input type={isPassword && visible ? 'text' : type} {...common} />
        )}
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="field__error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="field__hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
