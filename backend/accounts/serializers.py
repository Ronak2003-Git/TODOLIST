from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Student, UserPreference


class StudentSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ["id", "full_name", "email", "register_number", "profile_image", "profile_image_url", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_profile_image_url(self, user):
        if not user.profile_image:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(user.profile_image.url) if request else user.profile_image.url


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Student
        fields = ["full_name", "email", "register_number", "password", "confirm_password"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")
        return Student.objects.create_user(password=password, **validated_data)


class PreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = [
            "study_reminders", "default_task_view", "start_week_on", "task_reminders",
            "class_reminders", "exam_reminders", "appearance", "language", "updated_at",
        ]
        read_only_fields = ["updated_at"]
