// import { Connection, IsJobNameAvailableResponse } from '@neosync/sdk';
import cron from 'cron-validate';
import * as Yup from 'yup';

import { ConnectionResponse } from '@/lib/hooks/useGetConnection';

import { RESOURCE_NAME_REGEX } from '@/yup-validations/connections';
import {
  DESTINATION_FORM_SCHEMA,
  JOB_MAPPING_SCHEMA,
  SCHEMA_FORM_SCHEMA,
  SOURCE_FORM_SCHEMA,
} from '@/yup-validations/jobs';

// Schema for a job's workflow settings
export const WorkflowSettingsSchema = Yup.object({
  runTimeout: Yup.number().optional().min(0),
});

export type WorkflowSettingsSchema = Yup.InferType<
  typeof WorkflowSettingsSchema
>;

export const ActivityOptionsSchema = Yup.object({
  scheduleToCloseTimeout: Yup.number()
    .optional()
    .min(0)
    .test(
      'non-zero-both',
      'Both timeouts cannot be 0',
      function (value, context) {
        // Checking the other field's value from the context
        const startToCloseTimeout = context.parent.startToCloseTimeout;
        return !(value === 0 && startToCloseTimeout === 0);
      }
    ),
  startToCloseTimeout: Yup.number()
    .optional()
    .min(0)
    .test(
      'non-zero-both',
      'Both timeouts cannot be 0',
      function (value, context) {
        // Checking the other field's value from the context
        const scheduleToCloseTimeout = context.parent.scheduleToCloseTimeout;
        return !(value === 0 && scheduleToCloseTimeout === 0);
      }
    ),
  retryPolicy: Yup.object({
    maximumAttempts: Yup.number().optional().min(0),
  }).optional(),
});

export type ActivityOptionsSchema = Yup.InferType<typeof ActivityOptionsSchema>;

export const DEFINE_FORM_SCHEMA = Yup.object({
  jobName: Yup.string()
    .trim()
    .required('Name is a required field')
    .min(3)
    .max(30)
    .test(
      'checkNameUnique',
      'This name is already taken.',
      async (value, context) => {
        if (!value || value.length < 3) {
          return false;
        }
        if (!RESOURCE_NAME_REGEX.test(value)) {
          return context.createError({
            message:
              'Job Name can only include lowercase letters, numbers, and hyphens',
          });
        }
        const accountId = context.options.context?.accountId;
        const accessToken = context.options.context?.token;
        if (!accountId) {
          return false;
        }
        const res = await isJobNameAvailable(value, accountId, accessToken);
        return res;
      }
    ),
  cronSchedule: Yup.string()
    .optional()
    .test('validateCron', 'Not a valid cron schedule', (value, context) => {
      if (!value) {
        return true;
      }
      const output = cron(value);
      if (output.isValid()) {
        return true;
      }
      if (output.isError()) {
        const errors = output.getError();
        if (errors.length > 0) {
          return context.createError({ message: errors.join(', ') });
        }
      }
      return output.isValid();
    }),
  initiateJobRun: Yup.boolean(),
  workflowSettings: WorkflowSettingsSchema.optional(),
  syncActivityOptions: ActivityOptionsSchema.optional(),
});

export type DefineFormValues = Yup.InferType<typeof DEFINE_FORM_SCHEMA>;

export const CONNECT_FORM_SCHEMA = SOURCE_FORM_SCHEMA.concat(
  Yup.object({
    destinations: Yup.array(DESTINATION_FORM_SCHEMA).required(),
  })
).test(
  'unique-connections',
  'connections must be unique and type specific', // this message isn't exposed anywhere
  function (value: any, ctx: any) {
    const connections: ConnectionResponse[] = ctx.options.context?.connections ?? [];

    const destinationIds = value.destinations.map((dst: any) => dst.connectionId);

    const errors: Yup.ValidationError[] = [];

    if (destinationIds.some((destId: any) => value.sourceId === destId)) {
      errors.push(
        ctx.createError({
          path: 'sourceId',
          message: 'Source must be different from destination',
        })
      );
    }

    if (
      destinationIds.some(
        (destId) => !isValidConnectionPair(value.sourceId, destId, connections)
      )
    ) {
      destinationIds.forEach((destId, idx) => {
        if (!isValidConnectionPair(value.sourceId, destId, connections)) {
          errors.push(
            ctx.createError({
              path: `destinations.${idx}.connectionId`,
              message: `Unfortunately, the current Medsync system still can't fully handle migration between two different database types :(`,
            })
          );
        }
      });
    }

    if (destinationIds.length !== new Set(destinationIds).size) {
      const valueIdxMap = new Map<string, number[]>();
      destinationIds.forEach((dstId, idx) => {
        const idxs = valueIdxMap.get(dstId);
        if (idxs !== undefined) {
          idxs.push(idx);
        } else {
          valueIdxMap.set(dstId, [idx]);
        }
      });

      Array.from(valueIdxMap.values()).forEach((indices) => {
        if (indices.length > 1) {
          indices.forEach((idx) =>
            errors.push(
              ctx.createError({
                path: `destinations.${idx}.connectionId`,
                message:
                  'Destination connections must be unique from one another',
              })
            )
          );
        }
      });
    }

    if (errors.length > 0) {
      return new Yup.ValidationError(errors);
    }
    return true;
  }
);

