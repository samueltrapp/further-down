import { useState } from "react";
import { PlayerType } from "../../../types/individual/characters.ts";
import { WeaponName } from "../../../types/equipables/weapons.ts";
import { ArmorName } from "../../../types/equipables/armors.ts";
import { EnchantmentName } from "../../../types/equipables/enchantments.ts";
import { weaponMap } from "../../../shared/definitions/weapons/sets.ts";
import { armorMap } from "../../../shared/definitions/armors/sets.ts";
import { enchantmentMap } from "../../../shared/definitions/enchantments/sets.ts";
import { cdcl, toCaps } from "../../utils/formatting.ts";
import { useGame } from "../../hooks/useGame.ts";
import { submitPrepare } from "../../services/skill.ts";
import "./Preparation.css";

type PrepStep = "weapon-sockets" | "armor-sockets" | "equip";
type SocketMap = Partial<Record<string, EnchantmentName[]>>;

function SocketStep({
  title,
  enchantmentType,
  itemNames,
  enchantments,
  sockets,
  onSocketsChange,
  onNext,
}: {
  title: string;
  enchantmentType: "weapon" | "armor";
  itemNames: string[];
  enchantments: EnchantmentName[];
  sockets: SocketMap;
  onSocketsChange: (next: SocketMap) => void;
  onNext: () => void;
}) {
  const [activeEnchantment, setActiveEnchantment] =
    useState<EnchantmentName | null>(null);

  const filtered = enchantments.filter(
    (name) => enchantmentMap.get(name)?.socketType === enchantmentType,
  );
  const unique = [...new Set(filtered)];

  const totalCount = (name: EnchantmentName) =>
    filtered.filter((e) => e === name).length;
  const placedCount = (name: EnchantmentName) =>
    Object.values(sockets)
      .flat()
      .filter((e) => e === name).length;
  const isAvailable = (name: EnchantmentName) =>
    placedCount(name) < totalCount(name);

  const getSocketSize = (itemName: string) => {
    if (enchantmentType === "weapon")
      return weaponMap.get(itemName as WeaponName)?.socketSize ?? 0;
    return armorMap.get(itemName as ArmorName)?.socketSize ?? 0;
  };

  const handleSlotClick = (itemName: string, slotIndex: number) => {
    const itemSockets = sockets[itemName] ?? [];
    if (slotIndex < itemSockets.length) {
      onSocketsChange({
        ...sockets,
        [itemName]: itemSockets.filter((_, i) => i !== slotIndex),
      });
    } else if (activeEnchantment && isAvailable(activeEnchantment)) {
      if (itemSockets.length < getSocketSize(itemName)) {
        onSocketsChange({
          ...sockets,
          [itemName]: [...itemSockets, activeEnchantment],
        });
        setActiveEnchantment(null);
      }
    }
  };

  return (
    <section className="prep-section">
      <h2>{title}</h2>
      <div className="enchantment-palette">
        {unique.length === 0 && <p>No enchantments available for this step.</p>}
        {unique.map((name) => {
          const def = enchantmentMap.get(name);
          const available = isAvailable(name);
          return (
            <button
              key={name}
              className={`enchantment-btn${activeEnchantment === name ? " active" : ""}`}
              disabled={!available}
              onClick={() =>
                setActiveEnchantment((prev) => (prev === name ? null : name))
              }
            >
              <div>{toCaps(name)}</div>
              {def && <div className="enchantment-desc">{def.description}</div>}
            </button>
          );
        })}
      </div>
      <div className="items-container">
        {itemNames.map((itemName) => {
          const itemSockets = sockets[itemName] ?? [];
          const socketSize = getSocketSize(itemName);
          return (
            <div key={itemName} className="item-card">
              <span className="item-name">{toCaps(itemName)}</span>
              <div className="socket-row">
                {socketSize === 0 && (
                  <span className="no-sockets">No sockets</span>
                )}
                {Array.from({ length: socketSize }).map((_, index) => {
                  const filled = index < itemSockets.length;
                  return (
                    <button
                      key={index}
                      className={`socket-slot${filled ? " filled" : ""}`}
                      onClick={() => handleSlotClick(itemName, index)}
                    >
                      {filled ? toCaps(itemSockets[index]) : "<Empty>"}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <button className="prep-next-btn" onClick={onNext}>
        Next
      </button>
    </section>
  );
}

function EquipStep({
  character,
  weaponSockets,
  armorSockets,
  gameId,
}: {
  character: PlayerType;
  weaponSockets: SocketMap;
  armorSockets: SocketMap;
  gameId: string;
}) {
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponName | null>(null);
  const [selectedArmor, setSelectedArmor] = useState<ArmorName | null>(null);

  const handleConfirm = () => {
    if (selectedWeapon && selectedArmor) {
      submitPrepare({
        gameId,
        characterId: character.id,
        weaponSockets: weaponSockets as Partial<
          Record<WeaponName, EnchantmentName[]>
        >,
        armorSockets: armorSockets as Partial<
          Record<ArmorName, EnchantmentName[]>
        >,
        weapon: selectedWeapon,
        armor: selectedArmor,
      });
    }
  };

  return (
    <section className="prep-section">
      <h2>{toCaps(character.name)}: Select Starting Equipment</h2>
      <div className="equip-columns">
        <div>
          <h3>Weapon</h3>
          <div className="equip-options">
            {character.loadout.weapons.map((weaponName) => {
              const def = weaponMap.get(weaponName);
              const socketed = weaponSockets[weaponName] ?? [];
              return (
                <button
                  key={weaponName}
                  className={cdcl("equip-card", {
                    selected: selectedWeapon === weaponName,
                  })}
                  onClick={() => setSelectedWeapon(weaponName)}
                >
                  <div>{toCaps(def?.name ?? weaponName)}</div>
                  {socketed.length > 0 && (
                    <div className="socketed-list">
                      {socketed.map(toCaps).join(", ")}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <h3>Armor</h3>
          <div className="equip-options">
            {character.loadout.armors.map((armorName) => {
              const def = armorMap.get(armorName);
              const socketed = armorSockets[armorName] ?? [];
              return (
                <button
                  key={armorName}
                  className={cdcl("equip-card", {
                    selected: selectedArmor === armorName,
                  })}
                  onClick={() => setSelectedArmor(armorName)}
                >
                  <div>{toCaps(def?.name ?? armorName)}</div>
                  {socketed.length > 0 && (
                    <div className="socketed-list">
                      {socketed.map(toCaps).join(", ")}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <button
        className="prep-confirm-btn"
        disabled={!selectedWeapon || !selectedArmor}
        onClick={handleConfirm}
      >
        Confirm
      </button>
    </section>
  );
}

/* Manages all three steps for a single character; keyed by character ID so
   state resets automatically when the active character advances. */
function CharacterPrep({
  character,
  gameId,
}: {
  character: PlayerType;
  gameId: string;
}) {
  /* Derive initial socket assignments from any existing bindings on the character. */
  const [weaponSockets, setWeaponSockets] = useState<SocketMap>(() =>
    character.loadout.enchantments.reduce((acc, binding) => {
      if (
        binding.socket !== null &&
        (character.loadout.weapons as string[]).includes(binding.socket)
      ) {
        const key = binding.socket as string;
        acc[key] = [...(acc[key] ?? []), binding.name];
      }
      return acc;
    }, {} as SocketMap),
  );

  const [armorSockets, setArmorSockets] = useState<SocketMap>(() =>
    character.loadout.enchantments.reduce((acc, binding) => {
      if (
        binding.socket !== null &&
        (character.loadout.armors as string[]).includes(binding.socket)
      ) {
        const key = binding.socket as string;
        acc[key] = [...(acc[key] ?? []), binding.name];
      }
      return acc;
    }, {} as SocketMap),
  );

  const [step, setStep] = useState<PrepStep>("weapon-sockets");

  const enchantmentNames = character.loadout.enchantments.map(
    (binding) => binding.name,
  );

  if (step === "weapon-sockets") {
    return (
      <SocketStep
        title={`${toCaps(character.name)}: Socket Weapons`}
        enchantmentType="weapon"
        itemNames={character.loadout.weapons}
        enchantments={enchantmentNames}
        sockets={weaponSockets}
        onSocketsChange={setWeaponSockets}
        onNext={() => setStep("armor-sockets")}
      />
    );
  }

  if (step === "armor-sockets") {
    return (
      <SocketStep
        title={`${toCaps(character.name)}: Socket Armor`}
        enchantmentType="armor"
        itemNames={character.loadout.armors}
        enchantments={enchantmentNames}
        sockets={armorSockets}
        onSocketsChange={setArmorSockets}
        onNext={() => setStep("equip")}
      />
    );
  }

  return (
    <EquipStep
      character={character}
      weaponSockets={weaponSockets}
      armorSockets={armorSockets}
      gameId={gameId}
    />
  );
}

export function Preparation() {
  const { game } = useGame();
  const userId = localStorage.getItem("userId");

  const gameId = game?.data.lobby.gameId;

  /* First character belonging to this user that still needs prep. */
  const activeCharacter = game?.data.characters
    ? (Object.values(game.data.characters).find(
        (char) =>
          char.team === "player" &&
          (char as PlayerType).userId === userId &&
          (char as PlayerType).pending.prepare > 0,
      ) as PlayerType | undefined)
    : undefined;

  if (!game?.data.characters || !gameId) return null;

  if (!activeCharacter) return <div>Waiting for other players.</div>;

  return (
    <CharacterPrep
      key={activeCharacter.id}
      character={activeCharacter}
      gameId={gameId}
    />
  );
}
