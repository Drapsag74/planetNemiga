DROP DATABASE IF EXISTS "planetNemiga";
CREATE DATABASE "planetNemiga";

\c "planetNemiga";

CREATE SCHEMA users;
CREATE SCHEMA challenges;

CREATE TABLE challenges.chapitres (
	titre varchar PRIMARY KEY,
	matiere varchar
);

CREATE TABLE challenges.enigmes (
	id SERIAL PRIMARY KEY,
	titre varchar,
	enonce text

);

CREATE TABLE challenges.reponses (
	id SERIAL PRIMARY KEY,
	texte text,
	idEnigme integer REFERENCES challenges.enigmes(id)
);

insert into challenges.enigmes VALUES(1,'Le télésiège','Les sièges d un télésiège sont régulièrement espacés et numérotés dans l''ordre à partir de 1.

Lorsque la place 13 croise la place 25 alors le siège 46 croise le 112.

Quel est le nombre de sièges au total ?');
insert into challenges.reponses VALUES(1,'120',1);

insert into challenges.enigmes VALUES (2,'Les maisons','Sur le chemin pour aller au supermarché, vous comptez 20 maisons sur votre droite et au retour, vous en dénombrez 20 sur votre gauche.

Combien y a t-il de maisons en tout ?');

insert into challenges.reponses VALUES(2,'20',2);
