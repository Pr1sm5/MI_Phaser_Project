import Player from "../objects/Player.js";
import Skeleton from "../objects/Skeleton.js";
import Coins from "../objects/Coins.js";

let score = 0;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.debugGraphics = this.add.graphics();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.platforms = this.physics.add.staticGroup();
        this.walls = this.physics.add.staticGroup();
        this.cameras.main.setBounds(0, 0, 2500, 1500);

        const map = this.make.tilemap({ key: "tilemap" });
        const tileset = map.addTilesetImage("Gandalf Tileset", "gandalf");
        const backgroundLayer = map.createLayer("Background", tileset, 0, 0).setScale(1.2);
        const platformLayer = map.createLayer("SmallPlatforms", tileset, 0, 0).setScale(1.2);
        const skeletonCollisionLayer = map.createLayer("SkeletonCollision", tileset, 0, 0).setScale(1.2).setVisible(false);
        const skeletonObject = map.getObjectLayer("Skeletons");
        const coinLayer = map.getObjectLayer("Coins");

        this.scoreText = this.add.text(600, 10, "Score: " + score, {font: "32px Algerian"});
        this.scoreText.setScrollFactor(0,0);

        let coins = this.physics.add.group({ allowGravity: false });
        coinLayer.objects.forEach(object => {
            let coin = new Coins(this, object.x, object.y, "goldCoin");
            coin.body.setAllowGravity(false);
            coins.add(coin);
        });

        const groundLayer = map.createLayer("CollisionGroundWalls", tileset, 0, 0).setScale(1.2);
        for (var i = 0; i<333; i++) {
            groundLayer.setCollision(i,true);
        }

        skeletonCollisionLayer.setCollision(32, true);
        this.setCustomCollision(platformLayer);

        this.player = new Player(this, 600, 300).setScale(1.5);

        this.enemies = this.physics.add.group({
            classType: Skeleton,
            runChildUpdate: true
        });

        skeletonObject.objects.forEach(skelObj => {
            this.enemies.add(new Skeleton(this, skelObj.x, skelObj.y, this.player));
        });

        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.player, platformLayer);
        this.physics.add.collider(this.enemies, groundLayer);
        this.physics.add.collider(this.enemies, platformLayer);
        this.physics.add.collider(this.enemies, skeletonCollisionLayer);

        this.physics.add.overlap(this.player, coins, this.collectCoin, null, this);

        this.cameras.main.startFollow(this.player);
    }

    update() {
        if (!this.player.playerIsDead) {
            this.player.update(this.cursors, this.enemies);
        }
    }

    setCustomCollision(layer) {
        layer.forEachTile(tile => {
            if (tile.index === 44 || tile.index === 151) {
                tile.setCollision(false, false, true, false);
            }
        });
    }

    collectCoin(player, coin) {
        score += coin.coinValue;
        coin.destroy();
        this.scoreText.setText("Score: " + score);
        console.log("Coin collected! Score: " + score);
    }

    enemyKilled(amount) {
        score += amount;
        this.scoreText.setText("Score: " + score);
    }
}