from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import UserPreference
from .serializers import PreferenceSerializer, RegisterSerializer, StudentSerializer
from subjects.services import ensure_starter_subjects


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        ensure_starter_subjects(user)
        refresh = TokenObtainPairSerializer.get_token(user)
        return Response({
            "user": StudentSerializer(user, context={"request": request}).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)


class CUSATTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = StudentSerializer(self.user, context={"request": self.context.get("request")}).data
        return data


class LoginView(TokenObtainPairView):
    serializer_class = CUSATTokenSerializer


class LogoutView(generics.GenericAPIView):
    def post(self, request):
        return Response({"detail": "Logged out successfully."})


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = StudentSerializer
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_object(self):
        return self.request.user


class PreferenceView(generics.RetrieveUpdateAPIView):
    serializer_class = PreferenceSerializer

    def get_object(self):
        preference, _ = UserPreference.objects.get_or_create(user=self.request.user)
        return preference


class ChangePasswordView(generics.GenericAPIView):
    def post(self, request):
        current_password = request.data.get("current_password", "")
        new_password = request.data.get("new_password", "")
        if not request.user.check_password(current_password):
            return Response({"current_password": ["Your current password is incorrect."]}, status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 8:
            return Response({"new_password": ["Use at least 8 characters."]}, status=status.HTTP_400_BAD_REQUEST)
        request.user.set_password(new_password)
        request.user.save(update_fields=["password"])
        return Response({"detail": "Password changed successfully."})
