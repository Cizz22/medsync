/* eslint-disable no-case-declarations */
/* eslint-disable unused-imports/no-unused-vars */
'use client';
import { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { ConnectionResponse } from '@/lib/hooks/useGetConnection';

import SwitchCard from '@/components/switches/SwitchCard';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

interface DestinationOptionsProps {
  connection?: ConnectionResponse;
  index?: number;
  maxColNum?: number;
}
export default function DestinationOptionsForm(
  props: DestinationOptionsProps
) {
  const { connection, maxColNum, index } = props;
  const grid = maxColNum ? `lg:grid-cols-${maxColNum}` : 'lg:grid-cols-3';
  const formCtx = useFormContext();

  if (!connection) {
    return <></>;
  }

  switch (Object.keys(connection?.connectionConfig)[0]) {
    case 'pgConfig':
      // const value = connection.connectionConfig.config.value;
      const truncateBeforeInsertName =
        index != null
          ? `destinations.${index}.destinationOptions.truncateBeforeInsert`
          : `destinationOptions.truncateBeforeInsert`;
      const truncateCascadeName =
        index != null
          ? `destinations.${index}.destinationOptions.truncateCascade`
          : `destinationOptions.truncateCascade`;

      return (
        <div className={`grid grid-cols-1 md:grid-cols-1 ${grid} gap-4`}>
          <div>
            <FormField
              name={truncateBeforeInsertName}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SwitchCard
                      isChecked={field.value || false}
                      onCheckedChange={(newVal) => {
                        field.onChange(newVal);
                        if (!newVal) {
                          formCtx.setValue(truncateCascadeName, false);
                        }
                      }}
                      title="Truncate Before Insert"
                      description="Truncates table before inserting data"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name={truncateCascadeName}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SwitchCard
                      isChecked={field.value || false}
                      onCheckedChange={(newVal) => {
                        field.onChange(newVal);
                        if (newVal) {
                          formCtx.setValue(truncateBeforeInsertName, true);
                        }
                      }}
                      title="Truncate Cascade"
                      description="TRUNCATE CASCADE to all tables"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name={
                index != null
                  ? `destinations.${index}.destinationOptions.initTableSchema`
                  : `destinationOptions.initTableSchema`
              }
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SwitchCard
                      isChecked={field.value || false}
                      onCheckedChange={field.onChange}
                      title="Init Table Schema"
                      description="Creates table(s) schema and its constraints. The database schema must exist. "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name={
                index != null
                  ? `destinations.${index}.destinationOptions.onConflictDoNothing`
                  : `destinationOptions.onConflictDoNothing`
              }
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SwitchCard
                      isChecked={field.value || false}
                      onCheckedChange={field.onChange}
                      title="On Conflict Do Nothing"
                      description="If there is a conflict when inserting data do not insert"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );
    case 'mysqlConfig':
      // const mysqlValue = connection.connectionConfig.config.value;
      const mysqltruncateBeforeInsertName =
        index != null
          ? `destinations.${index}.destinationOptions.truncateBeforeInsert`
          : `destinationOptions.truncateBeforeInsert`;
          return (
            <div className={`grid grid-cols-1 md:grid-cols-1 ${grid} gap-4`}>
              <div>
                <FormField
                  name={mysqltruncateBeforeInsertName}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SwitchCard
                          isChecked={field.value || false}
                          onCheckedChange={(newVal) => {
                            field.onChange(newVal);
                          }}
                          title="Truncate Before Insert"
                          description="Truncates table before inserting data"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name={
                    index != null
                      ? `destinations.${index}.destinationOptions.initTableSchema`
                      : `destinationOptions.initTableSchema`
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SwitchCard
                          isChecked={field.value || false}
                          onCheckedChange={field.onChange}
                          title="Init Table Schema"
                          description="Creates table(s) schema and its constraints. The database schema must exist. "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name={
                    index != null
                      ? `destinations.${index}.destinationOptions.onConflictDoNothing`
                      : `destinationOptions.onConflictDoNothing`
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SwitchCard
                          isChecked={field.value || false}
                          onCheckedChange={field.onChange}
                          title="On Conflict Do Nothing"
                          description="If there is a conflict when inserting data do not insert"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          );
      
      return <></>;
  }
}
