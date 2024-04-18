from src.models import Job


class JobRepository:
    
    @staticmethod
    def get_by(**kwargs):
        return Job.query.filter_by(**kwargs)
    
    
    
    @staticmethod
    def create(scope, config_type, config, status):
        job = Job(scope, config_type, config, status)
        job.save()
        return job
    
    @staticmethod
    def update(id, **columns):
        job = JobRepository.get_by_id(id)
        if job:
            for key, value in columns.items():
                setattr(job, key, value)
            job.commit()
        return job
    
    def get_all():
        return Job.query.all()