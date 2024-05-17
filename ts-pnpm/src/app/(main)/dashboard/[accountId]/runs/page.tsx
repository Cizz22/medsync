'use client';
import { ReactElement } from 'react';

import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';

import RunsTable from './components/RunsTable';

export default function JobRuns(): ReactElement {
  return (
    <OverviewContainer
      Header={<PageHeader header="Runs" />}
      containerClassName="runs-page"
    >
      <RunsTable />
    </OverviewContainer>
  );
}
