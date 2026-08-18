from rest_framework import serializers
from .models import Subject


class SubjectSerializer(serializers.ModelSerializer):
    task_count = serializers.IntegerField(read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ["id", "name", "code", "lecturer_name", "description", "color", "task_count", "progress", "created_at", "updated_at"]
        read_only_fields = ["id", "task_count", "progress", "created_at", "updated_at"]

    def get_progress(self, subject):
        task_count = getattr(subject, "task_count", None)
        if task_count is None:
            task_count = subject.tasks.count()
        if not task_count:
            return 0
        completed_count = getattr(subject, "completed_count", None)
        if completed_count is None:
            completed_count = subject.tasks.filter(status="completed").count()
        return round((completed_count / task_count) * 100)
