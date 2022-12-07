from copy import deepcopy

from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import *
# Create your views here.


class UtilisateurViewSet(ModelViewSet):
    serializer_class = UtilisateurSerializer
    queryset = Utilisateur.objects.all()

    def create(self, req: HttpRequest, *args, **kwargs):
        utilisateur_test = self.serializer_class(data=req.data)
        utilisateur_test.is_valid(raise_exception=True)
        datas = deepcopy(req.data)
        datas["password"] = make_password(datas["password"])
        utilisateur = self.serializer_class(data=datas)
        utilisateur.is_valid()
        # user = Utilisateur()
        # user.nom = datas["nom"]
        # user.password = datas["password"]
        # user.age = datas["age"]
        # user.email = datas["email"]
        # user.save()
        utilisateur.save()
        utilisateur = Utilisateur.objects.filter(email=req.data['email'])
        utilisateur_test = self.serializer_class(data=utilisateur, many=True)
        utilisateur_test.is_valid()
        tab = utilisateur_test.data.copy()
        tab[0].pop("password")
        return Response(tab, status=201)


class RoleViewSet(ModelViewSet):
    serializer_class = RoleSerializer
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


@api_view(['POST'])
def connection(req: HttpRequest):
    user = Utilisateur.objects.filter(email=req.data['email'])
    print("\t\n l'utilisateur nom est ", user[0].nom, "\n\n\n")
    valider = False

    if (user):
        rUser = UtilisateurSerializer(user, many=True)
        # print("\t\n user.data est  ", user.data, "\n\n\n")
        for i in user:
            print("\t\n i est ", i, "\n\n\n")
            valider = check_password(req.data['password'], i.password)
            print("\t\n valider est ", valider, "\n\n\n")

    if (valider):
        tab = rUser.data.copy()
        tab[0].pop("password")
        return Response(tab, 200)
    else:
        tab = [{"operation": "error"}]
        return Response(tab, 400)
