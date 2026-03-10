**Partie 2 : Audit de sécurité**

On peut voir ci-dessous que lorsque qu'on teste la route POST pour se connecter avec des identifiants corrects l'API nous renvoie un message de succès.

![alt text](image.png)

---

On peut voir ci-dessous que la méthode GET renvoie bien la note où l'id est égal à 1.

![alt text](image-1.png)

---

On peut voir ci-dessous qu'on peut ajouter des notes sous l'identité de qui l'on veut juste en mettant un userId existant.

![alt text](image-2.png)

---

On peut voir ici que cette requête donne en résultat une requête SQL en dur et également donne des informations sur bob, son id, ses notes, etc...

![alt text](image-3.png)

---

On peut voir ci-dessous que cette requête renvoie totus les users (admin + users) et leur informations personnelles (mot de passe, username, mail)

![alt text](image-4.png)

---

**Étape 2.1**

Une connexion normale réussie

![alt text](image-6.png)

--- 
---

Ici il y a le manque d'authentification, on voit ici que l'accès à la route admin est accessible à tous

![alt text](image-5.png)

---
---

Ici on peut voir grâce au requête que les notes privées des tous les utilisateurs.

![alt text](image-7.png)
![alt text](image-8.png)

---
---

Ici on peut voir qu'une requête est visible pour tous ce qui représente une faille dans le code.

![alt text](image-9.png)

---
---

**Partie 3**

