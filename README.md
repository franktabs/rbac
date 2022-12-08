# rbac backend
Système d'autorisation basé sur RBAC

## creation de l'environnement virtuel
creer l'environnement virtuel avec 
###`python -m venv .env`

si vous êtes sur ubuntu taper la commande.\
### `source .env/bin/activate`

sur windows taper la commande.\
### `.\env\Scripts\activate.bat`

## Installer les dépendances

taper la commande.\
###pip install -r requirements.txt

## Faite des migration et migrer la base de données

taper la commande:
###`python manage.py makemigration`
###`python manage.py migrate`

##lancer le serveur
taper la commande
###`python manage.py runserver`
