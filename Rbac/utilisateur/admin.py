from django.contrib import admin
from .models import *
# Register your models here.


@admin.register(Utilisateur, Role, Utilisateur_role, Role_permission)
class GenericAdmin(admin.ModelAdmin):
    pass
