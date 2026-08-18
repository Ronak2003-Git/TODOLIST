from django.conf import settings
from django.db import models
from subjects.models import Subject


class Task(models.Model):
    TASK_TYPE_CHOICES = [
        ("assignment", "Assignment"), ("study", "Study"), ("exam", "Exam"),
        ("project", "Project"), ("report", "Report"), ("other", "Other"),
    ]
    PRIORITY_CHOICES = [("low", "Low"), ("medium", "Medium"), ("high", "High")]
    STATUS_CHOICES = [
        ("todo", "To Do"), ("in_progress", "In Progress"),
        ("completed", "Completed"), ("overdue", "Overdue"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tasks")
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, related_name="tasks", blank=True, null=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    task_type = models.CharField(max_length=20, choices=TASK_TYPE_CHOICES, default="assignment")
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="todo")
    due_date = models.DateField()
    due_time = models.TimeField(blank=True, null=True)
    reminder = models.CharField(max_length=50, blank=True, default="1 hour before")
    notes = models.TextField(blank=True)
    attachment = models.FileField(upload_to="task_attachments/", blank=True, null=True)
    is_favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["due_date", "due_time", "created_at"]

    def __str__(self):
        return self.title


class SubTask(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="subtasks")
    title = models.CharField(max_length=200)
    is_completed = models.BooleanField(default=False)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self):
        return self.title
