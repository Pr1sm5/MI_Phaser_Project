export default class Preload extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload() {
        this.load.image("floor", "assets/Testbar.png");
        this.load.image("wall", "assets/Wall.png");
        this.load.image("gandalf", "assets/gandalfPlatform.png");
        this.load.tilemapTiledJSON("tilemap", "Maps/Level1.tmj");
        this.load.spritesheet("warrior", "assets/warrior.png", { frameWidth: 69, frameHeight: 44 });
        this.load.spritesheet("skeletonWalk", "assets/skeleton_walk.png", { frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet("skeletonIdle", "assets/skeleton_idle.png", { frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet("skeletonStab", "assets/skeleton_stab.png", { frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet("skeletonSwing", "assets/skeleton_swing.png", { frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet("skeletonHurt", "assets/skeleton_hurt.png", { frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet("skeletonDie", "assets/skeleton_die.png", { frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet("goldCoin", "assets/MonedaD.png", { frameWidth: 16, frameHeight: 16 });

        this.load.on("complete", () => {
            console.log("All assets loaded");
            this.scene.start('GameScene');
        });
    }
}