from django.urls import path
from .views import NoteDetailView, NoteDownloadView, NoteListCreateView


urlpatterns = [
    path("", NoteListCreateView.as_view(), name="note-list"),
    path("<int:pk>/download/", NoteDownloadView.as_view(), name="note-download"),
    path("<int:pk>/", NoteDetailView.as_view(), name="note-detail"),
]
