'use client';

import { CheckCircledIcon, CircleBackslashIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from './data-table-column-header';
import { ConnectionRolePrivilege } from '@/lib/hooks/useGetConnection';

export function getPermissionColumns(): ColumnDef<ConnectionRolePrivilege>[] {
  return [
    {
      accessorKey: 'Role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => <div>{row.original.grantee}</div>,
    },

    {
      accessorKey: 'schema',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Schema" />
      ),
      cell: ({ row }) => <div>{row.original.schema}</div>,
    },
    {
      accessorKey: 'table',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Table" />
      ),
      cell: ({ row }) => <div>{row.original.table}</div>,
    },
    {
      accessorKey: 'read',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Read" />
      ),
      cell: ({ row }) => {
        const hasRead = row.original.privilegeType.includes('SELECT');
        return (
          <div>
            {hasRead ? (
              <CheckCircledIcon className="text-green-500" />
            ) : (
              <CircleBackslashIcon className="text-red-500" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'write',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Write" />
      ),
      cell: ({ row }) => {
        const hasWrite = ['INSERT', 'UPDATE'].every((privilege) =>
          row.original.privilegeType.includes(privilege)
        );
        return (
          <div>
            {hasWrite ? (
              <CheckCircledIcon className="text-green-500" />
            ) : (
              <CircleBackslashIcon className="text-red-500" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'truncate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Truncate" />
      ),
      cell: ({ row }) => {
        const hasTruncate = row.original.privilegeType.includes('TRUNCATE');
        return (
          <div>
            {hasTruncate ? (
              <CheckCircledIcon className="text-green-500" />
            ) : (
              <CircleBackslashIcon className="text-red-500" />
            )}
          </div>
        );
      },
    },
  ];
}
