from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, UploadImageView

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('upload-image/', UploadImageView.as_view(), name='upload-image'),
    path('', include(router.urls)),
]
