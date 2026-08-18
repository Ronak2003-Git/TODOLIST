from django.contrib import admin
from .models import Subject


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "lecturer_name", "user"]
    list_filter = ["user"]
    search_fields = ["name", "code", "lecturer_name"]
