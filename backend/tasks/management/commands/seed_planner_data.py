from datetime import timedelta
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from accounts.models import Student, UserPreference
from subjects.models import Subject
from tasks.models import SubTask, Task


SUBJECTS = [
    ("Mathematics", "MAT 101", "Dr. Meera Nair", "#6C4DF6"),
    ("Computer Applications", "CA 104", "Prof. Arjun Menon", "#2563EB"),
    ("Economics", "ECO 112", "Dr. Nisha Varma", "#F59E0B"),
    ("English", "ENG 105", "Ms. Riya Thomas", "#EC4899"),
    ("Statistics", "STA 107", "Dr. Joseph Mathew", "#14B8A6"),
    ("Management", "MGT 109", "Prof. Latha S.", "#F97316"),
    ("Environmental Studies", "EVS 102", "Dr. Keerthi Rao", "#22C55E"),
]

TASKS = [
    ("Mathematics Assignment 3", "Mathematics", "assignment", "high", 1, "18:00", "todo", "Complete the vector calculus problems and upload the handwritten work."),
    ("Computer Applications Lab Record", "Computer Applications", "report", "medium", 2, "15:30", "in_progress", "Document completed lab exercises and attach output screenshots."),
    ("Economics: Read Chapter 4", "Economics", "study", "low", 0, "20:00", "todo", "Review the market structures chapter before tomorrow's class."),
    ("English Essay Draft", "English", "assignment", "medium", 4, "17:00", "todo", "Prepare the first draft on the assigned modern literature topic."),
    ("Statistics Problem Set 2", "Statistics", "study", "high", -1, "13:00", "todo", "Complete the probability and distribution exercises."),
    ("Management Case Study", "Management", "project", "medium", 5, "16:00", "in_progress", "Analyse the assigned business case and prepare the summary."),
    ("Environmental Studies Report", "Environmental Studies", "report", "low", 7, "17:00", "todo", "Write the first report draft with references."),
    ("Statistics Revision Quiz", "Statistics", "exam", "high", 8, "10:00", "todo", "Revise the unit two formulae and practice questions."),
    ("English Reading Notes", "English", "study", "low", -3, "19:00", "completed", "Compile reading notes for the literature discussion."),
    ("Mathematics Formula Revision", "Mathematics", "study", "medium", -2, "19:00", "todo", "Review key formulae for the upcoming problem-solving session."),
]


class Command(BaseCommand):
    help = "Seed a student account with CUSAT ToDoList sample subjects and tasks."

    def add_arguments(self, parser):
        parser.add_argument("--email", required=True, help="Email/login ID of the student to seed.")

    def handle(self, *args, **options):
        try:
            user = Student.objects.get(email=options["email"])
        except Student.DoesNotExist as exc:
            raise CommandError("No student was found for that email/login ID.") from exc

        UserPreference.objects.get_or_create(user=user)
        subject_lookup = {}
        for name, code, lecturer_name, color in SUBJECTS:
            subject, _ = Subject.objects.get_or_create(
                user=user, name=name,
                defaults={"code": code, "lecturer_name": lecturer_name, "color": color},
            )
            subject_lookup[name] = subject

        today = timezone.localdate()
        created = 0
        for title, subject_name, task_type, priority, day_offset, due_time, status, description in TASKS:
            task, was_created = Task.objects.get_or_create(
                user=user, title=title,
                defaults={
                    "subject": subject_lookup[subject_name], "task_type": task_type, "priority": priority,
                    "due_date": today + timedelta(days=day_offset), "due_time": due_time,
                    "status": status, "description": description,
                    "is_favorite": title == "Mathematics Assignment 3",
                    "completed_at": timezone.now() if status == "completed" else None,
                },
            )
            if was_created:
                created += 1
                if title == "Mathematics Assignment 3":
                    SubTask.objects.bulk_create([
                        SubTask(task=task, title="Review lecture notes", is_completed=True, position=0),
                        SubTask(task=task, title="Solve problem set", is_completed=False, position=1),
                    ])
                if title == "Computer Applications Lab Record":
                    SubTask.objects.bulk_create([
                        SubTask(task=task, title="Finish exercises", is_completed=True, position=0),
                        SubTask(task=task, title="Add screenshots", is_completed=False, position=1),
                    ])

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} task(s) for {user.email}."))
