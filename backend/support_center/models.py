from django.conf import settings
from django.db import models


class SupportTicket(models.Model):
    CATEGORY_CHOICES = [
        ("account", "Account & settings"),
        ("tasks", "Tasks & assignments"),
        ("calendar", "Calendar & schedule"),
        ("progress", "Study progress"),
        ("notes", "Notes & resources"),
        ("other", "Other"),
    ]
    STATUS_CHOICES = [
        ("open", "Open"),
        ("in_progress", "In progress"),
        ("resolved", "Resolved"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="support_tickets")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="other")
    subject = models.CharField(max_length=160)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.subject} ({self.user.email})"
