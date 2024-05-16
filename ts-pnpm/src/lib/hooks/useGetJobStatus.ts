

export enum JobStatus {
    UNSPECIFIED = 0,
    ENABLED = 1,
    PAUSED = 2,
    DISABLED = 3
}

export interface JobStatusResponse {
    jobId: string;
    status: JobStatus;
}