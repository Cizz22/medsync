import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// interface DtoClass<T>{
//   new (data: any): DtoClass<T>;

//   fromJson(data: any): DtoClass<T>;

//   // fromJson(jsonValue: JsonValue): T;
// }

// export function hookOnData<T>(data: JsonValue | DtoClass<T>, cl: DtoClass<T>): DtoClass<T> {
//   return data instanceof DtoClass<T> ? data :
// }
export function getRefreshIntervalFn<T>(
  fn?: (data: T) => number
): ((data: T | undefined) => number) | undefined {
  if (!fn) {
    return undefined;
  }
  return (data) => {
    if (!data) {
      return 0;
    }
    return fn(data);
  };
}

export interface TransformerFormProps<T> {
  existingConfig?: T;
  onSubmit(config: T): void;
  isReadonly?: boolean;
}

export function setBigIntOrOld(
  newVal: bigint | boolean | number | string,
  oldValue: bigint
): bigint {
  try {
    const newInt = BigInt(newVal);
    return newInt;
  } catch {
    return oldValue;
  }
}

export function tryBigInt(
  val: bigint | boolean | number | string
): bigint | null {
  try {
    const newInt = BigInt(val);
    return newInt;
  } catch {
    return null;
  }
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
