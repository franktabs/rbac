from django.urls import include, path
from .views import *
from rest_framework import routers


router = routers.SimpleRouter(trailing_slash=False)

router.register('utilisateur/?', UtilisateurViewSet)
router.register('role/?', RoleViewSet)
router.register('permission/?', PermissionViewSet)
router.register('utilisateur_role/?', Utilisateur_roleViewSet)
router.register('role_permission/?', Role_permissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login', connectionView),
    path("clients", clientView),
    path("employe", employeView),
    path("newPassword/<int:id>", newPasswordView),
    path("blocage/<int:id>", blocageView),
]
