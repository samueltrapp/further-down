import { MouseEventHandler, ReactNode } from "react";
import "./Button.css";

type ButtonProps = {
  variant?: "seamless" | "outline" | "select" | "confirm";
  size?: "small" | "medium" | "large";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  value?: string;
  className?: string;
  children: ReactNode;
};

function Button({
  variant = "seamless",
  size = "medium",
  onClick,
  disabled,
  value,
  className,
  children,
}: ButtonProps) {
  const classes = ((className || "") + ` ${variant}-btn ${size}-btn`).trim();

  return (
    <button
      className={classes}
      value={value}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
