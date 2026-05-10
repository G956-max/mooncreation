from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.conf import settings
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer

class UploadImageView(APIView):
    def post(self, request):
        file = request.FILES.get('image')
        if not file:
            return Response({'error': 'No image provided'}, status=400)
        file_name = default_storage.save(f"uploads/{file.name}", file)
        file_url = request.build_absolute_uri(settings.MEDIA_URL + file_name)
        return Response({'url': file_url})
