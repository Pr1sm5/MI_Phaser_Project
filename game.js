import Player from "/objects/Player.js";
import Enemy from "/objects/Enemy.js";
import * as Actions from "/actions/AiActions.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 150 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload(){
    this.load.image("floor", "assets/Testbar.png");
    this.load.image("wall", "assets/Wall.png");
    this.load.image("gandalf", "assets/gandalfPlatform.png");
    this.load.tilemapTiledJSON("tilemap", "Maps/Level0.tmj");
    this.load.spritesheet("warrior", "assets/warrior.png", {frameWidth: 69, frameHeight: 44});
    this.load.spritesheet("skeletonWalk", "assets/skeleton_walk.png", {frameWidth: 96, frameHeight: 64});
    this.load.spritesheet("skeletonIdle", "assets/skeleton_idle.png", {frameWidth: 96, frameHeight: 64});
    this.load.spritesheet("skeletonStab", "assets/skeleton_stab.png", {frameWidth: 96, frameHeight: 64});
    this.load.spritesheet("skeletonSwing", "assets/skeleton_swing.png", {frameWidth: 96, frameHeight: 64});
}

function create()
{
    this.debugGraphics = this.add.graphics();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.platforms = this.physics.add.staticGroup();
    this.walls = this.physics.add.staticGroup();

    this.debugGraphics.lineStyle(1, 0xff0000);


   /*const map= this.make.tilemap({key: "tilemap"});
   const tileset = map.addTilesetImage("Gandalf_Tileset", "gandalf");
   const layer = map.createLayer("Ebene1", tileset, 0, 0).setScale(1.2);
   const layer2 = map.createLayer("Ebene2", tileset, 0,0 ).setScale(1.2);
   layer.setCollisionFromCollisionGroup(true, true);
   this.physics.world.setBoundsCollision(true, true, true, true);
   layer.renderDebug(this.add.graphics());*/

    this.walls.create(750,0, "wall");
    this.walls.create(0,150, "wall");
    this.platforms.create(0,400, "floor").setScale(1);
    this.platforms.create(400, 400, "floor");
    this.platforms.create(0, 500, "floor");
    this.player = new Player(this, 600, 300).setScale(1.5);
    this.skeleton = new Enemy(this, 300, 300).setScale(1.2);

    //this.physics.add.collider(this.player, layer);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.skeleton, this.platforms);
    this.physics.add.collider(this.skeleton, this.walls);
}

function update(){
    this.skeleton.update(this.player, this.enemyReturnBlock);
    this.player.update(this.cursors, this.skeleton);

}