export type ConnectFormValues = Yup.InferType<typeof CONNECT_FORM_SCHEMA>;

function isValidConnectionPair(
  connId1: string,
  connId2: string,
  connections: ConnectionResponse[]
): boolean {
  const conn1 = connections.find((c) => c.id === connId1);
  const conn2 = connections.find((c) => c.id === connId2);

  if (!conn1 || !conn2) {
    return true;
  }
  if (
    Object.keys(conn1.connectionConfig)[0] === 'awsS3Config' ||
    Object.keys(conn2.connectionConfig)[0] === 'awsS3Config'
  ) {
    return true;
  }

  if (
    Object.keys(conn1.connectionConfig)[0] === Object.keys(conn2.connectionConfig)[0]
  ) {
    return true;
  }

  return false;
}

function getErrorConnectionTypes(
  isSource: boolean,
  connId: string,
  connections: ConnectionResponse[]
): string {
  const conn = connections.find((c) => c.id === connId);
  if (!conn) {
    return isSource ? '[Postgres, Mysql]' : '[Postgres, Mysql, AWS S3]';
  }
  if (Object.keys(conn.connectionConfig)[0] === 'awsS3Config') {
    return '[Mysql, Postgres]';
  }
  if (Object.keys(conn.connectionConfig)[0] === 'mysqlConfig') {
    return isSource ? '[Postgres]' : '[Mysql, AWS S3]';
  }

  if (Object.keys(conn.connectionConfig)[0] === 'pgConfig') {
    return isSource ? '[Mysql]' : '[Postgres, AWS S3]';
  }
  return '';
}

const SINGLE_SUBSET_FORM_SCHEMA = Yup.object({
  schema: Yup.string().trim().required(),
  table: Yup.string().trim().required(),
  whereClause: Yup.string().trim().optional(),
});

export const SINGLE_TABLE_CONNECT_FORM_SCHEMA = Yup.object({}).concat(
  DESTINATION_FORM_SCHEMA
);
export type SingleTableConnectFormValues = Yup.InferType<
  typeof SINGLE_TABLE_CONNECT_FORM_SCHEMA
>;

export const SINGLE_TABLE_SCHEMA_FORM_SCHEMA = Yup.object({
  numRows: Yup.number().required().min(1),
  mappings: Yup.array().of(JOB_MAPPING_SCHEMA).required(),
});

export type SingleTableSchemaFormValues = Yup.InferType<
  typeof SINGLE_TABLE_SCHEMA_FORM_SCHEMA
>;

export const SUBSET_FORM_SCHEMA = Yup.object({
  subsets: Yup.array(SINGLE_SUBSET_FORM_SCHEMA).required(),
  subsetOptions: Yup.object({
    subsetByForeignKeyConstraints: Yup.boolean().default(true),
  }),
});

export type SubsetFormValues = Yup.InferType<typeof SUBSET_FORM_SCHEMA>;

const FORM_SCHEMA = Yup.object({
  define: DEFINE_FORM_SCHEMA,
  connect: CONNECT_FORM_SCHEMA,
  schema: SCHEMA_FORM_SCHEMA,
  subset: SUBSET_FORM_SCHEMA.optional(),
});

export type FormValues = Yup.InferType<typeof FORM_SCHEMA>;

async function isJobNameAvailable(
  name: string,
  accountId: string,
  accessToken: string
) {
  const res = await fetch(
    `/api/accounts/${accountId}/jobs/is-job-name-available?name=${name}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'token': accessToken,
      },
    }
  );
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return (await res.json());
}
