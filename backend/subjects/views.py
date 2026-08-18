from django.db.models import Count, Q
from rest_framework import generics
from .models import Subject
from .serializers import SubjectSerializer
from .services import ensure_starter_subjects


class SubjectListCreateView(generics.ListCreateAPIView):
    serializer_class = SubjectSerializer

    def get_queryset(self):
        ensure_starter_subjects(self.request.user)
        return Subject.objects.filter(user=self.request.user).annotate(
            task_count=Count("tasks"),
            completed_count=Count("tasks", filter=Q(tasks__status="completed")),
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubjectSerializer

    def get_queryset(self):
        return Subject.objects.filter(user=self.request.user)
