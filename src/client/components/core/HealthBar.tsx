import styled from "styled-components";

export const HealthBar = styled.div<{ $percentHealth: number }>`
  height: 10px;
  width: 100%;
  background: ${(props) => {
    if (props.$percentHealth > 66) {
      return `linear-gradient(to right, rgb(43, 194, 83) ${props.$percentHealth}%, var(--black) ${props.$percentHealth}% ${100 - props.$percentHealth}%);`;
    } else if (props.$percentHealth > 33) {
      return `linear-gradient(to right #f1a165 ${props.$percentHealth}%, var(--black) ${props.$percentHealth}% ${100 - props.$percentHealth}%);`;
    } else {
      return `linear-gradient(to right #f0a3a3 ${props.$percentHealth}%, var(--black) ${props.$percentHealth}% ${100 - props.$percentHealth}%);`;
    }
  }};
`;
