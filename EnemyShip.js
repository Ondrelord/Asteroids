class EnemyShip extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y, key)
    {
        super(scene, x, y, key);

        this.scene = scene;

        this.explosion = this.scene.add.particles('expParticle');
        this.expEmitter = this.explosion.createEmitter(
        {
            lifespan: 2000,
            speed: 50,
            scale: {start: 0.05, end: 0},
            blendMode: 'ADD',
            on: false
        });

        this.shootTimer = this.scene.time.addEvent({
            delay: 2000,
            loop: true,
            callback: this.shoot,
            callbackScope: this,
            paused: true
        });
    }

    spawn (x,y, type)
    {
        this.type = type;
        this.lives = 2*type;

        this.shootTimer.paused = false;

        this.body.reset(x,y);
        this.body.checkCollision.none = false;
        this.setActive(true);
        this.setVisible(true);

    }

    takeHit()
    {
        this.lives -= 1;
        if (this.lives <= 0)
        {
            this.disappear();
            return true;
        }
        return false;
    }

    disappear()
    {
        this.expEmitter.explode(50, this.x, this.y);

        this.shootTimer.paused = true;
        this.body.checkCollision.none = true;
        this.setActive(false);
        this.setVisible(false);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        //if (this.type == 1)
            this.scene.physics.moveToObject(this, this.scene.getShipPosition(), 50);
    }

    shoot()
    {
        if (!this.scene.dead)
        {
            if (this.type == 1)
            this.scene.EnemyBulletGroup.fireBullet(this.scene, this, this.scene.ship);
            if (this.type == 2)
            {
               this.scene.EnemyBulletGroup.fireBullet(this.scene, this, this.scene.ship, 15);
               this.scene.EnemyBulletGroup.fireBullet(this.scene, this, this.scene.ship, -15);
            }
        }
    }
}

class EnemyShips extends Phaser.Physics.Arcade.Group
{
    constructor (scene, type)
    {
        super(scene.physics.world, scene);

        this.type = type;

        this.createMultiple({
            frameQuantity: 10,
            key: ('enemyShip' + this.type.toString()),
            active: false,
            visible: false,
            classType: EnemyShip
        });

        this.children.each(function (ship)
        {
            ship.body.checkCollision.none = true;
        }, this);
    }

    spawnShip (x, y)
    {
        let ship = this.getFirstDead(false);

        if (ship)
        {
            ship.spawn(x, y, this.type);
        }
    }
}