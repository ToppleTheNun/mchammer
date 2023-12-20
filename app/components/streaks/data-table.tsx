import {
  type DodgeParryMissStreak,
  columns,
} from "~/components/streaks/columns.tsx";
import { DataTable } from "~/components/ui/data-table.tsx";

export function StreaksDataTable({ data }: { data: DodgeParryMissStreak[] }) {
  return (
    <div className="rounded-md border">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
