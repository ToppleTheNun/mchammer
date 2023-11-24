import { columns } from "#app/components/streaks/columns.tsx";
import { data } from "#app/components/streaks/data.ts";
import { DataTable } from "#app/components/ui/data-table.tsx";

export const StreaksTable = () => <DataTable columns={columns} data={data} />;
