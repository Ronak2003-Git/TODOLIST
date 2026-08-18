from django.conf import settings
from django.db import models
from subjects.models import Subject


class Note(models.Model):
    SEMESTER_CHOICES = [(number, f"Semester {number}") for number in range(1, 11)]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, related_name="notes", blank=True, null=True)
    semester = models.PositiveSmallIntegerField(choices=SEMESTER_CHOICES, default=1)
    heading = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    attachment = models.FileField(upload_to="note_attachments/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at", "-created_at"]

    def __str__(self):
        return self.heading
