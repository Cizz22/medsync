'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useFormPersist from 'react-hook-form-persist';
import { useSessionStorage } from 'usehooks-ts';

import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';
import { useAccount } from '@/components/providers/account-provider';
import { PageProps } from '@/components/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import JobsProgressSteps, {
  DATA_GEN_STEPS,
  DATA_SYNC_STEPS,
} from '../JobsProgressSteps';
import { NewJobType } from '../page';
import { DEFINE_FORM_SCHEMA, DefineFormValues } from '../schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { DEFAULT_CRON_STRING } from '../../../jobs/[id]/components/ScheduleCard';

const isBrowser = () => typeof window !== 'undefined';
const DEFAULT_CRON_STRING = '0 0 * * *';

export default function Page({ searchParams }: PageProps): ReactElement {
  const router = useRouter();
  // const { account } = useAccount();
  const session = useSession();
  useEffect(() => {
    if (!searchParams?.sessionId) {
      router.push(`/dashboard/${session.data?.user?.neosync_account_id}/new/job`);
    }
  }, [searchParams?.sessionId]);

  const sessionPrefix = searchParams?.sessionId ?? '';
  const [defaultValues] = useSessionStorage<DefineFormValues>(
    `${sessionPrefix}-new-job-define`,
    {
      jobName: '',
      cronSchedule: '',
      initiateJobRun: false,
      workflowSettings: {},
      syncActivityOptions: {
        startToCloseTimeout: 10,
        retryPolicy: {
          maximumAttempts: 1,
        },
      },
    }
  );
  const [isScheduleEnabled, setIsScheduleEnabled] = useState<boolean>(false);

  const cronOptions = {
    minutes: ['Every', ...Array.from({ length: 60 }, (_, i) => i)],
    hours: ['Every', ...Array.from({ length: 24 }, (_, i) => i)],
    days: ['Every', ...Array.from({ length: 31 }, (_, i) => i + 1)],
    months: ['Every', ...Array.from({ length: 12 }, (_, i) => i + 1)],
    weekdays: ['Every', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  };

  const [cronComponents, setCronComponents] = useState({
    minute: '0',
    hour: '*',
    day: '*',
    month: '*',
    weekday: '*',
  });

  const handleCronChange = (component: any, value: any) => {
    setCronComponents((prev) => ({ ...prev, [component]: value }));
  };


  const form = useForm<DefineFormValues>({
    mode: 'onChange',
    resolver: yupResolver<DefineFormValues>(DEFINE_FORM_SCHEMA),
    defaultValues,
    context: {
      accountId: session.data?.user?.neosync_account_id,
      token: session.data?.user.accessToken,
    },
  });

  useFormPersist(`${sessionPrefix}-new-job-define`, {
    watch: form.watch,
    setValue: form.setValue,
    storage: isBrowser() ? window.sessionStorage : undefined,
  });


  const newJobType = getNewJobType(getSingleOrUndefined(searchParams?.jobType));

  async function onSubmit(_values: DefineFormValues) {
    if (!isScheduleEnabled) {
      form.setValue('cronSchedule', '');
    } else {
      const { minute, hour, day, month, weekday } = cronComponents;
      const cronString = `${minute} ${hour} ${day} ${month} ${weekday}`;
      form.setValue('cronSchedule', cronString);
    }
    if (newJobType === 'generate-table') {
      router.push(
        `/dashboard/${session.data?.user?.neosync_account_id}/new/job/generate/single/connect?sessionId=${sessionPrefix}`
      );
    } else {
      router.push(
        `/dashboard/${session.data?.user?.neosync_account_id}/new/job/connect?sessionId=${sessionPrefix}`
      );
    }
  }

  return (
    <div
      id="newjobdefine"
      className="px-12 md:px-24 lg:px-48 xl:px-64 flex flex-col gap-5"
    >
      <OverviewContainer
        Header={
          <PageHeader
            header="Define"
            progressSteps={
              <JobsProgressSteps
                steps={
                  newJobType === 'data-sync' ? DATA_SYNC_STEPS : DATA_GEN_STEPS
                }
                stepName={'define'}
              />
            }
          />
        }
        containerClassName="connect-page"
      >
        <div />
      </OverviewContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="jobName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormDescription>The unique name of the job.</FormDescription>
                <FormControl>
                  <Input placeholder="prod-to-stage" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cronSchedule"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center gap-2">
                  <FormLabel>Schedule</FormLabel>
                  <Switch
                    checked={isScheduleEnabled}
                    onCheckedChange={(isChecked) => {
                      setIsScheduleEnabled(isChecked);
                      if (!isChecked) {
                        form.resetField('cronSchedule', {
                          keepError: false,
                        });
                      }
                    }}
                  />
                </div>
                <FormDescription>
                  Define a cron schedule to run this job. If disabled, the job will be paused and a default cron will be set.
                </FormDescription>
                {isScheduleEnabled && (
                  <div className="flex flex-wrap gap-2">
                    <FormControl>
                      <Select onValueChange={(value) => handleCronChange('hour', value)}>
                        <SelectTrigger >
                          <SelectValue
                            placeholder="Hour"
                          />
                          {cronComponents.hour === '*' ? 'Every hour' : cronComponents.hour}
                        </SelectTrigger>
                        <SelectContent>
                          {cronOptions.hours.map((hour, index) => (
                            <SelectItem key={index} value={hour as string}>
                              {hour === '*' ? 'Every hour' : hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <Select onValueChange={(value) => handleCronChange('day', value)}>
                        <SelectTrigger >
                          <SelectValue
                            placeholder="Day"
                          />
                          {cronComponents.day === '*' ? 'Every day' : cronComponents.day}
                        </SelectTrigger>
                        <SelectContent>
                          {cronOptions.days.map((day, index) => (
                            <SelectItem key={index} value={day as string}>
                              {day === '*' ? 'Every day' : day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <Select onValueChange={(value) => handleCronChange('month', value)}>
                        <SelectTrigger >
                          <SelectValue
                            placeholder="Month"
                          />
                          {cronComponents.month === '*' ? 'Every month' : cronComponents.month}
                        </SelectTrigger>
                        <SelectContent>
                          {cronOptions.months.map((month, index) => (
                            <SelectItem key={index} value={month as string}>
                              {month === '*' ? 'Every month' : month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <Select onValueChange={(value) => handleCronChange('weekday', value)}>
                        <SelectTrigger >
                          <SelectValue
                            placeholder="Weekday"
                          />
                          {cronComponents.weekday === '*' ? 'Every day of the week' : cronOptions.weekdays[(cronComponents.weekday as unknown) as number]}
                        </SelectTrigger>
                        <SelectContent>
                          {cronOptions.weekdays.map((weekday, index) => (
                            <SelectItem key={index} value={index === 0 ? '*' : (index - 1 as unknown) as string}>
                              {weekday === '*' ? 'Every day of the week' : weekday}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <div>
            <FormField
              name="initiateJobRun"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initiate Job Run</FormLabel>
                  <FormDescription>
                    Initiates a single job run immediately after the job is
                    created.
                  </FormDescription>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      className="flex justify-start"
                      onValueChange={(value) =>
                        field.onChange(value === 'true')
                      }
                      value={field.value ? 'true' : 'false'}
                    >
                      <ToggleGroupItem value="false">No</ToggleGroupItem>
                      <ToggleGroupItem value="true">Yes</ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="settings">
              <AccordionTrigger className="-ml-2">
                <div className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg">
                  Advanced Settings
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Separator />
                <div className="flex flex-col gap-6 pt-6">
                  <FormField
                    control={form.control}
                    name="workflowSettings.runTimeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Job Run Timeout</FormLabel>
                        <FormDescription>
                          The maximum length of time (in minutes) that a single
                          job run is allowed to span before it times out.{' '}
                          <code>0</code> means no overall timeout.
                        </FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || 0}
                            onChange={(e) => {
                              field.onChange(e.target.valueAsNumber);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="syncActivityOptions.startToCloseTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Table Sync Timeout</FormLabel>
                          <FormDescription>
                            The maximum amount of time (in minutes) a single
                            table synchronization may run before it times out.
                            This may need tuning depending on your datasize, and
                            should be able to contain the table that contains
                            the largest amount of data. This timeout is applied
                            per retry.
                          </FormDescription>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || 0}
                              onChange={(e) => {
                                field.onChange(e.target.valueAsNumber);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="syncActivityOptions.scheduleToCloseTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Max Table Timeout including retries
                          </FormLabel>
                          <FormDescription>
                            The total time (in minutes) that a single table sync
                            is allowed to run,{' '}
                            <strong>
                              <u>including</u>
                            </strong>{' '}
                            retries. 0 means no timeout.
                          </FormDescription>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || 0}
                              onChange={(e) => {
                                field.onChange(e.target.valueAsNumber);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="syncActivityOptions.retryPolicy.maximumAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Retry Attempts</FormLabel>
                          <FormDescription>
                            When exceeded, the retries stop even if they're not
                            expired yet. If not set or set to 0, it means
                            unlimited retry attemps and we rely on the max table
                            timeout including retries to know when to stop.
                          </FormDescription>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || 0}
                              onChange={(e) => {
                                field.onChange(e.target.valueAsNumber);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex flex-row justify-between">
            <Button
              variant="outline"
              type="reset"
              onClick={() => router.push(`/dashboard/${session.data?.user?.neosync_account_id}/new/job`)}
            >
              Back
            </Button>
            <Button type="submit" disabled={!form.formState.isValid}>
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function getNewJobType(jobtype?: string): NewJobType {
  return jobtype === 'generate-table' ? 'generate-table' : 'data-sync';
}
function getSingleOrUndefined(
  item: string | string[] | undefined
): string | undefined {
  if (!item) {
    return undefined;
  }
  const newItem = Array.isArray(item) ? item[0] : item;
  return !newItem || newItem === 'undefined' ? undefined : newItem;
}
