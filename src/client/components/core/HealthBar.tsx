import styled from "styled-components";

const green = "#194c15";
const orange = "#803c0b";
const red = "#430000";

export const HealthBar = styled.div<{ $percentHealth: number }>`
  height: 1rem;
  background: ${(props) => {
    if (props.$percentHealth > 66) {
      return `linear-gradient(to right, ${green} ${props.$percentHealth}%, var(--black) ${props.$percentHealth}% ${100 - props.$percentHealth}%);`;
    } else if (props.$percentHealth > 33) {
      return `linear-gradient(to right, ${orange} ${props.$percentHealth}%, var(--black) ${props.$percentHealth}% ${100 - props.$percentHealth}%);`;
    } else {
      return `linear-gradient(to right, ${red} ${props.$percentHealth}%, var(--black) ${props.$percentHealth}% ${100 - props.$percentHealth}%);`;
    }
  }};
`;
