const Checkbox = ({
  id,
  checked = false,
  label,
  onChange
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label
      htmlFor={id}
      className="relative flex items-center gap-3 cursor-default"
    >
      <input
        id={id}
        checked={checked}
        className="opacity-0 peer absolute"
        type="checkbox"
        onChange={handleChange}
      />
      <span
        className="
          inline-flex
          h-6 w-6
          border border-brand-base-30
          rounded-md
          bg-white
          peer-focus-visible:outline
          peer-focus-visible:outline-2
          peer-focus-visible:outline-brand-base-40
          after:absolute
          after:hidden
          after:left-[9px]
          after:top-[4px]
          after:w-[6px]
          after:h-[12px]
          after:border-r-[2px]
          after:border-b-[2px]
          after:rotate-45
          after:border-brand-primary-90
          peer-checked:after:block
          peer-checked:bg-brand-primary-50
          peer-checked:border-brand-primary-50
        "
      />
      {label && <p className="inline-flex text-sm">{label}</p>}
    </label>
  );
};

export default Checkbox;

