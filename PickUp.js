class PickUp extends Phaser.Physics.Arcade.Sprite
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
        this.setScale(0.17);

        // time for pickup to disappear
        this.despawnTimer = this.scene.time.addEvent({
            delay: 10000,
            callback: this.disappear,
            callbackScope: this
        });

    }

    disappear()
    {
        this.body.checkCollision.none = true;
        this.setActive(false);
        this.setVisible(false);

        if (this.key == "pickupLife") return 1;
        if (this.key == "pickupWeapon") return 2;
        return 0;
    }
}

class PickUps extends Phaser.Physics.Arcade.Group
{
    constructor (scene, key)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 10,
            key: key,
            active: false,
            visible: false,
            classType: PickUp
        });

        this.children.each(function (pickup)
        {
            pickup.body.checkCollision.none = true;
        }, this);
    }

    spawnPickUp (x, y)
    {
        let pickup = this.getFirstDead(false);

        if (pickup)
        {
            pickup.spawn(x, y);
        }
    }
}