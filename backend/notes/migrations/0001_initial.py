import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("subjects", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Note",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("semester", models.PositiveSmallIntegerField(choices=[(1, "Semester 1"), (2, "Semester 2"), (3, "Semester 3"), (4, "Semester 4"), (5, "Semester 5"), (6, "Semester 6"), (7, "Semester 7"), (8, "Semester 8"), (9, "Semester 9"), (10, "Semester 10")], default=1)),
                ("heading", models.CharField(max_length=200)),
                ("content", models.TextField(blank=True)),
                ("attachment", models.FileField(blank=True, null=True, upload_to="note_attachments/")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("subject", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="notes", to="subjects.subject")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="notes", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-updated_at", "-created_at"]},
        ),
    ]
