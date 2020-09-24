class menuScene extends Phaser.Scene
{
	constructor() 
	{
		super({key: "menuScene"});
	}

	create()
	{
		const width = this.scale.width;
		const height = this.scale.height;

		// background
		this.bg_bStars = this.add.tileSprite(0.5 * width, 0.5 * height, width, height, 'bStars');
		this.bg_yStars = this.add.tileSprite(0.5 * width, 0.5 * height, width, height, 'yStars');
		this.bg_BStars = this.add.tileSprite(0.5 * width, 0.5 * height, width, height, 'BStars');

		this.add.image(0.5*width, 0.4*height, 'playerShip');

		this.startButton = this.add.image(0.5*width, 0.65*height, 'startButton');
		this.startButton.setInteractive();
	}

	update()
	{
		this.bg_bStars.tilePositionX += 1;
		this.bg_yStars.tilePositionX += 0.5;
		this.bg_BStars.tilePositionX += 1.25;

		this.startButton.on("pointerover", ()=>{
			this.startButtonOver = true;
		})
		this.startButton.on("pointerout", ()=>{
			this.startButtonOver = false;	
		})
		this.startButton.on("pointerup", ()=>{
			if (this.startButtonOver)
			{
				this.scene.start('gameScene');
			}
		})
	}


}