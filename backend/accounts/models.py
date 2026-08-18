from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class StudentManager(BaseUserManager):
    """Create student accounts using any valid email address as the login identifier."""

    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("An email address is required.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(email, password, **extra_fields)


class Student(AbstractUser):
    """CUSAT student identity used across all future planner models."""

    username = None
    full_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    register_number = models.CharField(max_length=50, unique=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name", "register_number"]

    objects = StudentManager()

    class Meta:
        ordering = ["full_name"]

    def __str__(self):
        return self.full_name or self.email


class UserPreference(models.Model):
    """Personal planning and notification settings for a student."""

    APPEARANCE_CHOICES = [
        ("light", "Light mode"),
        ("dark", "Dark mode"),
        ("system", "System default"),
    ]

    user = models.OneToOneField(Student, on_delete=models.CASCADE, related_name="preferences")
    study_reminders = models.BooleanField(default=True)
    default_task_view = models.CharField(max_length=20, default="list")
    start_week_on = models.CharField(max_length=12, default="monday")
    task_reminders = models.BooleanField(default=True)
    class_reminders = models.BooleanField(default=True)
    exam_reminders = models.BooleanField(default=True)
    appearance = models.CharField(max_length=10, choices=APPEARANCE_CHOICES, default="system")
    language = models.CharField(max_length=12, default="English")
    starter_subjects_ready = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Preferences for {self.user}"
