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
