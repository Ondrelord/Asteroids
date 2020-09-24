class gameScene extends Phaser.Scene
{
	constructor() 
	{
		super({key: "gameScene"});
		
		// weapons
		this.sideWeapons = false;
		this.rearWeapon = false;

		this.lives = 3;

		this.dead = false;
	}

	preload()
	{
		// input
		this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	}

	create()
	{
		const width = this.scale.width;
		const height = this.scale.height;

		this.livesText = this.add.text(20, 20, 'Lives: ' + this.lives, { font: '18px Courier', fill: '#00ff00' });
		this.livesText.setScrollFactor(0);
		// spawn timers
		this.enemySpawnTimerConfig = {
            delay: 5000,
            loop: true,
            callback: this.spawnEnemies,
            callbackScope: this,
        };
        this.enemySpawnTimer = this.time.addEvent(this.enemySpawnTimerConfig);

    	this.meteorSpawnTimerConfig = {
            delay: 4000,
            loop: true,
            callback: this.spawnMeteors,
            callbackScope: this,
        };
        this.meteorSpawnTimer = this.time.addEvent(this.meteorSpawnTimerConfig);


		// background
		this.bg_bStars = this.add.tileSprite(0.5 * width, 0.5 * height, width, height, 'bStars');
		this.bg_yStars = this.add.tileSprite(0.5 * width, 0.5 * height, width, height, 'yStars');
		this.bg_BStars = this.add.tileSprite(0.5 * width, 0.5 * height, width, height, 'BStars');

		// speed of movement
		this.moveSpeed = 4;

		// groups
		this.EnemyGroup1 = new EnemyShips(this, 1);
		this.EnemyGroup2 = new EnemyShips(this, 2);
		this.EnemyGroup3 = new EnemyShips(this, 3);

		this.BulletGroup = new Bullets(this, 'bullet');
		this.EnemyBulletGroup = new Bullets(this, 'enemyBullet');
		this.EnemyBulletGroup.getChildren().forEach(function(bullet) {
			bullet.radius = 100;
			bullet.scale = 0.1;
		})

		this.PickUpLifeGroup = new PickUps(this, "pickupLife");
		this.PickUpWeaponGroup = new PickUps(this, "pickupWeapon");

		this.BigMeteorGroup = new Meteors(this, "bigMeteor");
		this.MidMeteorGroup = new Meteors(this, "midMeteor");
		this.SmallMeteorGroup = new Meteors(this, "smlMeteor");

		// player
		this.ship = this.physics.add.image(0.5 * width, 0.5 * height, 'playerShip');
		this.ship.setCircle(40, 9, -6);

		// collisions
        this.physics.add.collider(this.BulletGroup, this.EnemyGroup1, this.bulletHitEnemyShipCallback);
        this.physics.add.collider(this.BulletGroup, this.EnemyGroup2, this.bulletHitEnemyShipCallback);
        this.physics.add.collider(this.BulletGroup, this.EnemyGroup3, this.bulletHitEnemyShipCallback);
        this.physics.add.collider(this.BulletGroup, this.BigMeteorGroup, this.bulletHitMeteorCallback);
        this.physics.add.collider(this.BulletGroup, this.MidMeteorGroup, this.bulletHitMeteorCallback);
        this.physics.add.collider(this.BulletGroup, this.SmallMeteorGroup, this.bulletHitMeteorCallback);
        this.physics.add.collider(this.EnemyBulletGroup, this.ship, this.playerHitCallback, ()=>true, this);
        this.physics.add.collider(this.PickUpLifeGroup, this.ship, this.playerPickUpCallback, ()=>true, this);
        this.physics.add.collider(this.PickUpWeaponGroup, this.ship, this.playerPickUpCallback, ()=>true, this);
        this.physics.add.collider(this.BigMeteorGroup, this.ship, this.meteorHitPlayerCallback, ()=>true, this);
        this.physics.add.collider(this.MidMeteorGroup, this.ship, this.meteorHitPlayerCallback, ()=>true, this);
        this.physics.add.collider(this.SmallMeteorGroup, this.ship, this.meteorHitPlayerCallback, ()=>true, this);

		// camera
		this.cameras.main.startFollow(this.ship, true, 0.08, 0.08);

		//looking direction
		this.input.on('pointermove', function (pointer) 
		{
			if (!this.dead)
            	this.ship.rotation = Phaser.Math.Angle.Between(this.ship.x, this.ship.y, this.ship.x + pointer.x - 0.5*width, this.ship.y + pointer.y-0.5*height);
        }, this);

		//bullet spawning / SHOOTING
        this.input.on('pointerdown', function (pointer) 
		{
			if (this.dead)
				return;
			this.BulletGroup.fireBullet(this, this.ship, new Phaser.Math.Vector2(this.ship.x + pointer.x - 0.5*width, this.ship.y + pointer.y-0.5*height));

			if (this.sideWeapons)
			{				
				this.BulletGroup.fireBullet(this, this.ship, new Phaser.Math.Vector2(this.ship.x + pointer.x - 0.5*width, this.ship.y + pointer.y-0.5*height), 30);
				this.BulletGroup.fireBullet(this, this.ship, new Phaser.Math.Vector2(this.ship.x + pointer.x - 0.5*width, this.ship.y + pointer.y-0.5*height), -30);
			}
			if (this.rearWeapon)
			{				
				this.BulletGroup.fireBullet(this, this.ship, new Phaser.Math.Vector2(this.ship.x + pointer.x - 0.5*width, this.ship.y + pointer.y-0.5*height), 180);
			}

        }, this);

        //enemies
        this.EnemyGroup1.spawnShip(Phaser.Math.RND.integerInRange(0,800), Phaser.Math.RND.integerInRange(0,600));

        // particles
        this.explosion = this.add.particles('exp2Particle');
        this.expEmitter = this.explosion.createEmitter(
        {
            lifespan: 2000,
            speed: 50,
            scale: {start: 1, end: 0},
            blendMode: 'ADD',
            on: false
        });
	}


	update(time, delta)
	{
		if (this.dead)
			return;

		// basic movement
		if (this.key_W.isDown)
		{
			// parallax
			this.bg_bStars.tilePositionY -= this.moveSpeed;
			this.bg_yStars.tilePositionY -= 0.5 * this.moveSpeed;
			this.bg_BStars.tilePositionY -= 1.25 * this.moveSpeed;
		
			this.ship.y -= this.moveSpeed;
		}
		if (this.key_S.isDown)
		{
			this.bg_bStars.tilePositionY += this.moveSpeed;
			this.bg_yStars.tilePositionY += 0.5 * this.moveSpeed;
			this.bg_BStars.tilePositionY += 1.25 * this.moveSpeed;
		
			this.ship.y += this.moveSpeed;
		}
		if (this.key_A.isDown)
		{
			this.bg_bStars.tilePositionX -= this.moveSpeed;
			this.bg_yStars.tilePositionX -= 0.5 * this.moveSpeed;
			this.bg_BStars.tilePositionX -= 1.25 * this.moveSpeed;
			
			this.ship.x -= this.moveSpeed;
		}
		if (this.key_D.isDown)
		{
			this.bg_bStars.tilePositionX += this.moveSpeed;
			this.bg_yStars.tilePositionX += 0.5 * this.moveSpeed;
			this.bg_BStars.tilePositionX += 1.25 * this.moveSpeed;
		
			this.ship.x += this.moveSpeed;
		}

		this.bg_bStars.setPosition(this.ship.x, this.ship.y);
		this.bg_yStars.setPosition(this.ship.x, this.ship.y);
		this.bg_BStars.setPosition(this.ship.x, this.ship.y);


		this.livesText.setText("Lives: " + this.lives);
	}

	bulletHitEnemyShipCallback(bullet, ship)
	{
		bullet.disappear();
		if (ship.takeHit())
		{
			if (Phaser.Math.RND.integerInRange(0,10) < 1)
	            ship.scene.PickUpLifeGroup.spawnPickUp(ship.x, ship.y);
	        else if (Phaser.Math.RND.integerInRange(0,10) < 1)
	            ship.scene.PickUpWeaponGroup.spawnPickUp(ship.x, ship.y);
		}
	}

	playerPickUpCallback(ship, pickup)
	{
		switch(pickup.disappear())
		{
			case 1: 
				this.lives += 1;
				break;
			case 2: 
				if (!this.sideWeapons)
					this.sideWeapons = true;
				else
					this.rearWeapon = true;
				break;
		}
	}

	playerHitCallback(ship, bullet)
	{
		bullet.disappear();

		this.respawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.respawn,
            callbackScope: this
        });

        this.disappear();
        this.EnemyBulletGroup.getChildren().forEach(function(bullet) {
			bullet.disappear();
		})

		this.lives -= 1;
		if (this.lives <= 0)
		{
			this.returnToMenu();
		}
	}

	meteorHitPlayerCallback(ship, meteor)
	{
		meteor.disappear(false);

		this.respawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.respawn,
            callbackScope: this
        });

        this.disappear();
        this.EnemyBulletGroup.getChildren().forEach(function(bullet) {
			bullet.disappear();
		})


		this.BigMeteorGroup.getChildren().forEach(function(meteor) {
			if (Phaser.Math.Distance.BetweenPoints(ship, meteor) < 200)
				meteor.disappear(false);
		})

		this.MidMeteorGroup.getChildren().forEach(function(meteor) {
			if (Phaser.Math.Distance.BetweenPoints(ship, meteor) < 200)
				meteor.disappear(false);
		})

		this.SmallMeteorGroup.getChildren().forEach(function(meteor) {
			if (Phaser.Math.Distance.BetweenPoints(ship, meteor) < 200)
				meteor.disappear(false);
		})

		this.lives -= 1;
		if (this.lives <= 0)
		{
			this.returnToMenu();
		}
	}

	bulletHitMeteorCallback(bullet, meteor)
	{
		bullet.disappear();
		meteor.disappear();
	}

	disappear()
    {
        this.expEmitter.explode(25, this.ship.x, this.ship.y);

        this.ship.body.checkCollision.none = true;
        this.ship.setActive(false);
        this.ship.setVisible(false);

        this.dead = true;
    }

    respawn()
    {
    	this.ship.body.reset(this.ship.x, this.ship.y);
        this.ship.body.checkCollision.none = false;
        this.ship.setActive(true);
        this.ship.setVisible(true);

        this.dead = false;
    }

    spawnEnemies()
    {
    	const height = this.scale.height;
		const width = this.scale.width;

		var spawnPoints = [new Phaser.Math.Vector2(-0.6 * width , Phaser.Math.RND.integerInRange(0,height)),
		new Phaser.Math.Vector2(0.6 * width , Phaser.Math.RND.integerInRange(0,height)),
		new Phaser.Math.Vector2(Phaser.Math.RND.integerInRange(0,width), -0.6 * height),
		new Phaser.Math.Vector2(Phaser.Math.RND.integerInRange(0,width), 0.6 * height)]

		var point = Phaser.Math.RND.pick(spawnPoints);
		var chance = Phaser.Math.RND.integerInRange(0,10);
		// enemies type 1
		if (chance < 4)
			this.EnemyGroup1.spawnShip(point.x + this.ship.x, point.y + this.ship.y);
		else if (chance < 7)
			this.EnemyGroup2.spawnShip(point.x + this.ship.x, point.y + this.ship.y);
		else
			this.EnemyGroup3.spawnShip(point.x + this.ship.x, point.y + this.ship.y);

		this.enemySpawnTimerConfig.delay *= 0.98;
		this.enemySpawnTimer.reset(this.enemySpawnTimerConfig);
    }

    spawnMeteors()
    {
    	const height = this.scale.height;
		const width = this.scale.width;

		var spawnPoints = [new Phaser.Math.Vector2(-0.6 * width , Phaser.Math.RND.integerInRange(0,height)),
		new Phaser.Math.Vector2(0.6 * width , Phaser.Math.RND.integerInRange(0,height)),
		new Phaser.Math.Vector2(Phaser.Math.RND.integerInRange(0,width), -0.6 * height),
		new Phaser.Math.Vector2(Phaser.Math.RND.integerInRange(0,width), 0.6 * height)]

		var point = Phaser.Math.RND.pick(spawnPoints);
		this.BigMeteorGroup.spawnMeteor(point.x + this.ship.x, point.y + this.ship.y);

		this.meteorSpawnTimerConfig.delay *= 0.99;
		this.meteorSpawnTimer.reset(this.meteorSpawnTimerConfig);
    }

	
	getShipPosition()
	{
		return new Phaser.Math.Vector2(this.ship.x, this.ship.y);
	}

	returnToMenu()
	{
		this.ship.body.reset(0,0);
        this.ship.body.checkCollision.none = false;
        this.ship.setActive(true);
        this.ship.setVisible(true);

        this.dead = false;
		this.lives = 3;

		this.scene.start('menuScene');
	}

	
}
