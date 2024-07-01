


import Preload from './scenes/Preload.js';
import GameScene from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 250 },
            debug: true
        }
    },
    scene: [Preload, GameScene]
};

const game = new Phaser.Game(config);


/*
import Player from "/objects/Player.js";
import Skeleton from "/objects/Skeleton.js";
import Coins from "/objects/Coins.js";
import * as Actions from "/actions/AiActions.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 250 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
let score = 0;
let coins;
const game = new Phaser.Game(config);

function preload(){
    this.load.image("floor", "assets/Testbar.png");
    this.load.image("wall", "assets/Wall.png");
    this.load.image("gandalf", "assets/gandalfPlatform.png");
    this.load.tilemapTiledJSON("tilemap", "Maps/Level1.tmj")
    /!*this.load.tilemapTiledJSON("tilemap", "Maps/Level0.tmj");*!/
    this.load.spritesheet("warrior", "assets/warrior.png", {frameWidth: 69, frameHeight: 44});
    this.load.spritesheet("skeletonWalk", "assets/skeleton_walk.png", {frameWidth: 96, frameHeight: 64});
    this.load.spritesheet("skeletonIdle", "assets/skeleton_idle.png", {frameWidth: 96, frameHeight: 64});
    this.load.spritesheet("skeletonStab", "assets/skeleton_stab.png", {frameWidth: 96, frameHeight: 64});
    this.load.spritesheet("skeletonSwing", "assets/skeleton_swing.png", {frameWidth: 96, frameHeight: 64});
    this.load.spritesheet("skeletonHurt", "assets/skeleton_hurt.png", {frameWidth: 96, frameHeight: 64});
    this.load.spritesheet("skeletonDie", "assets/skeleton_die.png", {frameWidth: 96, frameHeight: 64});
    this.load.spritesheet("goldCoin", "assets/MonedaD.png", {frameWidth:16, frameHeight: 16});

    this.load.on("complete" , () => {console.log("loaded")});
}

function create()
{
    this.debugGraphics = this.add.graphics();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.platforms = this.physics.add.staticGroup();
    this.walls = this.physics.add.staticGroup();
    this.cameras.main.setBounds(0,0,2500,1500);


    this.debugGraphics.lineStyle(1, 0xff0000);


    const map = this.make.tilemap({key: "tilemap"});
    const tileset = map.addTilesetImage("Gandalf Tileset", "gandalf");
    const backgroundLayer = map.createLayer("Background", tileset, 0, 0).setScale(1.2);
    const platformLayer = map.createLayer("SmallPlatforms", tileset, 0, 0).setScale(1.2);
    const skeletonCollisionLayer = map.createLayer("SkeletonCollision", tileset, 0, 0).setScale(1.2).setVisible(false);
    const skeletonObject = map.getObjectLayer("Skeletons");
    const coinLayer = map.getObjectLayer("Coins");

    coins = this.physics.add.group({ allowGravity: false });
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
    setCustomCollision(platformLayer);



   //Create Enemy's and Player
    this.player = new Player(this, 200, 300).setScale(1.5);
   // this.skeleton = new Skeleton(this, 300, 300).setScale(1.2);
    this.enemies = this.physics.add.group({
        classType: Skeleton,
        runChildUpdate: true
    });

    skeletonObject.objects.forEach(skelObj => {
        this.enemies.add(new Skeleton(this, skelObj.x, skelObj.y, this.player));
    })
    this.enemies.add(new Skeleton(this, 300,100,this.player));
    this.enemies.add(new Skeleton(this, 330,100,this.player));
    this.enemies.add(new Skeleton(this, 360,100,this.player));
    this.enemies.add(new Skeleton(this, 400,100,this.player));

    this.enemies.getChildren().forEach(enemy => {
        this.physics.add.existing(enemy);
    });

    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.collider(this.player, platformLayer);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.enemies, groundLayer);
    this.physics.add.collider(this.enemies, platformLayer);
    this.physics.add.collider(this.enemies, skeletonCollisionLayer);

    this.physics.add.overlap(this.player, coins, collectCoin, null, this);
    this.cameras.main.startFollow(this.player);
}

function update(){
    if (!this.player.playerIsDead) {
        this.health = this.player.health;
        //this.skeleton.update(this.player);
        this.player.update(this.cursors, this.enemies);
       // this.goldCoin.update(this.player);
    }
}


function setCustomCollision(layer) {
    layer.forEachTile(tile => {
        if (tile.index === 44 || tile.index === 151) {  // Replace YOUR_TILE_INDEX with the index of your specific tile
            tile.setCollision(false, false, true, false);
        }
    });
}

function collectCoin(player, coins){
    score+= coins.coinValue;
    this.scoreText.setText("Score " + score);
    coins.destroy();
    console.log(score);
}

function addScore(amount){
    score += amount;
    this.scoreText.setText("Score: " + score);
}*/
