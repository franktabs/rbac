from django.contrib import admin
from .models import *
# Register your models here.


@admin.register(Utilisateur, Role, Permission)
class GenericAdmin(admin.ModelAdmin):
    pass


@admin.register(Role_permission)
class Role_permissionAdmin(admin.ModelAdmin):
    list_display = ("role", "permission")


@admin.register(Utilisateur_role)
class Utilisateur_roleAdmin(admin.ModelAdmin):
    list_display = ("utilisateur", "role")
