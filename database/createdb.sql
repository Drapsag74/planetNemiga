DROP DATABASE IF EXISTS planetNemiga;
CREATE DATABASE planetNemiga;

\c planetNemiga;

CREATE SCHEMA monde;

CREATE TABLE monde.personnages (
	
	classe VARCHAR PRIMARY KEY,
	sexe VARCHAR
);

INSERT INTO monde.personnages VALUES('Gaspard the god', 'homme');
INSERT INTO monde.personnages VALUES('Eddy la tchoin', 'indéfinie');

