'use client';

import { ColumnDef } from '@tanstack/react-table';

// import { PlainMessage, Timestamp } from '@bufbuild/protobuf';
// import { GetJobRunLogsStreamResponse } from '@neosync/sdk';

import { GetJobRunLogsStreamResponse } from '@/lib/hooks/useGetJobRunLogs';
import { DataTableColumnHeader } from './data-table-column-header';

interface GetColumnsProps {}

export function getColumns(
  props: GetColumnsProps
): ColumnDef<GetJobRunLogsStreamResponse>[] {
  const {} = props;
  return [
    {
      accessorKey: 'timestamp',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Timestamp" />
      ),
      size: 210,
      cell: ({ getValue, cell }) => {
        const date = getValue<string>() ?? '-'
        return (
          <div
            className="flex space-x-2"
            style={{ maxWidth: cell.column.getSize() }}
          >
            <p className="font-medium">{date}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'logLine',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Log" />
      ),
      cell: ({ getValue }) => {
        return (
          <div className="flex space-x-2">
            <p className="font-medium text-wrap truncate">
              {getValue<string>()}
            </p>
          </div>
        );
      },
    },
  ];
}
