\c planetNemiga;

DROP TABLE IF EXISTS monde.enigmes;
CREATE TABLE monde.enigmes (

	id SERIAL PRIMARY KEY,
	matiere varchar,
    chapitre varchar,
    description text,
    dificultee smallint
);

INSERT INTO monde.enigmes VALUES(DEFAULT, 'math', 'chapitreTest', 'ceci est la description d un chapitre de test : In quorum plures ubi uncosque in sub gladii perfusus adduxit ubi Constantio catenis plures deiectos paene parabat perfusus carnifex coopertos gladii meminit Paulus multos quisquam ubi plures quorum quorum actique catenis meminit squalorem enim catenis ita quorum enim atque castra gladii ex squalorem adduxit nullos cruore atque carnifex non uncosque tormenta facile nullos carnifex castra non deiectos adventu atque adduxit uncosque gladii atque haec adduxit ad sub movebantur et haec patratis absolutum in actique et patratis carnifex sub uncosque quorum adduxit adduxit ex carnifex sub tenus is uncosque deiectos carnifex cruore tenus nec ita nec intendebantur quorum uncosque tormenta consumpsere.',
2);
INSERT INTO monde.enigmes VALUES(DEFAULT, 'math', 'chapitreTest', 'ceci est la description d un chapitre de test : In quorum plures ubi uncosque in sub gladii perfusus adduxit ubi Constantio catenis plures deiectos paene parabat perfusus carnifex coopertos gladii meminit Paulus multos quisquam ubi plures quorum quorum actique catenis meminit squalorem enim catenis ita quorum enim atque castra gladii ex squalorem adduxit nullos cruore atque carnifex non uncosque tormenta facile nullos carnifex castra non deiectos adventu atque adduxit uncosque gladii atque haec adduxit ad sub movebantur et haec patratis absolutum in actique et patratis carnifex sub uncosque quorum adduxit adduxit ex carnifex sub tenus is uncosque deiectos carnifex cruore tenus nec ita nec intendebantur quorum uncosque tormenta consumpsere.',
2);
