import { ReactElement } from 'react';
import { Skeleton } from '../ui/skeleton';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

export default function SkeletonTable(props: Props): ReactElement {
  // eslint-disable-next-line no-empty-pattern
  const {} = props;
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[400px]" />
      </div>
    </div>
  );
}
