import { ReactElement } from 'react';
import { Label } from '../ui/label';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

export default function RequiredLabel(props: Props): ReactElement {
  // eslint-disable-next-line no-empty-pattern
  const {} = props;
  return <Label className="text-red-400">* </Label>;
}
