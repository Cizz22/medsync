/* eslint-disable no-case-declarations */
'use client';
import { ReactElement } from 'react';

import { ConnectionResponse } from '@/lib/hooks/useGetConnection';

import SwitchCard from '@/components/switches/SwitchCard';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

interface SourceOptionsProps {
  connection?: ConnectionResponse;
  maxColNum?: number;
}
export default function SourceOptionsForm(
  props: SourceOptionsProps
): ReactElement {
  const { connection, maxColNum } = props;
  const grid = maxColNum ? `lg:grid-cols-${maxColNum}` : 'lg:grid-cols-3';

  if (!connection) {
    return <></>;
  }
  switch (Object.keys(connection?.connectionConfig)[0]) {
    case 'pgConfig':
      const value =  Object.keys(connection.connectionConfig)[0];
      return (
        <div className={`grid grid-cols-1 md:grid-cols-1 ${grid} gap-4`}>
          <div>
            <FormField
              name="sourceOptions.haltOnNewColumnAddition"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SwitchCard
                      isChecked={field.value || false}
                      onCheckedChange={field.onChange}
                      title="Halt Job on new column addition"
                      description="Stops job runs if new column is detected"
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
      const mysqlValue = Object.keys(connection.connectionConfig)[0];
          return (
            <div className={`grid grid-cols-1 md:grid-cols-1 ${grid} gap-4`}>
              <div>
                <FormField
                  name="sourceOptions.haltOnNewColumnAddition"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SwitchCard
                          isChecked={field.value || false}
                          onCheckedChange={field.onChange}
                          title="Halt Job on new column addition"
                          description="Stops job runs if new column is detected"
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
    case 'awsS3Config':
      return <></>;
    default:
      return (
        <div>
          No connection component found for: (
          {connection?.name ?? 'unknown name'})
        </div>
      );
  }
}
