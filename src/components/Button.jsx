const Button = ({
  title = '',
  variant = 'primary',
  weight = 'regular',
  disabled = false,
  loading = false,
  id,
  padding = 'px-4',
  onClick,
  children
}) => {
  const primaryClass = [
    'bg-brand-primary-50',
    'text-brand-primary-90',
    'border',
    'border-brand-primary-50',
    'hover:bg-brand-primary-60',
    'hover:border-brand-primary-60',
    'hover:text-brand-primary-100',
    'focus:shadow-sm',
    'focus:shadow-brand-primary-30'
  ];

  const secondaryClass = [
    'bg-brand-primary-20',
    'text-brand-primary-90',
    'border',
    'border-brand-primary-20',
    'hover:bg-brand-primary-30',
    'hover:border-brand-primary-30',
    'hover:text-brand-primary-100',
    'focus:shadow-sm',
    'focus:shadow-brand-primary-30'
  ];

  const tertiaryClass = [
    'bg-white',
    'text-brand-base-80',
    'border',
    'border-white',
    'hover:bg-brand-base-20',
    'hover:border-brand-base-20',
    'hover:text-brand-base-90',
    'focus:shadow-sm',
    'focus:shadow-brand-base-30'
  ];

  const infoPrimaryClass = [
    'bg-brand-info-60',
    'text-white',
    'border',
    'border-brand-info-60',
    'hover:bg-brand-info-70',
    'hover:border-brand-info-70',
    'focus:shadow-sm',
    'focus:shadow-brand-info-30'
  ];

  const infoSecondaryClass = [
    'bg-brand-info-10',
    'text-brand-info-90',
    'hover:bg-brand-info-20',
    'focus:shadow-sm',
    'focus:shadow-brand-info-30'
  ];

  const infoTertiaryClass = [
    'bg-white',
    'text-brand-info-60',
    'border',
    'border-white',
    'hover:bg-brand-base-20',
    'hover:border-brand-base-20',
    'hover:text-brand-base-90',
    'focus:shadow-sm',
    'focus:shadow-brand-base-30'
  ];

  const neutralPrimaryClass = [
    'bg-brand-base-80',
    'text-white',
    'border',
    'border-brand-base-80',
    'hover:bg-brand-base-90',
    'hover:border-brand-base-90',
    'focus:shadow-sm',
    'focus:shadow-brand-info-30'
  ];

  const neutralTertiaryClass = [
    'bg-white',
    'text-brand-base-80',
    'border',
    'border-white',
    'hover:bg-brand-base-20',
    'hover:border-brand-base-20',
    'hover:text-brand-base-90',
    'focus:shadow-sm',
    'focus:shadow-brand-base-30'
  ];

  const ghostPrimaryClass = [
    'text-brand-base-80',
    'hover:bg-brand-base-20',
    'hover:text-brand-base-90',
    'focus:shadow-sm',
    'focus:shadow-brand-base-30'
  ];

  const customPrimaryClass = [
    'bg-custom-primary-background',
    'text-custom-primary-foreground',
    'border',
    'border-custom-primary-background',
    'hover:bg-background-interactive-primaryHovered',
    'hover:border-background-interactive-primaryHovered',
    'hover:text-foreground-interactive-primaryHovered',
    'focus:shadow-sm',
    'focus:shadow-custom-primary-background'
  ];

  const customSecondaryClass = [
    'bg-custom-secondary-background',
    'text-custom-secondary-foreground',
    'border',
    'border-custom-secondary-background',
    'hover:bg-background-interactive-secondaryHovered',
    'hover:border-background-interactive-secondaryHovered',
    'hover:text-foreground-interactive-secondaryHovered',
    'focus:shadow-sm',
    'focus:shadow-custom-secondary-background'
  ];

  const ghostPrimaryClassWithoutHover = [
    'text-brand-base-80'
  ];

  const errorPrimaryClass = [
    'bg-brand-error-60',
    'text-white',
    'border',
    'border-brand-error-60',
    'hover:bg-brand-error-70',
    'hover:border-brand-error-70',
    'focus:shadow-sm',
    'focus:shadow-brand-error-30'
  ];

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary': return primaryClass;
      case 'secondary': return secondaryClass;
      case 'tertiary': return tertiaryClass;
      case 'infoPrimary': return infoPrimaryClass;
      case 'infoSecondary': return infoSecondaryClass;
      case 'infoTertiary': return infoTertiaryClass;
      case 'neutralPrimary': return neutralPrimaryClass;
      case 'neutralTertiary': return neutralTertiaryClass;
      case 'ghostPrimaryClass': return ghostPrimaryClass;
      case 'ghostPrimaryClassWithoutHover': return ghostPrimaryClassWithoutHover;
      case 'customPrimary': return customPrimaryClass;
      case 'customSecondary': return customSecondaryClass;
      case 'errorPrimary': return errorPrimaryClass;
      default: return primaryClass;
    }
  };

  const buttonClasses = [
    'rounded-full',
    'inline-flex',
    'gap-2',
    'items-center',
    'justify-center',
    'h-10',
    'disabled:bg-background-interactive-disabled',
    'disabled:border-background-interactive-disabled',
    'disabled:text-foreground-interactive-disabled',
    padding,
    ...getVariantClasses()
  ].join(' ');

  return (
    <button
      id={id}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {loading && (
        <svg
          aria-hidden="true"
          className="w-4 h-4 text-gray-20 animate-spin fill-brand-primary-80"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      )}
      {children || (
        <span className={`text-sm ${weight} ${disabled ? 'text-brand-base-50' : ''}`}>
          {title}
        </span>
      )}
    </button>
  );
};

export default Button;

