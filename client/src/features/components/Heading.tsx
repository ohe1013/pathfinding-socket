import { FC, HTMLAttributes, ReactNode } from "react";

interface HeadingProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const Heading: FC<HeadingProps> = ({ children, ...props }) => {
  return (
    <p
      className="font-serif text-2xl my-2.5 text-pink-400 whitespace-pre-line font-semibold"
      {...props}
    >
      {children}
    </p>
  );
};
