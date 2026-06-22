import { ChangeEvent, useState } from "react";
import { submitName } from "../../services/skill.ts";
import "./Rewards.css";
import Button from "../_core/Button.tsx";

const nameValidation = /[^A-za-z -]/;

export function NamePrompt({
  gameId,
  characterId,
}: {
  gameId: string;
  characterId: string;
}) {
  const [name, setName] = useState("Character");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    if (newName.length > 12 || nameValidation.test(newName)) {
      setName(newName);
    }
  };

  const handleSubmit = () => {
    submitName({ name: name, gameId, characterId });
  };

  return (
    <section className="df fdc ma name-container">
      <label htmlFor="name" className="mb4 fs3">
        Name
      </label>
      <input
        value={name}
        id="name"
        type="text"
        onChange={handleNameChange}
        className="name-input"
      />
      <Button
        variant="confirm"
        size="medium"
        disabled={name.length < 3}
        onClick={handleSubmit}
      >
        Confirm
      </Button>
    </section>
  );
}
