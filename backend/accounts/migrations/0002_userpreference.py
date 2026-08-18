from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="UserPreference",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("study_reminders", models.BooleanField(default=True)),
                ("default_task_view", models.CharField(default="list", max_length=20)),
                ("start_week_on", models.CharField(default="monday", max_length=12)),
                ("task_reminders", models.BooleanField(default=True)),
                ("class_reminders", models.BooleanField(default=True)),
                ("exam_reminders", models.BooleanField(default=True)),
                ("appearance", models.CharField(choices=[("light", "Light mode"), ("dark", "Dark mode"), ("system", "System default")], default="system", max_length=10)),
                ("language", models.CharField(default="English", max_length=12)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="preferences", to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
