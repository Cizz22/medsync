import { Badge } from '@/components/ui/badge';
// import { CheckSqlQueryResponse } from '@neosync/sdk';
import { ReactElement } from 'react';
import { CheckSqlQueryResponse } from './EditItem';

interface Props {
  resp?: CheckSqlQueryResponse;
}

export default function ValidateQueryBadge(props: Props): ReactElement | null {
  const { resp } = props;
  if (!resp) {
    return null;
  }
  const text = resp ? 'VALID' : 'INVALID';
  return (
    <Badge
      variant={resp ? 'default' : 'destructive'}
      className="cursor-default px-4 py-2"
    >
      {text}
    </Badge>
  );
}
