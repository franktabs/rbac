from django.db import models
from rest_framework import serializers
# Create your models here.

class Utilisateur(models.Model):
    statut = models.CharField(null=False, max_length=45, default="client")
    nom = models.CharField(max_length=255, null=False)
    email = models.EmailField(null=False, max_length=255, unique=True)
    password = models.CharField(null=False, max_length=255, blank=False)
    role = models.ManyToManyField("Role", through="utilisateur_role", related_name="utilisateur" )
    
    class Meta:
        db_table = "utilisateur"
        
    def __str__(self) -> str:
        return self.email
    
class UtilisateurSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Utilisateur
        fields = "__all__"

class Role(models.Model):
    nom = models.CharField(null=False, blank=False, max_length=45, unique=True)
    permission = models.ManyToManyField("Permission", through="Role_permission", related_name="role" )
    class Meta:
        db_table = "role"

class RoleSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Role
        fields = "__all__"
    
class Permission(models.Model):
    description = models.CharField(max_length=255, null=False)
    class Meta:
        db_table = "permission"

class PermissionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Permission
        fields =  "__all__"

class Utilisateur_role(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    class Meta:
        db_table = "utilisateur_role"

class Utilisateur_roleWriteSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Utilisateur_role
        fields = "__all__"

class Utilisateur_roleSerializer(Utilisateur_roleWriteSerializer):
    Utilisateur = UtilisateurSerializer()
    role = RoleSerializer()

class Role_permission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    
    class Meta:
        db_table = "role_permission"
    
class Role_permissionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role_permission
        fields = "__all__"


class Role_permissionSerializer(Role_permissionWriteSerializer):
    role = RoleSerializer()
    permission = PermissionSerializer()
    
