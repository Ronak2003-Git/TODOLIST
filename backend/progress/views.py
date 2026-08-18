from datetime import timedelta
from django.db.models import Count
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from subjects.models import Subject
from tasks.models import Task
from tasks.serializers import TaskSerializer


def task_statistics(user):
    today = timezone.localdate()
    tasks = Task.objects.filter(user=user)
    total = tasks.count()
    completed = tasks.filter(status="completed").count()
    overdue = tasks.exclude(status="completed").filter(due_date__lt=today).count()
    pending = total - completed - overdue
    completion_rate = round((completed / total) * 100) if total else 0
    return {"total": total, "completed": completed, "pending": pending, "overdue": overdue, "completion_rate": completion_rate}


class DashboardView(APIView):
    def get(self, request):
        today = timezone.localdate()
        upcoming = Task.objects.filter(user=request.user).exclude(status="completed").filter(due_date__gte=today).select_related("subject")[:5]
        return Response({
            "stats": task_statistics(request.user),
            "upcoming_tasks": TaskSerializer(upcoming, many=True, context={"request": request}).data,
            "today_schedule": [
                {"id": "schedule-1", "time": "09:00", "title": "Mathematics", "location": "LT 101", "color": "#6C4DF6"},
                {"id": "schedule-2", "time": "11:00", "title": "Computer Applications Lab", "location": "Lab 2", "color": "#2563EB"},
                {"id": "schedule-3", "time": "13:00", "title": "Economics", "location": "LH 203", "color": "#F59E0B"},
                {"id": "schedule-4", "time": "15:00", "title": "English", "location": "LT 103", "color": "#EC4899"},
                {"id": "schedule-5", "time": "16:30", "title": "Library Time", "location": "Central Library", "color": "#22C55E"},
            ],
        })


class StatisticsView(APIView):
    def get(self, request):
        today = timezone.localdate()
        subjects = []
        for subject in Subject.objects.filter(user=request.user):
            subject_tasks = Task.objects.filter(user=request.user, subject=subject)
            task_count = subject_tasks.count()
            completed = subject_tasks.filter(status="completed").count()
            subjects.append({
                "id": subject.id, "name": subject.name, "color": subject.color,
                "task_count": task_count, "progress": round((completed / task_count) * 100) if task_count else 0,
            })
        priority = [{"name": label, "value": Task.objects.filter(user=request.user, priority=value).count()} for value, label in Task.PRIORITY_CHOICES]
        weekly = []
        for days_ago in range(6, -1, -1):
            day = today - timedelta(days=days_ago)
            weekly.append({
                "day": day.strftime("%a"),
                "created": Task.objects.filter(user=request.user, created_at__date=day).count(),
                "completed": Task.objects.filter(user=request.user, completed_at__date=day).count(),
            })
        return Response({"stats": task_statistics(request.user), "subjects": subjects, "priority": priority, "weekly": weekly})
