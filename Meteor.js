class Meteor extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y, key)
    {
        super(scene, x, y, key);

        this.key = key;
        this.scene = scene;
    }

    spawn (x,y)
    {
        this.body.reset(x,y);
        this.body.checkCollision.none = false;
        this.setActive(true);
        this.setVisible(true);

        if(this.key == "bigMeteor")
			this.scale = 0.4;        	
		if(this.key == "midMeteor")
			this.scale = 0.3;
		if(this.key == "smlMeteor")
			this.scale = 0.15;

        var pos = Phaser.Math.RotateAround(this.scene.getShipPosition(), this.x, this.y, Phaser.Math.RND.integerInRange(-20,20));
        this.scene.physics.moveToObject(this, pos, 30);
    }

    disappear(split = true)
    {
        this.body.checkCollision.none = true;
        this.setActive(false);
        this.setVisible(false);
        
        if (!split)
        	return;

        if(this.key == "bigMeteor")
    	{
    		this.scene.MidMeteorGroup.spawnMeteor(this.x - Phaser.Math.RND.integerInRange(-10,10), this.y - Phaser.Math.RND.integerInRange(-10,10));
    		this.scene.MidMeteorGroup.spawnMeteor(this.x - Phaser.Math.RND.integerInRange(-10,10), this.y - Phaser.Math.RND.integerInRange(-10,10));
    	}
    	if (this.key == "midMeteor")
    	{
    		this.scene.SmallMeteorGroup.spawnMeteor(this.x - Phaser.Math.RND.integerInRange(-10,10), this.y - Phaser.Math.RND.integerInRange(-10,10));
    		this.scene.SmallMeteorGroup.spawnMeteor(this.x - Phaser.Math.RND.integerInRange(-10,10), this.y - Phaser.Math.RND.integerInRange(-10,10));
    	}
    }
}

class Meteors extends Phaser.Physics.Arcade.Group
{
    constructor (scene, key)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 10,
            key: key,
            active: false,
            visible: false,
            classType: Meteor
        });

        this.children.each(function (meteor)
        {
            meteor.body.checkCollision.none = true;
        }, this);
    }

    spawnMeteor (x, y)
    {
        let meteor = this.getFirstDead(false);

        if (meteor)
        {
            meteor.spawn(x, y);
        }
    }
}