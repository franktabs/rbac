from copy import deepcopy

from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import *
# Create your views here.




class UtilisateurViewSet(ModelViewSet):
    serialiser_class = UtilisateurSerializer
    queryset = Utilisateur.objects.all()
    
    def create(self, req:HttpRequest, *args, **kwargs):
        utilisateur_test = self.serialiser_class(data=req.data)
        utilisateur_test.is_valid(raise_exception=True)
        datas = deepcopy(req.data)
        datas["password"]= make_password(datas["password"])
        utilisateur = self.serialiser_class(data=datas)
        utilisateur.is_valid()
        utilisateur.save()
        utilisateur = Utilisateur.objects.filter(email=req.data['email'])
        utilisateur_test = self.serialiser_class(data=utilisateur, many=True)
        return Response(utilisateur_test.data, status=201)

class RoleViewSet(ModelViewSet):
    serialiser_class = RoleSerializer
    queryset = Role.objects.all()

class PermissionViewSet(ModelViewSet):
    serializer_class = PermissionSerializer
    queryset = Permission.objects.all()

class Utilisateur_roleViewSet(ModelViewSet):
    serializer_class = Utilisateur_roleSerializer
    queryset = Utilisateur_role.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST' or self.request.method == 'PUT':
            return Utilisateur_roleWriteSerializer
        else:
            return Utilisateur_roleSerializer

class Role_permissionViewSet(ModelViewSet):
    serializer_class = Role_permissionSerializer
    queryset = Role_permission.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST' or self.request.method == 'PUT':
            return Role_permissionWriteSerializer
        else:
            return Role_permissionSerializer
