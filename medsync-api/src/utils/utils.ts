import {
  ConnectionConfig,
  GetConnectionResponse,
  MysqlConnection,
  MysqlConnectionConfig,
  PostgresConnection,
  PostgresConnectionConfig,
  SupportedJobType,
  TransformerDataType,
  TransformerSource
} from '@neosync/sdk';
import { format } from 'date-fns';
import ApiError from './ApiError';
import httpStatus from 'http-status';

export function formatDateTime(
  dateStr?: string | Date | number,
  is24Hour = false
): string | undefined {
  if (!dateStr) {
    return undefined;
  }
  const hourFormat = is24Hour ? 'HH' : 'hh';
  const amPm = is24Hour ? '' : 'a';
  return format(new Date(dateStr), `MM/dd/yyyy ${hourFormat}:mm:ss ${amPm}`);
}

export function formatDateTimeMilliseconds(
  dateStr?: string | Date | number,
  is24Hour = false
): string | undefined {
  if (!dateStr) {
    return undefined;
  }
  const hourFormat = is24Hour ? 'HH' : 'hh';
  const amPm = is24Hour ? '' : 'a';

  return format(new Date(dateStr), `MM/dd/yyyy ${hourFormat}:mm:ss:SSS ${amPm}`);
}

export function getErrorMessage(error: unknown): string {
  return isErrorWithMessage(error) ? error.message : 'unknown error message';
}
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof error.message === 'string'
  );
}

export const toTitleCase = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
};

const NANOS_PER_SECOND = BigInt(1000000000);
const SECONDS_PER_MIN = BigInt(60);

// if the duration is too large to convert to minutes, it will return the max safe integer
export function convertNanosecondsToMinutes(duration: bigint): number {
  // Convert nanoseconds to minutes
  const minutesBigInt = duration / NANOS_PER_SECOND / SECONDS_PER_MIN;

  // Check if the result is within the safe range for JavaScript numbers
  if (minutesBigInt <= BigInt(Number.MAX_SAFE_INTEGER)) {
    return Number(minutesBigInt);
  } else {
    // Handle the case where the number of minutes is too large
    console.warn(
      'The number of minutes is too large for a safe JavaScript number. Returning as BigInt.'
    );
    return Number.MAX_SAFE_INTEGER;
  }
}

// Convert minutes to BigInt to ensure precision in multiplication
export function convertMinutesToNanoseconds(minutes: number): bigint {
  const minutesBigInt = BigInt(minutes);
  return minutesBigInt * SECONDS_PER_MIN * NANOS_PER_SECOND;
}

function getTransformerDataTypeString(dt: TransformerDataType): string {
  const value = TransformerDataType[dt];
  return value ? value.toLowerCase() : 'unspecified';
}

export function getTransformerDataTypesString(dts: TransformerDataType[]): string {
  return dts.map((dt) => getTransformerDataTypeString(dt)).join(' | ');
}

function getTransformerJobTypeString(dt: SupportedJobType): string {
  const value = SupportedJobType[dt];
  return value ? toTitleCase(value) : 'unspecified';
}

export function getTransformerJobTypesString(dts: SupportedJobType[]): string[] {
  return dts.map((dt) => getTransformerJobTypeString(dt));
}

export function getTransformerSourceString(ds: TransformerSource): string {
  const value = TransformerSource[ds];
  return value ? value.toLowerCase() : 'unspecified';
}

export function formatName(name: string): string {
  // Remove any characters that are not lowercase letters, numbers, or hyphens
  name = name.toLowerCase().replace(/[^a-z0-9-]/g, '');

  // Ensure the length is between 3 and 30 characters
  name = name.substring(0, 30);

  // Return the formatted name
  return name;
}

export function createConnectionConfig(connection_type: string, connection_config: any) {
  let config: PostgresConnectionConfig | MysqlConnectionConfig;
  let connectionCase: 'pgConfig' | 'mysqlConfig';
  let connectionConfig: ConnectionConfig;

  switch (connection_type) {
    case 'postgresql':
      connectionCase = 'pgConfig';
      config = new PostgresConnectionConfig({
        connectionConfig: {
          case: 'connection',
          value: new PostgresConnection({
            host: connection_config.host,
            name: connection_config.name,
            user: connection_config.user,
            pass: connection_config.pass,
            port: connection_config.port,
            sslMode: connection_config.sslMode
          })
        }
      });

      connectionConfig = new ConnectionConfig({
        config: {
          case: connectionCase,
          value: config
        }
      });
      break;
    case 'mysql':
      const mqconfig = new MysqlConnectionConfig({
        connectionConfig: {
          case: 'connection',
          value: new MysqlConnection({
            host: connection_config.host,
            name: connection_config.name,
            user: connection_config.user,
            pass: connection_config.pass,
            port: connection_config.port,
            protocol: connection_config.protocol
          })
        }
      });

      connectionConfig = new ConnectionConfig({
        config: {
          case: 'mysqlConfig',
          value: mqconfig
        }
      });
      break;
    default:
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid connection type');
      break;
  }

  return connectionConfig;
}
