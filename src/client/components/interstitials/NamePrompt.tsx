import { ChangeEvent, useState } from "react";
import { submitName } from "../../services/skill.ts";

const nameValidation = /[^A-za-z -]/;

export function NamePrompt({
  gameId,
  characterId,
}: {
  gameId: string;
  characterId: string;
}) {
  const [name, setName] = useState("Gopher");

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
    <div>
      <label htmlFor="name">Name</label>
      <input value={name} id="name" type="text" onChange={handleNameChange} />
      <button disabled={name.length < 3} onClick={handleSubmit}>
        Confirm
      </button>
    </div>
  );
}
