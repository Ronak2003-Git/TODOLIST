from datetime import datetime
from django.utils import timezone
from rest_framework import serializers
from subjects.models import Subject
from .models import SubTask, Task


class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = ["id", "title", "is_completed", "position"]
        read_only_fields = ["id"]


class TaskSerializer(serializers.ModelSerializer):
    subject_id = serializers.PrimaryKeyRelatedField(source="subject", queryset=Subject.objects.all(), allow_null=True, required=False)
    subject_name = serializers.SerializerMethodField()
    attachment_url = serializers.SerializerMethodField()
    attachment_name = serializers.SerializerMethodField()
    display_status = serializers.SerializerMethodField()
    subtasks = serializers.JSONField(required=False, write_only=True)

    class Meta:
        model = Task
        fields = [
            "id", "subject_id", "subject_name", "title", "description", "task_type", "priority", "status",
            "display_status", "due_date", "due_time", "reminder", "notes", "attachment", "attachment_url",
            "attachment_name", "is_favorite", "subtasks", "created_at", "updated_at", "completed_at",
        ]
        read_only_fields = ["id", "display_status", "attachment_url", "attachment_name", "created_at", "updated_at", "completed_at"]

    def validate_subject_id(self, subject):
        if subject and subject.user_id != self.context["request"].user.id:
            raise serializers.ValidationError("Choose one of your own subjects.")
        return subject

    def validate_subtasks(self, subtasks):
        if not isinstance(subtasks, list):
            raise serializers.ValidationError("Subtasks must be a list.")
        for subtask in subtasks:
            if not isinstance(subtask, dict) or not str(subtask.get("title", "")).strip():
                raise serializers.ValidationError("Every subtask needs a title.")
        return subtasks

    def get_subject_name(self, task):
        return task.subject.name if task.subject else None

    def get_attachment_url(self, task):
        if not task.attachment:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(task.attachment.url) if request else task.attachment.url

    def get_attachment_name(self, task):
        return task.attachment.name.rsplit("/", 1)[-1] if task.attachment else ""

    def get_display_status(self, task):
        if task.status == "completed":
            return "completed"
        current = timezone.localtime()
        deadline = datetime.combine(task.due_date, task.due_time or datetime.max.time())
        if timezone.is_naive(deadline):
            deadline = timezone.make_aware(deadline, timezone.get_current_timezone())
        return "overdue" if deadline < current else task.status

    def _write_subtasks(self, task, subtasks):
        task.subtasks.all().delete()
        SubTask.objects.bulk_create([
            SubTask(task=task, title=item["title"], is_completed=item.get("is_completed", False), position=item.get("position", index))
            for index, item in enumerate(subtasks)
        ])

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["subtasks"] = SubTaskSerializer(instance.subtasks.all(), many=True).data
        return representation

    def create(self, validated_data):
        subtasks = validated_data.pop("subtasks", [])
        task = Task.objects.create(**validated_data)
        self._write_subtasks(task, subtasks)
        return task

    def update(self, instance, validated_data):
        subtasks = validated_data.pop("subtasks", None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        if subtasks is not None:
            self._write_subtasks(instance, subtasks)
        return instance
