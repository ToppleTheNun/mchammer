import { nanoid } from "nanoid";
import {
  type DodgeParryMissStreak,
  columns,
} from "~/components/streaks/columns.tsx";
import { DataTable } from "~/components/ui/data-table.tsx";

const generateStreak = () => {
  const characters = "DPM";
  const length = Math.ceil(Math.random() * 10);
  return Array.from({ length })
    .fill("")
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join("");
};

const generateDodgeParryMissStreak = (): DodgeParryMissStreak => {
  const streak = generateStreak();
  const dodge = (streak.match(/D/g) || []).length;
  const parry = (streak.match(/P/g) || []).length;
  const miss = (streak.match(/M/g) || []).length;
  return {
    id: nanoid(),
    region: "us",
    realm: "Area 52",
    character: "Toppledh",
    dodge,
    parry,
    miss,
    streak,
  };
};

const data: DodgeParryMissStreak[] = [
  generateDodgeParryMissStreak(),
  generateDodgeParryMissStreak(),
  generateDodgeParryMissStreak(),
];

export function StreaksDataTable() {
  return (
    <div className="rounded-md border">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
