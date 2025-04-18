# Get-it-or-Not

Une application de feedback en temps réel pour la salle de classe permettant aux étudiants d'indiquer s'ils comprennent le contenu présenté. Cette application se compose de deux parties : une interface professeur et une interface étudiant.

## Aperçu

Get-it-or-Not est conçu pour améliorer l'interaction en classe en offrant un moyen simple aux étudiants de donner un retour au professeur en temps réel. Les étudiants peuvent indiquer s'ils comprennent le contenu en cliquant sur les boutons "Compris" ou "Pas compris".

## Fonctionnalités

- Communication en temps réel utilisant Socket.IO
- Tableau de bord pour le professeur affichant les retours des étudiants
- Interface étudiant avec boutons de feedback simples
- Fonctionnalité de chat pour des questions supplémentaires
- Application de bureau basée sur Electron pour les étudiants
- Interface web pour les professeurs

## Technologies utilisées

- **Frontend** : React.js, HTML5, CSS3
- **Backend** : Node.js, Express.js
- **Communication en temps réel** : Socket.IO
- **Application de bureau** : Electron
- **Rendu de texte** : Marked (pour le formatage Markdown)

## Structure du projet

- `prof + server/` : Contient l'interface professeur et le code serveur
- `élèves/` : Contient l'interface étudiant (application Electron)

## Installation

### Serveur et Interface Professeur

```bash
cd "prof + server"
npm install
```

### Interface Étudiant

```bash
cd élèves
npm install
```

## Lancement de l'application

### Démarrer le serveur

```bash
cd "prof + server"
npm run server
```

Le serveur démarrera sur le port 3010 par défaut.

### Ouvrir l'interface professeur

Ouvrez `prof.html` dans un navigateur web après avoir démarré le serveur.

### Démarrer l'application étudiant

```bash
cd élèves
npm start
```

Lorsque l'application démarre, entrez l'adresse du serveur (par exemple, `http://localhost:3010`) et votre nom pour vous connecter.

## Utilisation

1. Le professeur ouvre l'interface professeur dans un navigateur
2. Les étudiants démarrent l'application Electron et se connectent au serveur
3. Les étudiants peuvent cliquer sur "Compris" ou "Pas compris" pour indiquer leur compréhension
4. Le professeur peut voir les retours en temps réel de tous les étudiants connectés

## Auteur

Antonin Picard

## Licence

ISC
