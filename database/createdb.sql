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

/*
  CREATION de ecoles a partir d'une bdd existante
*/


CREATE TABLE users.ecoles_tmp(
  numero_uai VARCHAR,
	appellation_officielle VARCHAR,
  denomination_principale VARCHAR,
  patronyme_uai VARCHAR,
  secteur_public_prive_libe VARCHAR,
  adresse_uai VARCHAR,
  lieu_dit_uai VARCHAR,
  boite_postale_uai INTEGER,
	code_postal_uai INTEGER,
	localite_acheminement_uai VARCHAR,
  coordonnee_x INTEGER,
  coordonnee_y INTEGER,
  appariement INTEGER,
  localisation VARCHAR,
  nature_uai VARCHAR,
  nature_uai_libe VARCHAR,
  etat_etablissement VARCHAR,
  type VARCHAR,
	PRIMARY KEY(appellation_officielle, code_postal_uai)
);

\copy  users.ecoles_tmp (numero_uai, appellation_officielle, denomination_principale, patronyme_uai, secteur_public_prive_libe, adresse_uai, lieu_dit_uai, boite_postale_uai, code_postal_uai, localite_acheminement_uai, coordonnee_x, coordonnee_y, appariement, localisation, nature_uai, nature_uai_libe,etat_etablissement, type)
FROM 'DEPP-etab-1D2D.csv' DELIMITER ';' HEADER CSV ;

ALTER TABLE users.ecoles_tmp DROP COLUMN numero_uai;
ALTER TABLE users.ecoles_tmp DROP COLUMN patronyme_uai;
ALTER TABLE users.ecoles_tmp DROP COLUMN secteur_public_prive_libe;
ALTER TABLE users.ecoles_tmp DROP COLUMN adresse_uai;
ALTER TABLE users.ecoles_tmp DROP COLUMN lieu_dit_uai;
ALTER TABLE users.ecoles_tmp DROP COLUMN boite_postale_uai;
ALTER TABLE users.ecoles_tmp DROP COLUMN coordonnee_x;
ALTER TABLE users.ecoles_tmp DROP COLUMN coordonnee_y;
ALTER TABLE users.ecoles_tmp DROP COLUMN appariement;
ALTER TABLE users.ecoles_tmp DROP COLUMN localisation;
ALTER TABLE users.ecoles_tmp DROP COLUMN nature_uai;
ALTER TABLE users.ecoles_tmp DROP COLUMN nature_uai_libe;
ALTER TABLE users.ecoles_tmp DROP COLUMN etat_etablissement;
ALTER TABLE users.ecoles_tmp DROP COLUMN type;

DELETE FROM users.ecoles_tmp WHERE denomination_principale != 'COLLEGE' OR denomination_principale != 'COLLEGE PRIVE';

CREATE TABLE users.ecoles(
  nomEcole VARCHAR,
  codePostal INTEGER,
  ville VARCHAR,
  PRIMARY KEY (nomEcole, codePostal)
);

INSERT INTO users.ecoles(nomEcole, codePostal, ville)
SELECT appellation_officielle, code_postal_uai, localite_acheminement_uai FROM users.ecoles_tmp;

DROP TABLE users.ecoles_tmp;

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
