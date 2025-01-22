import { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="p-2 border border-gray-300 rounded-lg outline-none shadow-none text-sm cursor-pointer bg-white flex items-center text-gray-800 no-underline gap-0.5"
      {...props}
    >
      {children}
    </button>
  );
};
