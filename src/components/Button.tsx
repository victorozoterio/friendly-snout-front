export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  variant?: ButtonVariant;
}

const variantClasses = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
};

export function Button({ variant = 'primary' }: ButtonProps) {
  return (
    <button
      type='button'
      className={`w-[100px] h-10 rounded border-0 m-2 ${variantClasses[variant]} font-semibold text-white`}
    >
      Login
    </button>
  );
}
