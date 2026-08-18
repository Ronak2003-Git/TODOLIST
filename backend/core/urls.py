from django.contrib import admin
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from calendar_app.views import CalendarView
from progress.views import DashboardView, StatisticsView


def health_check(request):
    """Temporary public endpoint used to confirm the API is running."""
    return JsonResponse({"status": "ok", "service": "CUSAT ToDoList API"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health-check"),
    path("api/auth/", include("accounts.urls")),
    path("api/tasks/", include("tasks.urls")),
    path("api/subjects/", include("subjects.urls")),
    path("api/notes/", include("notes.urls")),
    path("api/support/", include("support_center.urls")),
    path("api/dashboard/", DashboardView.as_view(), name="dashboard"),
    path("api/calendar/", CalendarView.as_view(), name="calendar"),
    path("api/statistics/", StatisticsView.as_view(), name="statistics"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
