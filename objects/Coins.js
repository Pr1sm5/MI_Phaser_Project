class Coins extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.coinValue = 100;

        this.anims.create({
            key: "coinAnim",
            frames: this.anims.generateFrameNumbers("goldCoin", {start: 0, end: 3}),
            frameRate: 8,
            repeat: -1
        })
        this.anims.play("coinAnim", true);
    }

}

export default Coins;