from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from tasks.models import Task
from tasks.serializers import TaskSerializer


class CalendarView(APIView):
    def get(self, request):
        queryset = Task.objects.filter(user=request.user).select_related("subject").prefetch_related("subtasks")
        start = request.query_params.get("start")
        end = request.query_params.get("end")
        if start:
            queryset = queryset.filter(due_date__gte=start)
        if end:
            queryset = queryset.filter(due_date__lte=end)
        return Response({
            "tasks": TaskSerializer(queryset, many=True, context={"request": request}).data,
            "schedule": [
                {"id": "schedule-1", "time": "09:00", "title": "Mathematics", "location": "LT 101", "color": "#6C4DF6"},
                {"id": "schedule-2", "time": "11:00", "title": "Computer Applications Lab", "location": "Lab 2", "color": "#2563EB"},
                {"id": "schedule-3", "time": "13:00", "title": "Economics", "location": "LH 203", "color": "#F59E0B"},
                {"id": "schedule-4", "time": "15:00", "title": "English", "location": "LT 103", "color": "#EC4899"},
                {"id": "schedule-5", "time": "16:30", "title": "Library Time", "location": "Central Library", "color": "#22C55E"},
            ],
            "generated_on": timezone.localdate(),
        })
