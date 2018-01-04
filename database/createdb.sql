DROP DATABASE IF EXISTS "planetNemiga";
CREATE DATABASE "planetNemiga";

\c "planetNemiga";

CREATE SCHEMA users;
CREATE SCHEMA challenges;

CREATE TABLE challenges.chapitres(
  titre VARCHAR PRIMARY KEY,
  matiere VARCHAR(5)
);

CREATE TABLE challenges.enigmes(
  id SERIAL PRIMARY KEY,
  titre VARCHAR(70),
  enonce text,
	nbReponse INTEGER,
	niveauDiff INTEGER
);


CREATE TABLE challenges.reponses(
  id SERIAL PRIMARY KEY,
  texte text,
  idEnigme INTEGER REFERENCES challenges.enigmes(id)
);

CREATE TABLE users.personnages(
  categorie VARCHAR PRIMARY KEY,
  sexe VARCHAR,
	description text,
  image VARCHAR
);



CREATE TABLE users.ecoles(
  nomEcole VARCHAR,
  codePostal INTEGER,
  ville VARCHAR,
  PRIMARY KEY (nomEcole, codePostal)
);

INSERT INTO users.ecoles(nomEcole, codePostal, ville) VALUES ('Champollion',38000, 'Grenoble');
INSERT INTO users.ecoles(nomEcole, codePostal, ville) VALUES ('Stendhal',38000, 'Grenoble');
INSERT INTO users.ecoles(nomEcole, codePostal, ville) VALUES ('Bayard',38000, 'Grenoble');
INSERT INTO users.ecoles(nomEcole, codePostal, ville) VALUES ('Fantin Latour',38000, 'Grenoble');
INSERT INTO users.ecoles(nomEcole, codePostal, ville) VALUES ('Jules Flandrin',38700, 'Corenc');


CREATE TABLE users.classes(
	id SERIAL PRIMARY KEY,
	nom VARCHAR(20)
);

CREATE TABLE users.joueurs(
  id SERIAL PRIMARY KEY,
	pseudo VARCHAR(15) UNIQUE,
	mail VARCHAR(40) UNIQUE,
	motDePasse VARCHAR,
	personnage VARCHAR REFERENCES users.personnages(categorie),
	nomEcole VARCHAR,
	codePostal INTEGER,
	classe INTEGER REFERENCES users.classes(id),
	FOREIGN KEY(nomEcole, codePostal) REFERENCES users.ecoles(nomEcole, codePostal)
);

CREATE TABLE challenges.informatiques(
	niveau INTEGER PRIMARY KEY
);

CREATE TABLE users.progressions(
	informatique INTEGER REFERENCES challenges.informatiques(niveau),
	chapitre VARCHAR REFERENCES challenges.chapitres(titre),
	joueur INTEGER REFERENCES users.joueurs(id),
	xp INTEGER,
	timestand INTEGER,
	PRIMARY KEY(informatique, chapitre, joueur)
);

INSERT INTO users.personnages VALUES('Gaspard the god', 'homme','/images/logo.png');
INSERT INTO users.personnages VALUES('Eddy la tchoin', 'indéfinie','/images/logo.png');
INSERT INTO users.personnages VALUES('Clery','homme','/images/logo.png');
INSERT INTO users.personnages VALUES('Zak la menace', 'homme','/images/logo.png');
INSERT INTO users.personnages VALUES('mathcatch', 'indéfinie','/images/logo.png');
INSERT INTO users.personnages VALUES('sachatouille','homme','/images/logo.png');
