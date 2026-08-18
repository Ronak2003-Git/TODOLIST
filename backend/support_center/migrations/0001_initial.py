import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="SupportTicket",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("category", models.CharField(choices=[("account", "Account & settings"), ("tasks", "Tasks & assignments"), ("calendar", "Calendar & schedule"), ("progress", "Study progress"), ("notes", "Notes & resources"), ("other", "Other")], default="other", max_length=20)),
                ("subject", models.CharField(max_length=160)),
                ("message", models.TextField()),
                ("status", models.CharField(choices=[("open", "Open"), ("in_progress", "In progress"), ("resolved", "Resolved")], default="open", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="support_tickets", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
