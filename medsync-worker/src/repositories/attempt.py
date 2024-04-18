from src.models import Attempt

class AttemptRepository:
    
    @staticmethod
    def get_by(**kwargs):
        return Attempt.query.filter_by(**kwargs)
    
    @staticmethod
    def create(job_id, attempt_number, status):
        attempt = Attempt(job_id, attempt_number, status)
        attempt.save()
        return attempt
    
    @staticmethod
    def update(id, **columns):
        attempt = AttemptRepository.get_by_id(id)
        if attempt:
            for key, value in columns.items():
                setattr(attempt, key, value)
            attempt.commit()
        return attempt
    
    @staticmethod
    def get_all():
        return Attempt.query.all()