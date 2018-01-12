(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var game = new Phaser.Game(1200,700, Phaser.AUTO,  'phaser-example', { preload: preload, create: create, update: update });
var player = {
		image:0,
		avancer : function() {
			player.image.body.moveTo(5000, 10000, player.image.angle);
			startTime = game.time.time;
			duration = 0;
		},
		tournerG : function() {
			player.image.angle -= 4;
		},
		tournerD : function() {
			player.image.angle += 4;
		},
		recupTexte : function() {

		  var engine = esper({


		  });
			var texte = editor.getValue();
			engine.addGlobal('player', player);
			engine.load(texte);
		  var result = engine.runSync();
		}

	};


	function preload() {
	game.load.image('joueur', 'vaisseausprite.png');

	}
	function create() {
	player.image = game.add.sprite(0,350, 'joueur');
  player.image.scale.setTo(0.2,0.2);
  player.image.anchor.set(0.5,0.5);
  game.physics.enable(player.image, Phaser.Physics.ARCADE);
  touche = game.input.keyboard.createCursorKeys();
}

  function update() {


    player.image.body.velocity.x = 0;
    player.image.body.velocity.y = 0;


    /*else
    {
        if (currentSpeed > 0)
        {
            currentSpeed -= 4;
        }
    }

    if (currentSpeed > 0)
    {

    }*/
  }

},{}]},{},[1]);
