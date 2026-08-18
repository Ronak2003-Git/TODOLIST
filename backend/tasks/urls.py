from django.urls import path
from .views import TaskDetailView, TaskListCreateView, TaskStatusView


urlpatterns = [
    path("", TaskListCreateView.as_view(), name="task-list"),
    path("<int:pk>/", TaskDetailView.as_view(), name="task-detail"),
    path("<int:pk>/status/", TaskStatusView.as_view(), name="task-status"),
]
