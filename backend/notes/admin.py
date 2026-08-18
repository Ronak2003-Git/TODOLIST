from django.contrib import admin
from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ["heading", "user", "subject", "semester", "updated_at"]
    list_filter = ["semester", "subject"]
    search_fields = ["heading", "content", "user__email"]
