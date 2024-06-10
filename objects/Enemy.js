class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y) {
        super (scene, x,y, "skeletonIdle");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setSize(36,50);
        this.body.setOffset(28, 14);

        this.anims.create({
            key:"idle",
            frames: this.anims.generateFrameNumbers("skeletonIdle", {start: 0, end:7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key:"walk",
            frames: this.anims.generateFrameNumbers("skeletonWalk", {start: 0, end:10}),
            frameRate: 10,
            repeat:-1
        });

        this.play("idle");
    }
    update(){
        this.body.setVelocityX(120);
        if (this.body.touching.right){
            this.anims.play("walk");
            this.body.setVelocityX(-120);
        } else if (this.body.touching.left) {
            this.body.setVelocityX(120);
            this.anims.play("walk");
        } else {
            this.anims.play("idle");
        }
    }
}

export default Enemy;