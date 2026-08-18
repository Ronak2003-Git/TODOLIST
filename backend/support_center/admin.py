from django.contrib import admin
from .models import SupportTicket


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ["subject", "user", "category", "status", "created_at"]
    list_filter = ["category", "status"]
    search_fields = ["subject", "message", "user__email"]
