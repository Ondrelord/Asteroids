class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y, key)
    {
        super(scene, x, y, key);
        
        this.distToDisappear = scene.scale.width > scene.scale.height ? scene.scale.width : scene.scene.height;
        this.radius = 10;
    }

    fire (scene, from, to, angle = 0)
    {
        // for disapear distance
        this.shipPos = from;

        // spawn and ready to shoot
        this.body.reset(from.x, from.y);
        this.body.checkCollision.none = false;
        this.setActive(true);
        this.setVisible(true);
        this.body.setCircle(this.radius,-this.radius + 0.5 * this.width,-this.radius + 0.5 * this.height);

        // shoot to with correct rotation
        to = Phaser.Math.RotateAround(to, this.x, this.y, Phaser.Math.DegToRad(angle));

        scene.physics.moveToObject(this, to, 300);
        this.rotation = Phaser.Math.Angle.BetweenPoints(from, to);
    }

    disappear()
    {
        this.body.checkCollision.none = true;
        this.setActive(false);
        this.setVisible(false);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        
        if (Phaser.Math.Distance.BetweenPoints(this.shipPos, this) > this.distToDisappear)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene, key)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 100,
            key: key,
            active: false,
            visible: false,
            classType: Bullet
        });

        this.children.each(function (bullet)
        {
            bullet.body.checkCollision.none = true;
        }, this);
    }

    fireBullet (scene, from, to , angle = 0)
    {
        let bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(scene, from, to, angle);
        }
    }
}