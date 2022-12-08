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

    def get_serializer_class(self):
        if self.request.method == 'POST' or self.request.method == 'PUT':
            return UtilisateurWriteSerializer
        else:
            return UtilisateurSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        tab = serializer.data.copy()
        for i in tab:
            if i["password"]:
                i.pop("password")
        return Response(tab, 201)

    def create(self, req: HttpRequest, *args, **kwargs):
        utilisateur_test = self.get_serializer(data=req.data)
        utilisateur_test.is_valid(raise_exception=True)
        datas = deepcopy(req.data)
        datas["password"] = make_password(datas["password"])
        utilisateur = self.get_serializer(data=datas)
        utilisateur.is_valid()
        # user = Utilisateur()
        # user.nom = datas["nom"]
        # user.password = datas["password"]
        # user.age = datas["age"]
        # user.email = datas["email"]
        # user.save()
        utilisateur.save()
        utilisateur = Utilisateur.objects.filter(email=req.data['email'])
        utilisateur_test = UtilisateurSerializer(utilisateur, many=True)
        # utilisateur_test.is_valid()
        tab = utilisateur_test.data.copy()
        tab[0].pop("password")
        return Response(tab, status=201)


class RoleViewSet(ModelViewSet):
    serializer_class = RoleSerializer
    queryset = Role.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST' or self.request.method == 'PUT':
            return RoleWriteSerializer
        else:
            return RoleSerializer


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


def utilisateurCall(module):
    client = Utilisateur.objects.filter(statut=module)
    if client:
        client = UtilisateurSerializer(client, many=True)
        tab = client.data.copy()
        for i in tab:
            if i["password"]:
                i.pop("password")
        return Response(tab, 201)
    else:
        return Response([{"operation": "erro"}], 400)


@api_view(["PUT"])
def newPasswordView(req: HttpRequest, *args, **kwargs):
    utilisateur = Utilisateur.objects.filter(id=kwargs["id"])
    for i in utilisateur:
        i.password = req.data["password"]
    serializer = UtilisateurWriteSerializer(data=utilisateur[0])
    serializer.is_valid()

    for i in utilisateur:
        i.password = make_password(req.data["password"])
    utilisateur[0].save()
    print('req\n\n', req.data["password"], "\n\n")

    return Response([{"operation": "ok"}], 201)


@api_view(["PUT"])
def blocageView(req: HttpRequest, *args, **kwargs):
    utilisateur = Utilisateur.objects.filter(id=kwargs["id"])
    for i in utilisateur:
        i.bloque = req.data["bloque"]
    serializer = UtilisateurWriteSerializer(data=utilisateur[0])
    serializer.is_valid()
    print('utilisateur\n\n', utilisateur[0].bloque, "\n\n")
    utilisateur[0].save()
    return Response([{"operation": "ok"}], 201)


@api_view(["GET"])
def clientView(req: HttpRequest):
    return utilisateurCall("client")


@api_view(["GET"])
def employeView(req: HttpRequest):
    return utilisateurCall("employe")


@api_view(['POST'])
def connectionView(req: HttpRequest):
    valider = False
    if (req.data["email"]):
        user = Utilisateur.objects.filter(email=req.data['email'])
        if user:
            print("\t\n l'utilisateur nom est ", user[0].nom, "\n\n\n")

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
