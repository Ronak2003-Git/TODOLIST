from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Student, UserPreference


@admin.register(Student)
class StudentAdmin(UserAdmin):
    model = Student
    ordering = ["email"]
    list_display = ["email", "full_name", "register_number", "is_staff", "is_active"]
    search_fields = ["email", "full_name", "register_number"]
    fieldsets = UserAdmin.fieldsets + (("CUSAT ToDoList profile", {"fields": ("full_name", "register_number", "profile_image")}),)
    add_fieldsets = UserAdmin.add_fieldsets + (("CUSAT ToDoList profile", {"fields": ("full_name", "email", "register_number", "profile_image")}),)


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ["user", "appearance", "study_reminders", "updated_at"]
