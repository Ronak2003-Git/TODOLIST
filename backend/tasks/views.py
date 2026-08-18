from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Task
from .serializers import TaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user).select_related("subject").prefetch_related("subtasks")
        params = self.request.query_params
        if params.get("subject"):
            queryset = queryset.filter(subject_id=params["subject"])
        if params.get("priority"):
            queryset = queryset.filter(priority=params["priority"])
        if params.get("status"):
            queryset = queryset.filter(status=params["status"])
        if params.get("type"):
            queryset = queryset.filter(task_type=params["type"])
        if params.get("search"):
            queryset = queryset.filter(title__icontains=params["search"])
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).select_related("subject").prefetch_related("subtasks")


class TaskStatusView(APIView):
    def patch(self, request, pk):
        task = get_object_or_404(Task.objects.filter(user=request.user), pk=pk)
        status_value = request.data.get("status")
        valid_statuses = {choice[0] for choice in Task.STATUS_CHOICES}
        if status_value not in valid_statuses:
            raise serializers.ValidationError({"status": "Choose a valid status."})
        task.status = status_value
        task.completed_at = timezone.now() if status_value == "completed" else None
        task.save(update_fields=["status", "completed_at", "updated_at"])
        return Response(TaskSerializer(task, context={"request": request}).data)
