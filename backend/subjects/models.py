from django.conf import settings
from django.db import models


class Subject(models.Model):
    """A course maintained by an individual student."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subjects")
    name = models.CharField(max_length=120)
    code = models.CharField(max_length=30, blank=True)
    lecturer_name = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default="#6C4DF6")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        constraints = [models.UniqueConstraint(fields=["user", "name"], name="unique_subject_name_per_user")]

    def __str__(self):
        return self.name
