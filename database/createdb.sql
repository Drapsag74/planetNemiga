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
	niveauDiff INTEGER,
	chapitre VARCHAR REFERENCES challenges.chapitres(titre)
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
	nom VARCHAR(20),
	nomEcole VARCHAR,
	codePostal INTEGER,
	FOREIGN KEY(nomEcole, codePostal) REFERENCES users.ecoles(nomEcole, codePostal)
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
	chapitre VARCHAR REFERENCES challenges.chapitres(titre),
	joueur INTEGER REFERENCES users.joueurs(id),
	xp INTEGER,
	timestand INTEGER,
	PRIMARY KEY(chapitre, joueur)
);

           . Grâce à ça, il est rapide et sais comment gagner du temps dans la ville. Il pourra donc peut-être t''aider à
INSERT INTO users.personnages VALUES('Timix', 'indefini','<p>Description : <br> Timix a vécut dans la rue depuis qu''il est petit. Il a pu acquérir une agilité incroyable
         gagner du temps pour certaines énigmes. </p>','/images/avatarTimix.png');
INSERT INTO users.personnages VALUES('Infobot', 'homme','<p>Description : <br> InfoBot a été créé par Docteur Bronx, il fut le premier robot capable de pouvoir programmer ses propres code informatique <br>
           Il s''améliore de jour en jour dans la programmation et réalise même des programmes pour se perfectionner lui même.
           <br> Il pourra peut-être vous aider en informatique. </p>','/images/avatar_tali.png');
