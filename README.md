# Escape The Picture

Escape The Picture est un escape game web immersif où chaque salle propose une énigme interactive autour de l’art et de la découverte. Le joueur doit résoudre des puzzles visuels, des jeux de couleurs et des défis logiques pour progresser et révéler l’histoire cachée derrière un mystérieux autoportrait.

## Histoire

Vous êtes plongé dans un musée virtuel où chaque tableau cache un secret. Un autoportrait énigmatique attire votre attention : pour en percer le mystère, il faudra explorer, manipuler les couleurs, décrypter des indices et faire preuve d’observation. Chaque salle vous rapproche de la vérité sur l’artiste et son œuvre, mais le chemin est semé d’énigmes et de surprises…

L’aventure est conçue pour être universelle : chaque joueur peut imaginer sa propre histoire autour du tableau et des énigmes, laissant place à la créativité et à la découverte.

## Présentation de l’application

L’application propose plusieurs salles (rooms), chacune avec ses propres énigmas :

- **Salle 1** : Découverte d’un autoportrait à travers des mécanismes de révélation d’image, de mélange de couleurs et de décryptage de nom d’artiste façon Motus/Tusmo.
- **Salle 2** (à venir) : Nouvelles énigmes et mécaniques, réutilisant la structure modulaire.

Chaque énigme est conçue pour être intuitive, visuelle et accessible, avec une progression guidée et des feedbacks interactifs.

## Architecture et technologies

- **Angular 18+** : Application SPA moderne, composants standalone, gestion des routes et du state.
- **Signals** : Utilisation des signals pour la réactivité et le suivi d’état des énigmes.
- **SCSS** : Styles modulaires, responsive, animations, conversion systématique des unités en rem.
- **Modularité** : Composants partagés pour le header, le footer, la navigation et les boutons globaux (recommencer, réinitialiser énigme).
- **Développement** : Bouton dev discret pour auto-solve chaque énigme pendant les tests.
- **Extensibilité** : Architecture pensée pour ajouter facilement de nouvelles salles et énigmes.

## Lancer le projet

```bash
npm install
npm start
```

Accédez à l’application sur [http://localhost:4200](http://localhost:4200).

## Structure des dossiers

- `src/app/rooms/` : Composants et styles des salles
- `src/app/shared/` : Header, footer, composants réutilisables
- `src/assets/` : Images et ressources graphiques
- `src/app/services/` : Gestion du state et logique de progression

## Contribuer

Les contributions sont les bienvenues ! L’architecture modulaire permet d’ajouter facilement de nouvelles salles, énigmes ou mécaniques de jeu. N’hésitez pas à proposer des idées ou à ouvrir des issues.
