import { nanoid } from "nanoid";
import {
  type DodgeParryMissStreak,
  streaksNumberFourthFactory,
  streaksNumberLastFactory,
  streaksNumberNoSubFactory,
  streaksTextFourthFactory,
  streaksTextHoverCardFactory,
  streaksTextLastFactory,
  streaksTextNoSubFactory,
  streaksTextTooltipFactory,
} from "~/components/streaks/columns.tsx";
import { DataTable } from "~/components/ui/data-table.tsx";
import { H2 } from "~/components/typography.tsx";

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
    <div className="w-full space-y-6">
      <div className="w-full space-y-3">
        <H2>Streaks Last Text</H2>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextLastFactory("text-left")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextLastFactory("text-center")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextLastFactory("text-right")}
            data={data}
          />
        </div>
      </div>

      <div className="w-full space-y-3">
        <H2>Streaks Last Number</H2>
        <div className="rounded-md border">
          <DataTable
            columns={streaksNumberLastFactory("text-left")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksNumberLastFactory("text-center")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksNumberLastFactory("text-right")}
            data={data}
          />
        </div>
      </div>

      <div className="w-full space-y-3">
        <H2>Streaks Fourth Text</H2>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextFourthFactory("text-left")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextFourthFactory("text-center")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextFourthFactory("text-right")}
            data={data}
          />
        </div>
      </div>

      <div className="w-full space-y-3">
        <H2>Streaks Fourth Number</H2>
        <div className="rounded-md border">
          <DataTable
            columns={streaksNumberFourthFactory("text-left")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksNumberFourthFactory("text-center")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksNumberFourthFactory("text-right")}
            data={data}
          />
        </div>
      </div>

      <div className="w-full space-y-3">
        <H2>Streaks No Subs Text</H2>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextNoSubFactory("text-left")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextNoSubFactory("text-center")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextNoSubFactory("text-right")}
            data={data}
          />
        </div>
      </div>

      <div className="w-full space-y-3">
        <H2>Streaks No Subs Number</H2>
        <div className="rounded-md border">
          <DataTable
            columns={streaksNumberNoSubFactory("text-left")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksNumberNoSubFactory("text-center")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksNumberNoSubFactory("text-right")}
            data={data}
          />
        </div>
      </div>

      <div className="w-full space-y-3">
        <H2>Streaks Text Tooltip</H2>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextTooltipFactory("text-left", "justify-start")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextTooltipFactory("text-center", "justify-center")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextTooltipFactory("text-right", "justify-end")}
            data={data}
          />
        </div>
      </div>

      <div className="w-full space-y-3">
        <H2>Streaks Text Hovercard</H2>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextHoverCardFactory("text-left", "justify-start")}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextHoverCardFactory(
              "text-center",
              "justify-center",
            )}
            data={data}
          />
        </div>
        <div className="rounded-md border">
          <DataTable
            columns={streaksTextHoverCardFactory("text-right", "justify-end")}
            data={data}
          />
        </div>
      </div>
    </div>
  );
}
