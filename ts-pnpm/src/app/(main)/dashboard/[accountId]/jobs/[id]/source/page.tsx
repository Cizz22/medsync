'use client';
import { ReactElement } from 'react';

import SubPageHeader from '@/components/headers/SubPageHeader';
import { PageProps } from '@/components/types';

import SourceConnectionCard from './components/SourceConnectionCard';

export default function Page({ params }: PageProps): ReactElement {
  const id = params?.id ?? '';
  return (
    <div className="job-details-container">
      <SubPageHeader
        header="Source Connection"
        description="Manage a job's source connection"
      />

      <div className="space-y-10">
        <SourceConnectionCard jobId={id} />
      </div>
    </div>
  );
}
