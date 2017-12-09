DROP DATABASE IF EXISTS planetNemiga;
CREATE DATABASE planetNemiga;
DROP DATABASE IF EXISTS "planetNemiga";
CREATE DATABASE "planetNemiga";

\c planetNemiga;
\c "planetNemiga";


CREATE TABLE chapitre(
  titre VARCHAR PRIMARY KEY,
  matiere VARCHAR(5)
);

CREATE TABLE enigme(
  id SERIAL PRIMARY KEY,
  titre VARCHAR(70),
  enonce text,
	nbReponse INTEGER,
	niveauDiff INTEGER
);

CREATE TABLE reponse(
  id SERIAL PRIMARY KEY,
  texte text,
  idEnigme INTEGER REFERENCES enigme(id)
);

CREATE TABLE personnage(
  categorie VARCHAR PRIMARY KEY,
  sexe VARCHAR,
	description text,
  image VARCHAR
);

CREATE TABLE ecole(
	nomEcole VARCHAR,
	codePostal INTEGER,
	ville VARCHAR,
	PRIMARY KEY(nomEcole, codePostal)
);

CREATE TABLE classe(
	id SERIAL PRIMARY KEY,
	nom VARCHAR(20)
);

CREATE TABLE joueur(
  id SERIAL PRIMARY KEY,
	pseudo VARCHAR(15) UNIQUE,
	mail VARCHAR(40),
	motDePasse VARCHAR(50),
	personnage VARCHAR REFERENCES personnage(categorie),
	ecole VARCHAR REFERENCES ecole(nomEcole),
	classe INTEGER REFERENCES classe(id)
);
CREATE TABLE informatique(
	niveau INTEGER PRIMARY KEY
);
CREATE TABLE progression(
	informatique INTEGER REFERENCES informatique(niveau),
	chapitre VARCHAR REFERENCES chapitre(titre),
	joueur INTEGER REFERENCES joueur(id),
	xp INTEGER,
	timestand INTEGER,
	PRIMARY KEY(informatique, chapitre, joueur)
);

INSERT INTO personnage VALUES('Gaspard the god', 'homme','/images/logo.png');
INSERT INTO personnage VALUES('Eddy la tchoin', 'indéfinie','/images/logo.png');
INSERT INTO personnage VALUES('Clery','homme','/images/logo.png');
INSERT INTO personnage VALUES('Zak la menace', 'homme','/images/logo.png');
INSERT INTO personnage VALUES('mathcatch', 'indéfinie','/images/logo.png');
INSERT INTO personnage VALUES('sachatouille','homme','/images/logo.png');


INSERT INTO enigme VALUES(DEFAULT, 'enigme du rois gaspard', 'la meilleur enigme du monde entier');
INSERT INTO personnage VALUES('Gaspard the god', 'homme','/images/logo.png');
INSERT INTO personnage VALUES('Eddy la tchoin', 'indéfinie','/images/logo.png');
INSERT INTO personnage VALUES('Clery','homme','/images/logo.png');
INSERT INTO personnage VALUES('Zak la menace', 'homme','/images/logo.png');
INSERT INTO personnage VALUES('mathcatch', 'indéfinie','/images/logo.png');
INSERT INTO personnage VALUES('sachatouille','homme','/images/logo.png');
