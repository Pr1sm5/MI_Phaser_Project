import Player from "/objects/Player.js";
import Skeleton from "/objects/Skeleton.js";
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

const game = new Phaser.Game(config);

function preload(){
    this.load.image("floor", "assets/Testbar.png");
    this.load.image("wall", "assets/Wall.png");
    this.load.image("gandalf", "assets/gandalfPlatform.png");
    this.load.tilemapTiledJSON("tilemap", "Maps/Level1.tmj")
    /*this.load.tilemapTiledJSON("tilemap", "Maps/Level0.tmj");*/
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
    /*this.enemyReturnBlock = this.add.group();
    this.enemyReturnBlock.add(new Phaser.GameObjects.Rectangle(this, 400, 330, 1, 50));
    this.enemyReturnBlock.add(new Phaser.GameObjects.Rectangle(this, 30, 330, 1, 50));*/
    this.cameras.main.setBounds(0,0,2500,1500);



    //creates physics model on enemyReturnBlock
    /*this.enemyReturnBlock.children.iterate(rect => {
        this.physics.add.existing(rect);
        rect.body.setImmovable(true);
        rect.body.allowGravity = false;
    });
*/

    this.debugGraphics.lineStyle(1, 0xff0000);


    const map = this.make.tilemap({key: "tilemap"});
    const tileset = map.addTilesetImage("Gandalf Tileset", "gandalf");
    const backgroundLayer = map.createLayer("Background", tileset, 0, 0).setScale(1.2);
    const platformLayer = map.createLayer("SmallPlatforms", tileset, 0, 0).setScale(1.2);
    const skeletonCollisionLayer = map.createLayer("SkeletonCollision", tileset, 0, 0).setScale(1.2).setVisible(false);

    const groundLayer = map.createLayer("CollisionGroundWalls", tileset, 0, 0).setScale(1.2);
    for (var i = 0; i<333; i++) {
        groundLayer.setCollision(i,true);
    }
    skeletonCollisionLayer.setCollision(32, true);
    setCustomCollision(platformLayer);




   // groundLayer.renderDebug(this.add.graphics());
    //platformLayer.renderDebug(this.add.graphics());
    //skeletonCollisionLayer.renderDebug(this.add.graphics());

   /*const map= this.make.tilemap({key: "tilemap"});
   const tileset = map.addTilesetImage("Gandalf_Tileset", "gandalf");
   const layer = map.createLayer("Ebene1", tileset, 0, 0).setScale(1.2);
   const layer2 = map.createLayer("Ebene2", tileset, 0,0 ).setScale(1.2);
   layer.setCollisionFromCollisionGroup(true, true);
   layer.renderDebug(this.add.graphics());*/

    //Testing Level Setup
    /*this.walls.create(750,0, "wall");
    this.walls.create(0,150, "wall");
    this.platforms.create(-50,400, "floor").setScale(1);
    this.platforms.create(900, 400, "floor");
    this.platforms.create(30, 500, "floor");*/

   //Create Enemy's and Player
    this.player = new Player(this, 600, 300).setScale(1.5);
    this.skeleton = new Skeleton(this, 300, 300).setScale(1.2);


    //Enemy Turn Around Collider
    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.collider(this.player, platformLayer);
    //this.physics.add.collider(this.player, layer);
    //this.physics.add.collider(this.skeleton, layer);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.skeleton, this.platforms);
    this.physics.add.collider(this.skeleton, this.walls);
    this.physics.add.collider(this.skeleton, groundLayer);
    this.physics.add.collider(this.skeleton, platformLayer);
    this.physics.add.collider(this.skeleton, skeletonCollisionLayer);

    this.cameras.main.startFollow(this.player);
}

function update(){
    this.health = this.player.health;

    this.skeleton.update(this.player);
    this.player.update(this.cursors, this.skeleton);

}


function setCustomCollision(layer) {
    layer.forEachTile(tile => {
        if (tile.index === 44 || tile.index === 151) {  // Replace YOUR_TILE_INDEX with the index of your specific tile
            tile.setCollision(false, false, true, false);
        }
    });
}
