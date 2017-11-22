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

CREATE TABLE users.personnages (

	classe VARCHAR PRIMARY KEY,
	sexe VARCHAR,
	image VARCHAR
);



INSERT INTO challenges.enigmes VALUES(DEFAULT, 'enigme du rois gaspard', 'la meilleur enigme du monde entier');
INSERT INTO users.personnages VALUES('Gaspard the god', 'homme','/images/logo.png');
INSERT INTO users.personnages VALUES('Eddy la tchoin', 'indéfinie','/images/logo.png');
INSERT INTO users.personnages VALUES('Clery','homme','/images/logo.png');
INSERT INTO users.personnages VALUES('Zak la menace', 'homme','/images/logo.png');
INSERT INTO users.personnages VALUES('mathcatch', 'indéfinie','/images/logo.png');
INSERT INTO users.personnages VALUES('sachatouille','homme/femme','/images/logo.png');
