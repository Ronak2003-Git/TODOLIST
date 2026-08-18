from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("subjects", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Task",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True)),
                ("task_type", models.CharField(choices=[("assignment", "Assignment"), ("study", "Study"), ("exam", "Exam"), ("project", "Project"), ("report", "Report"), ("other", "Other")], default="assignment", max_length=20)),
                ("priority", models.CharField(choices=[("low", "Low"), ("medium", "Medium"), ("high", "High")], default="medium", max_length=10)),
                ("status", models.CharField(choices=[("todo", "To Do"), ("in_progress", "In Progress"), ("completed", "Completed"), ("overdue", "Overdue")], default="todo", max_length=15)),
                ("due_date", models.DateField()),
                ("due_time", models.TimeField(blank=True, null=True)),
                ("reminder", models.CharField(blank=True, default="1 hour before", max_length=50)),
                ("notes", models.TextField(blank=True)),
                ("attachment", models.FileField(blank=True, null=True, upload_to="task_attachments/")),
                ("is_favorite", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("completed_at", models.DateTimeField(blank=True, null=True)),
                ("subject", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="tasks", to="subjects.subject")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="tasks", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["due_date", "due_time", "created_at"]},
        ),
        migrations.CreateModel(
            name="SubTask",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("is_completed", models.BooleanField(default=False)),
                ("position", models.PositiveIntegerField(default=0)),
                ("task", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="subtasks", to="tasks.task")),
            ],
            options={"ordering": ["position", "id"]},
        ),
    ]
