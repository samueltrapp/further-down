import { ReactNode } from "react";

type ContainerType = "reward" | "game" | "prep";

export function Container({
  type,
  children,
}: {
  type: ContainerType;
  children: ReactNode;
}) {
  return <div className={`container ${type}-container`}>{children}</div>;
}
