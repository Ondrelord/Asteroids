class preloadScene extends Phaser.Scene
{
	constructor() 
	{
		super({key: "preloadScene"});
	}
	
	preload()
	{
		// ships
		this.load.image('playerShip', 'assets/Ship5.png');
		this.load.image('enemyShip1', 'assets/Ship1.png');
		this.load.image('enemyShip2', 'assets/Ship2.png');
		this.load.image('enemyShip3', 'assets/Ship3.png');
		
		// bullets
		this.load.image('bullet', 'assets/shot5_asset.png');
		this.load.image('enemyBullet', "assets/Bomb_02_1.png");

		// background
		this.load.image("bStars", "assets/blueStars.png");
		this.load.image("yStars", "assets/yellowStars.png");
		this.load.image("BStars", "assets/bigStars.png");
		
		// particle
		this.load.image("expParticle", "assets/Explosion_01.png");
		this.load.image("exp2Particle", "assets/Explosion3_1.png");

		// pickups
		this.load.image("pickupLife", "assets/HP_Bonus.png");
		this.load.image("pickupWeapon", "assets/Rockets_Bonus.png");

		// asteroids
		this.load.image("bigMeteor", "assets/Meteor_06.png");
		this.load.image("midMeteor", "assets/Meteor_03.png");
		this.load.image("smlMeteor", "assets/Meteor_04.png");

		// buttons
		this.load.image("startButton", "assets/Start_BTN.png");
		
	}

	create()
	{
		this.scene.start('menuScene');
	}
}