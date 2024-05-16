


export interface GetJobResponse {
    id:string,
    created_by_user_id:string,
    created_at:string,
    updated_by_user_id:string,
    updated_at:string,
    name:string,
    source: any,
    destinations:Array<any>,
    mapping:any
    cron_schedule:string
    account_id:string
    sync_options:any
    workflow_options:any
}
