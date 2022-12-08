from django.db import models
from rest_framework import serializers
# Create your models here.


class Utilisateur(models.Model):
    blocage = [('OUI', "OUI"), ("NON", "NON")]
    statuts = [("client", "CLIENT"), ("employe", "EMPLOYE")]
    statut = models.CharField(
        null=False, max_length=45, default="client", choices=statuts)
    nom = models.CharField(max_length=255, null=False)
    email = models.EmailField(null=False, max_length=255, unique=True)
    password = models.CharField(null=False, max_length=255, blank=False)
    role = models.ManyToManyField(
        "Role", through="utilisateur_role", related_name="utilisateur")
    bloque = models.CharField(
        max_length=10, choices=blocage, null=False, blank=False, default="NON")

    class Meta:
        db_table = "utilisateur"

    def __str__(self) -> str:
        return self.email


class Role(models.Model):
    nom = models.CharField(null=False, blank=False, max_length=45, unique=True)
    permission = models.ManyToManyField(
        "Permission", through="Role_permission", related_name="role")

    def __str__(self) -> str:
        return self.nom

    class Meta:
        db_table = "role"


class RoleWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Role
        fields = "__all__"


class UtilisateurWriteSerializer(serializers.ModelSerializer):
    # role = RoleSerializer()

    class Meta:
        model = Utilisateur
        fields = "__all__"


class Permission(models.Model):
    description = models.CharField(max_length=255, null=False)

    def __str__(self) -> str:
        return self.description

    class Meta:
        db_table = "permission"


class PermissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Permission
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    permission = PermissionSerializer(many=True)

    class Meta:
        model = Role
        fields = "__all__"


class UtilisateurSerializer(serializers.ModelSerializer):
    role = RoleSerializer(many=True)

    class Meta:
        model = Utilisateur
        fields = "__all__"


class Utilisateur_role(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Utilisateur et Role"
        db_table = "utilisateur_role"
        unique_together = ('role_id', "utilisateur_id")
        constraints = [models.UniqueConstraint(
            fields=['role_id', "utilisateur_id"], name="constraint_utilisateur")]


class Utilisateur_roleWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Utilisateur_role
        fields = "__all__"


class Utilisateur_roleSerializer(Utilisateur_roleWriteSerializer):
    utilisateur = UtilisateurSerializer()
    role = RoleSerializer()


class Role_permission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Role et permission"
        db_table = "role_permission"
        unique_together = ('role_id', "permission_id")
        constraints = [models.UniqueConstraint(
            fields=['role_id', "permission_id"], name="constraint_role")]


class Role_permissionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role_permission
        fields = "__all__"


class Role_permissionSerializer(Role_permissionWriteSerializer):
    role = RoleSerializer()
    permission = PermissionSerializer()
