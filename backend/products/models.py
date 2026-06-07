from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    comparePrice = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    costPerItem = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sku = models.CharField(max_length=100, blank=True, null=True)
    barcode = models.CharField(max_length=100, blank=True, null=True)
    trackQuantity = models.BooleanField(default=True)
    availableQuantity = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default='published')
    category = models.CharField(max_length=100, blank=True, null=True)
    productType = models.CharField(max_length=100, blank=True, null=True)
    vendor = models.CharField(max_length=100, blank=True, null=True)
    collections = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    imageUrl = models.TextField(blank=True, null=True)
    images = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
