import { ReactElement } from 'react';

import ConnectionCard, { ConnectionMeta } from '@/components/ConnectionCard';
import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';

const CONNECTIONS: ConnectionMeta[] = [
  {
    urlSlug: 'postgres',
    name: 'Postgres',
    description:
      'PostgreSQL is a free and open-source relational database manageent system emphasizing extensibility and SQL compliance.',
  },
  {
    urlSlug: 'mysql',
    name: 'MySQL',
    description:
      'MySQL is an open-source relational database management system.',
  },
];

export default function NewConnection(): ReactElement {
  return (
    <OverviewContainer
      Header={
        <PageHeader
          header="Create a new Connection"
          subHeadings="Connect a new datasource to use in sync or generate jobs."
          pageHeaderContainerClassName="mx-24"
        />
      }
    >
      <div className="gap-6 rounded-lg md:grid lg:grid-cols-2 xl:grid-cols-3 content-stretch mx-24">
        {CONNECTIONS.map((connection) => (
          <ConnectionCard key={connection.urlSlug} connection={connection} />
        ))}
      </div>
    </OverviewContainer>
  );
}
