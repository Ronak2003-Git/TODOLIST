from pathlib import Path
from rest_framework import serializers
from subjects.models import Subject
from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    subject_id = serializers.PrimaryKeyRelatedField(source="subject", queryset=Subject.objects.all(), allow_null=True, required=False)
    subject_name = serializers.SerializerMethodField()
    attachment_name = serializers.SerializerMethodField()
    attachment_size = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = [
            "id", "subject_id", "subject_name", "semester", "heading", "content", "attachment",
            "attachment_name", "attachment_size", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "subject_name", "attachment_name", "attachment_size", "created_at", "updated_at"]

    def validate_subject_id(self, subject):
        if subject and subject.user_id != self.context["request"].user.id:
            raise serializers.ValidationError("Choose one of your own subjects.")
        return subject

    def validate_attachment(self, attachment):
        extension = Path(attachment.name).suffix.lower()
        if extension not in {".pdf", ".docx"}:
            raise serializers.ValidationError("Upload a PDF or DOCX file.")
        if attachment.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("Files must be 10 MB or smaller.")
        return attachment

    def get_subject_name(self, note):
        return note.subject.name if note.subject else "General"

    def get_attachment_name(self, note):
        return Path(note.attachment.name).name if note.attachment else ""

    def get_attachment_size(self, note):
        return note.attachment.size if note.attachment else 0
