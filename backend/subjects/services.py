from accounts.models import UserPreference
from .models import Subject


STARTER_SUBJECTS = [
    ("Mathematics", "MAT 101", "#6C4DF6"),
    ("Computer Applications", "CA 104", "#2563EB"),
    ("Economics", "ECO 112", "#F59E0B"),
    ("English", "ENG 105", "#EC4899"),
    ("Statistics", "STA 107", "#14B8A6"),
    ("Management", "MGT 109", "#F97316"),
    ("Environmental Studies", "EVS 102", "#22C55E"),
]


def ensure_starter_subjects(user):
    """Provide editable starter courses once for each student account."""
    preference, _ = UserPreference.objects.get_or_create(user=user)
    if preference.starter_subjects_ready:
        return

    for name, code, color in STARTER_SUBJECTS:
        Subject.objects.get_or_create(
            user=user,
            name=name,
            defaults={"code": code, "color": color},
        )

    preference.starter_subjects_ready = True
    preference.save(update_fields=["starter_subjects_ready", "updated_at"])
