from pathlib import Path
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.views import APIView
from .models import Note
from .serializers import NoteSerializer


class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_queryset(self):
        queryset = Note.objects.filter(user=self.request.user).select_related("subject")
        search = self.request.query_params.get("search")
        subject_id = self.request.query_params.get("subject")
        semester = self.request.query_params.get("semester")
        if search:
            queryset = queryset.filter(heading__icontains=search)
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if semester:
            queryset = queryset.filter(semester=semester)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user).select_related("subject")


class NoteDownloadView(APIView):
    def get(self, request, pk):
        note = get_object_or_404(Note.objects.filter(user=request.user), pk=pk)
        if not note.attachment:
            raise Http404("This note does not have an attachment.")
        return FileResponse(note.attachment.open("rb"), as_attachment=True, filename=Path(note.attachment.name).name)
