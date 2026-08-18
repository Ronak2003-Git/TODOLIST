from django.contrib import admin
from .models import SubTask, Task


class SubTaskInline(admin.TabularInline):
    model = SubTask
    extra = 0


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "subject", "due_date", "priority", "status"]
    list_filter = ["task_type", "priority", "status"]
    search_fields = ["title", "user__email"]
    inlines = [SubTaskInline]
