// import {
//   SupportedJobType,
//   SystemTransformer,
//   TransformerDataType,
//   TransformerSource,
//   UserDefinedTransformer,
// } from '@neosync/sdk';
import { SupportedJobType, Transformer, TransformerDataType, TransformerSource } from '@/lib/hooks/useGetSystemTransformers';
import { JobType } from './schema-constraint-handler';
import { CreateUserDefinedTransformerResponse } from '@/lib/hooks/useGetUserDefinedTransformers';

export class TransformerHandler {
  private readonly systemTransformers: Transformer[];
  private readonly userDefinedTransformers: CreateUserDefinedTransformerResponse[];

  private readonly systemBySource: Map<TransformerSource, Transformer>;
  private readonly userDefinedById: Map<string, CreateUserDefinedTransformerResponse>;

  constructor(
    systemTransformers: Transformer[],
    userDefinedTransformers: CreateUserDefinedTransformerResponse[]
  ) {
    this.systemTransformers = systemTransformers;
    this.userDefinedTransformers = userDefinedTransformers;

    this.systemBySource = new Map(systemTransformers.map((t) => [t.source, t]));
    this.userDefinedById = new Map(
      userDefinedTransformers.map((t) => [t.id, t])
    );
  }

  public getFilteredTransformers(filters: TransformerFilters): {
    system: Transformer[];
    userDefined: CreateUserDefinedTransformerResponse[];
  } {
    const systemMap = new Map(
      this.systemTransformers.map((t) => [
        t.source,
        shouldIncludeSystem(t, filters),
      ])
    );

    const userMap = new Map(
      this.userDefinedTransformers.map((t) => {
        const underlyingSystem = this.systemBySource.get(t.source);
        if (!underlyingSystem) {
          // uh oh
          return [t.id, false];
        }
        return [t.id, systemMap.get(underlyingSystem.source) ?? false];
      })
    );
    return {
      system: this.systemTransformers.filter((t) => systemMap.get(t.source)),
      userDefined: this.userDefinedTransformers.filter((t) =>
        userMap.get(t.id)
      ),
    };
  }

  public getSystemTransformerBySource(
    source: TransformerSource
  ): Transformer | undefined {
    return this.systemBySource.get(source);
  }

  public getUserDefinedTransformerById(
    id: string
  ): CreateUserDefinedTransformerResponse | undefined {
    return this.userDefinedById.get(id);
  }
}

function shouldIncludeSystem(
  transformer: Transformer,
  filters: TransformerFilters
): boolean {
  if (
    filters.hasDefault &&
    transformer.source === TransformerSource.TRANSFORMER_SOURCE_GENERATE_DEFAULT
  ) {
    return true;
  }
  if (filters.isForeignKey) {
    if (filters.isNullable) {
      return (
        transformer.source === TransformerSource.TRANSFORMER_SOURCE_GENERATE_NULL ||
        transformer.source === TransformerSource.TRANSFORMER_SOURCE_PASSTHROUGH
      );
    }
    return transformer.source === TransformerSource.TRANSFORMER_SOURCE_PASSTHROUGH;
  }
  if (!transformer.supportedJobTypes.some((jt) => jt === filters.jobType)) {
    return false;
  }
  if (
    filters.isNullable &&
    !transformer.dataTypes.some((dt) => dt === TransformerDataType.TRANSFORMER_DATA_TYPE_NULL)
  ) {
    return false;
  }
  const tdts = new Set(transformer.dataTypes);
  if (filters.dataType === TransformerDataType.TRANSFORMER_DATA_TYPE_UNSPECIFIED) {
    return tdts.has(TransformerDataType.TRANSFORMER_DATA_TYPE_ANY);
  }
  return tdts.has(filters.dataType) || tdts.has(TransformerDataType.TRANSFORMER_DATA_TYPE_ANY);
}

export interface TransformerFilters {
  isForeignKey: boolean;
  dataType: TransformerDataType;
  isNullable: boolean;
  hasDefault: boolean;
  jobType: SupportedJobType;
}

export function toSupportedJobtype(jobtype: JobType): SupportedJobType {
  if (jobtype === 'sync') {
    return SupportedJobType.SUPPORTED_JOB_TYPE_SYNC;
  } else if (jobtype === 'generate') {
    return SupportedJobType.SUPPORTED_JOB_TYPE_GENERATE;
  }
  return SupportedJobType.SUPPORTED_JOB_TYPE_UNSPECIFIED;
}
