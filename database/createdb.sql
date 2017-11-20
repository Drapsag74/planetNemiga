DROP DATABASE IF EXISTS planetNemiga;
CREATE DATABASE planetNemiga;

\c planetNemiga;

CREATE SCHEMA monde;

CREATE TABLE monde.personnages (

	classe VARCHAR PRIMARY KEY,
	sexe VARCHAR,
	image VARCHAR
);

INSERT INTO monde.personnages VALUES('Gaspard the god', 'homme','/images/logo.png');
INSERT INTO monde.personnages VALUES('Eddy la tchoin', 'indéfinie','/images/logo.png');
INSERT INTO monde.personnages VALUES('Clery','homme','/images/logo.png');
INSERT INTO monde.personnages VALUES('Zak la menace', 'homme','/images/logo.png');
INSERT INTO monde.personnages VALUES('mathcatch', 'indéfinie','/images/logo.png');
INSERT INTO monde.personnages VALUES('sachatouille','homme/femme','/images/logo.png');
