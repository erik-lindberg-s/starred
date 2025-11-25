import { forwardRef, useImperativeHandle, useRef } from 'react';

const InputText = forwardRef(({
  id,
  invalid = false,
  value,
  preCssIcon,
  postCssIcon,
  autocompleteToggle = false,
  onChange,
  onPreIconClick,
  onPostIconClick,
  preIcon,
  postIcon,
  ...rest
}, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  const handleInput = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const hasPreIcon = preCssIcon || preIcon;
  const hasPostIcon = postCssIcon || postIcon;

  return (
    <div className="flex items-center">
      {hasPreIcon && (
        <div className="relative flex items-center">
          <label
            htmlFor={id}
            className="absolute inline-flex left-3"
            onClick={onPreIconClick}
          >
            {preIcon || <i className={`w-5 h-5 ${preCssIcon}`} />}
          </label>
        </div>
      )}
      <input
        id={id}
        ref={inputRef}
        autoComplete={autocompleteToggle ? 'on' : 'off'}
        value={value}
        className={`
          grow
          peer
          border
          border-brand-base-30
          rounded-lg
          p-2.5 pl-4
          leading-3
          w-full
          text-sm
          text-brand-base-80
          placeholder-shown:text-ellipsis
          placeholder:text-brand-base-60
          read-only:bg-brand-base-20
          read-only:border-none
          focus-visible:read-only:outline-none
          focus-visible:outline-brand-base-30
          ${invalid ? 'border-brand-error-60' : ''}
          ${hasPreIcon ? 'pl-12' : ''}
          ${hasPostIcon ? 'pr-10' : ''}
        `}
        {...rest}
        onChange={handleInput}
      />
      {hasPostIcon && (
        <div className="relative flex items-center">
          <label
            htmlFor={id}
            className="absolute inline-flex right-3"
            onClick={onPostIconClick}
          >
            {postIcon || <i className={`w-5 h-5 ${postCssIcon}`} />}
          </label>
        </div>
      )}
    </div>
  );
});

InputText.displayName = 'InputText';

export default InputText;

