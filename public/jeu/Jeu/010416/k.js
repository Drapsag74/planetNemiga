
var jeu = {

		preload : function() {
		game.load.image('joueur', 'assets/vaisseau3.png');
		game.load.image('balleennemi', 'assets/balle.png');
		game.load.image('carre', 'assets/carre.png');
		game.load.image('balle', 'assets/vert.png');
		game.load.image('fond', 'assets/fond.png');
		game.load.image('cercle', 'assets/cercle.png');
		game.load.image('canon', 'assets/canon2.png');
		game.load.image('canone', 'assets/canon3.png');
		game.load.image('wallh', 'assets/walllighth.png');
		game.load.image('wallv', 'assets/walllightv.png');
		game.load.image('ennemi', 'assets/ennemi.png');
		game.load.spritesheet('explosion', 'assets/explosion.png', 65, 65, 25);
		game.load.audio('tir', 'assets/tir.mp3');
    game.load.audio('tirennemi', 'assets/tirennemi.mp3');
    game.load.audio('ambiance', 'assets/ambiance.mp3');
		game.load.audio('explosion', 'assets/explosionennemi.mp3');
	},
	lire : function() {
		if (this.relire == true){
			jeu.action = true;
			this.relire = false;
			texte = editor.getValue();



			try {
    eval(texte);
} catch (e) {
    if (e instanceof SyntaxError) {
        alert(e.message);
    }

		if (e instanceof ReferenceError) {
        alert(e.message);
    }
		if (e instanceof TypeError) {
        alert(e.message);
    }
}
			console.log(this.delai);
			jeu.enjeu = true;
			setTimeout('(jeu.fininstru())', jeu.delai +1000);
			setTimeout(function() {
				this.enjeu = false;
			}, jeu.delai +1000);
		}

	},

	reenvoyer : function() {
		this.relire = true;
	},

	fininstru : function(){
		jeu.fin = true;
	},

	mort : function(){
		this.mort = true
	},

	touche : function(balle) {
		if (game.physics.arcade.overlap(balle, this.ennemi)==true){
			balle.kill();
			console.log("ok");
		}
	},
	explosion : function(x,y){
		explo = game.add.sprite(x,y,'explosion');
		explo.scale.setTo(1);
		explo.anchor.set(0.5,0.5);
		explo.animations.add('boom',[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25], 24, false);
		explo.animations.play('boom', false,true);
		setTimeout(function() {explo.destroy();},1000);


	},


	createEnnemi : function (){
		for (var i = 0; i < 8; i++)
        {
						var x = game.world.randomX;
						var y = game.world.randomY;
            var ennemi = this.mem.create(x, y, 'ennemi');
						ennemi.tour = game.add.sprite(x, y, 'canone');
						ennemi.tour.anchor.set(0.5, 0.5);
            ennemi.tour.scale.setTo(0.1, 0.1);
						ennemi.vie = 100;
            ennemi.anchor.set(0.5, 0.5);
            ennemi.scale.setTo(0.1, 0.1);
            ennemi.body.moves = false;
        }
	},
	tirEnnemi : function() {
		if (game.time.now > jeu.tirsuivantEnnemi)
		{
			balleennemi = jeu.balleEnnemi.getFirstExists(false);
			jeu.ennemiVivant.length = 0;

    	jeu.mem.forEachAlive(function(ennemi){
       jeu.ennemiVivant.push(ennemi);
    });
    if (balleennemi && jeu.ennemiVivant.length > 0)
    {
				this.shootennemi.play("", 0, 0.1);
        random =game.rnd.integerInRange(0,jeu.ennemiVivant.length-1);
        tireur = jeu.ennemiVivant[random].tour;
        balleennemi.reset(tireur.x, tireur.y);
        game.physics.arcade.moveToObject(balleennemi,jeu.joueur,400);
        jeu.tirsuivantEnnemi = game.time.now + 1500;
    }
			}
		},
		tir : function (){
			if (game.time.now > this.tirsuivant)
	    {
				balle = this.balle.getFirstExists(false);
				if(balle){
					jeu.shoot.play("",0,0.3);
					this.munition = this.munition -1 ;
					balle.reset(this.canon.x, this.canon.y);
					game.physics.arcade.moveToPointer(balle, 400);
					this.tirsuivant = game.time.now + 300;
					game.world.bringToTop(jeu.canon);
				}
	    }
		},
		collisionEnnemi : function(balle, ennemi){
			if(this.enjeu == true){
				balle.kill();
				ennemi.vie = ennemi.vie - 25;

				if (ennemi.vie<=0){
					this.explosion(ennemi.x, ennemi.y);
					this.explosionson.play("", 0, 0.8);
					this.score = this.score +100;
					ennemi.destroy();
					ennemi.tour.destroy();
				}
			}


		},
		collisionvaisseau : function(vaisseau, balle){
			if(this.enjeu == true){
				balle.kill();
				this.vie = this.vie - 10;
			}
		},

		collisionmem : function(vaisseau, ennemi){
				this.vie = -10;
		},
		collisionmur : function(){
			if (this.enjeu == true){
			if (this.mur == false){
				console.log("mur");
				this.vie = -10;
				this.mur = true;
			}
		}

	},

	gagne : function() {
			alert("Félicitations vous avez gagner le niveau avec un score de " + this.score);
	},

	create : function() {
		//Chargement de la physique du jeu
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.world.enableBody = true;
		this.shoot = game.add.audio('tir');
		this.explosionson = game.add.audio('explosion');
		this.shootennemi = game.add.audio('tirennemi');
		this.ambiance = game.add.audio('ambiance');
		this.ambiance.play("",20, 0.5, true);

		//chargement de la map
		this.fond = game.add.sprite(0,0,'fond')
		this.tiles = game.add.group();
		tile = game.add.sprite(0,400, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(0,300, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(100,400, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(100,300, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(200,400, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(200,200, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(300,300, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(300,200, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(200,100, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(200,100, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(300,100, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(400,100, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(500,100, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(300,200, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(400,200, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(500,200, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(400,300, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(500,300, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(400,400, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(400,500, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(400,500, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(500,500, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(600,500, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(700,500, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(500,400, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(600,400, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(800,300, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(900,300, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(600,200, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(500,200, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(600,100, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(700,100, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(800,100, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(800,200, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(700,200, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(700,300, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(800,400, 'wallv');
		this.tiles.add(tile);
		tile = game.add.sprite(800,400, 'wallh');
		this.tiles.add(tile);
		tile = game.add.sprite(900,400, 'wallh');
		this.tiles.add(tile);


		//arrivée
		this.arrivee = game.add.sprite(950,355, 'cercle');
		this.arrivee.scale.setTo(0.5,0.5);
		this.arrivee.anchor.set(0.5,0.5);
		this.arrivee.enableBody = true;
    this.arrivee.physicsBodyType = Phaser.Physics.ARCADE;

		//chargement du joueur+canon
		this.joueur = this.game.add.sprite(50,350, 'joueur');
		this.joueur.scale.setTo(0.1,0.1);
		this.joueur.anchor.set(0.5,0.5);
		this.joueur.body.collideWorldBounds = true;
		this.vie = 100;

		this.canon = game.add.sprite(0,350,'canon');
		this.canon.scale.setTo(0.1,0.1);
		this.canon.anchor.set(0.5,0.5);

		//ennemis
		this.mem = game.add.group();
    this.mem.enableBody = true;
    this.mem.physicsBodyType = Phaser.Physics.ARCADE;
		this.createEnnemi();

		//balle
		this.balle = game.add.group();
		this.balle.enableBody = true;
    this.balle.physicsBodyType = Phaser.Physics.ARCADE;
    this.balle.createMultiple(20, 'balle');
    this.balle.setAll('anchor.x', 0.5);
    this.balle.setAll('anchor.y', 0.5);
		this.balle.setAll('scale.x', 0.1);
		this.balle.setAll('scale.y', 0.1);
    this.balle.setAll('outOfBoundsKill', true);
    this.balle.setAll('checkWorldBounds', true);

		this.balleEnnemi = game.add.group();
		this.balleEnnemi.enableBody = true;
    this.balleEnnemi.physicsBodyType = Phaser.Physics.ARCADE;
    this.balleEnnemi.createMultiple(20, 'balleennemi');
    this.balleEnnemi.setAll('anchor.x', 0.5);
    this.balleEnnemi.setAll('anchor.y', 0.5);
		this.balleEnnemi.setAll('scale.x', 0.05);
		this.balleEnnemi.setAll('scale.y', 0.05);
    this.balleEnnemi.setAll('outOfBoundsKill', true);
    this.balleEnnemi.setAll('checkWorldBounds', true);

		//variable d'�tat du jeu
		this.fin = false;
		this.gagne = false;
		this.relire = true;
		this.delai = 1000;
		this.niveau = 1;
		this.tirsuivant = -100;
		this.tirsuivantEnnemi = 2000;
		this.ennemiVivant = [];
		this.i = 1;
		this.vie = 100;
		this.enjeu = false;
		jeu.action = false;
		this.munition = 50;
		this.mur = false;
		this.score = 0;


		//ennemi


	},
	update : function(){

		this.canon.x = this.joueur.x;
		this.canon.y = this.joueur.y;
		this.canon.rotation = game.physics.arcade.angleToPointer(this.canon);

		this.mem.forEachAlive(function(ennemi){
			ennemi.rotation = game.physics.arcade.angleBetween(ennemi, jeu.joueur);
			ennemi.tour.rotation = ennemi.rotation;
    });

		game.physics.arcade.overlap(this.balle, this.mem, this.collisionEnnemi, null, this);
		game.physics.arcade.overlap(this.balleEnnemi, this.joueur, this.collisionvaisseau, null, this);
		game.physics.arcade.overlap(this.tiles, this.joueur, this.collisionmur, null, this);

		if (game.physics.arcade.overlap(this.joueur, this.arrivee)){
			alert("Félicitations vous avez gagner le niveau avec un score de " + this.score);
		}

		if(this.fin == true){
			alert("Dommage, retente ta chance");
			this.mur = false;
			this.enjeu = false;
			this.fin = false;
			this.joueur.x = 50;
			this.joueur.y = 350;
			this.joueur.angle = 0;
			this.canon.x = this.joueur.x+10;
			this.canon.y = this.joueur.y;
			this.relire = true;
			this.delai = 0;
		}

		if((this.fin == true && this.vie < 0) || this.vie < 0){

			jeu.enjeu = false;
			jeu.action = false;
			jeu.vie = 100;
			alert("T'as ruiné le vaisseau");
			setTimeout(function (){
				jeu.explosion(jeu.joueur.x, jeu.joueur.y)
			}, 3000);

			setTimeout(function() {
				this.mur = false;
				jeu.joueur.x = 50;
				jeu.joueur.y = 350;
				jeu.joueur.angle = 0;
				jeu.canon.x = jeu.joueur.x+10;
				jeu.canon.y = jeu.joueur.y;
				jeu.relire = true;
				jeu.delai = 0;
			},4000);
		}



		if (game.input.activePointer.isDown && jeu.enjeu == true)
    {
        this.tir();
    }

		if (game.time.now > this.tirsuivantEnnemi && jeu.enjeu == true)
        {
            this.tirEnnemi();
        }

 		game.debug.text('Votre vie : ' + this.vie, 50, 30);
		game.debug.text('Vos munitions : ' + this.munition, 50, 50);
		game.debug.text('Score : ' + this.score, 50, 70);

	}


};

var player = {

	munition : function(){
		if (jeu.munition < 50){
			reste = jeu.munition;
			jeu.munition = jeu.munition + (50 - reste) ;
		}
	},
	avancer : function() {
		if(jeu.action == true){
			setTimeout(function () {
				if(jeu.joueur.angle != 0){
					tweenRotation = game.add.tween(jeu.joueur).to({angle : 0}, 500, "Linear", false);
					tweenAvancer = game.add.tween(jeu.joueur.body).to({x : jeu.joueur.body.x + 100}, 1000, "Linear", false);
					tweenRotation.chain(tweenAvancer);
					tweenRotation.start();
				}

				else {
					tweenAvancer = game.add.tween(jeu.joueur.body).to({x : jeu.joueur.body.x + 100}, 1000, "Linear", false);
					tweenAvancer.start();
				}}, jeu.delai);
				jeu.delai = jeu.delai + 1600;
		}

	},

	reculer : function() {
		if(jeu.action == true){
			setTimeout(function () {
				if(jeu.joueur.angle != -180){
					tweenRotation = game.add.tween(jeu.joueur).to({angle : -180}, 500, "Linear", false);
					tweenAvancer = game.add.tween(jeu.joueur.body).to({x : jeu.joueur.body.x - 100}, 1000, "Linear", false);
					tweenRotation.chain(tweenAvancer);
					tweenRotation.start();
				}

				else {
					tweenAvancer = game.add.tween(jeu.joueur.body).to({x : jeu.joueur.body.x + 100}, 1000, "Linear", false);
					tweenAvancer.start();
				}}, jeu.delai);
				jeu.delai = jeu.delai + 1600;
		}

	},

	monter : function() {
		if(jeu.action == true){
			setTimeout(function () {
				if(jeu.joueur.angle != -90){
					tweenRotation = game.add.tween(jeu.joueur).to({angle : -90}, 500, "Linear", false);
					tweenAvancer = game.add.tween(jeu.joueur.body).to({y : jeu.joueur.body.y - 100}, 1000, "Linear", false);
					tweenRotation.chain(tweenAvancer);
					tweenRotation.start();
				}

				else {
					tweenAvancer = game.add.tween(jeu.joueur.body).to({y : jeu.joueur.body.y - 100}, 1000, "Linear", false);
					tweenAvancer.start();
				}}, jeu.delai);
				jeu.delai = jeu.delai + 1600;
		}

	},

	descendre : function() {
		if(jeu.action == true){
			setTimeout(function () {
				if(jeu.joueur.angle != 90){
					tweenRotation = game.add.tween(jeu.joueur).to({angle : 90}, 500, "Linear", false);
					tweenAvancer = game.add.tween(jeu.joueur.body).to({y : jeu.joueur.body.y + 100}, 1000, "Linear", false);
					tweenRotation.chain(tweenAvancer);
					tweenRotation.start();
				}

				else {
					tweenAvancer = game.add.tween(jeu.joueur.body).to({y : jeu.joueur.body.y + 100}, 1000, "Linear", false);
					tweenAvancer.start();
				}}, jeu.delai);
				jeu.delai = jeu.delai + 1600;
			}
		}


};


var game = new Phaser.Game(1000, 700, Phaser.AUTO , "jeu");
game.state.add('jeu', jeu);
game.state.start('jeu');
