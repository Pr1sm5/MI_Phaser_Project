class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y) {
        super (scene, x,y, "skeletonIdle");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.hitPlayer = false;

        this.setCollideWorldBounds(true);
        this.body.setSize(28,42);
        this.body.setOffset(36, 21);
        this.swordHitbox = new Phaser.Geom.Rectangle(0,0,35, 10);
        this.debugGraphics = scene.add.graphics();

        this.anims.create({
            key:"idle",
            frames: this.anims.generateFrameNumbers("skeletonIdle", {start: 0, end:7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key:"walk",
            frames: this.anims.generateFrameNumbers("skeletonWalk", {start: 0, end:9}),
            frameRate: 10,
            repeat:-1
        });

        this.anims.create({
            key:"stab",
            frames: this.anims.generateFrameNumbers("skeletonStab", {start: 0, end: 7}),
            frameRate: 10
        })

        this.anims.create({
            key:"swing",
            frames: this.anims.generateFrameNumbers("skeletonSwing", {start: 0, end: 8}),
            frameRate: 10
        })

    }
    update(player){
        let distance = Math.sqrt(Math.pow((Math.abs( this.body.center.x - player.body.center.x)),2) + Math.pow(Math.abs(this.body.center.y - player.body.center.y), 2));
        this.followPlayer(player);
        if (distance > 200) {
            this.idleWalking();
        }
    }

    //lets the skeleton walk from left to right
    //needs detection for free placed platforms (no walls)
    idleWalking(){
        if (this.body.touching.right){
            this.body.setVelocityX(-80);
            this.flipX = false;
            this.anims.play("walk", true);
        } else if (this.body.touching.left) {
            this.body.setVelocityX(80);
            this.flipX = true;
            this.anims.play("walk", true);
        } else if (this.body.velocity.x > 0) {
            this.body.setVelocityX(80);
            this.flipX = false;
            this.anims.play("walk", true);
        } else {
            this.body.setVelocityX(-80);
            this.flipX = true;
            this.anims.play("walk", true);
        }
    }

    //takes the distance (pythagoras c=sqrt(a^2+b^2))
    //distance = sqrt((player.x - enemy.x)^2 + (player.y - enemy.y)^2)
    //turns the skeleton when the player is left or right
    //
    followPlayer(player){
        let distance = Math.sqrt(Math.pow((Math.abs( this.body.center.x - player.body.center.x)),2) + Math.pow(Math.abs(this.body.center.y - player.body.center.y), 2));
        if (distance < 200 && distance > 50 && this.anims.currentAnim.key !== "stab" || !this.anims.isPlaying ) {
            if (player.body.center.x < this.body.center.x) {
                this.body.setVelocityX(-100);
                this.flipX = true;
                this.anims.play("walk", true);
            } else if (player.body.center.x > this.body.center.x) {
                this.body.setVelocityX(100);
                this.flipX = false;
                this.anims.play("walk", true);
            }
        } else if (distance <= 50) {
            this.debugGraphics.clear();
            this.body.setVelocityX(0);
            this.anims.play("stab", true);
            this.attackPlayer(player);
        }
    }

    //Creates a Sword hit box on attack, and marks hitPlayer = true;
    attackPlayer(player) {

        if (this.anims.currentAnim.key === "stab" && this.anims.currentFrame.index >= 4 && this.anims.currentFrame.index <= 6) {
            this.swordHitbox.setPosition(this.body.center.x + (this.flipX ? -50: 18), this.body.center.y-12);
            this.debugGraphics.lineStyle(1, 0xff0000);
            this.debugGraphics.strokeRectShape(this.swordHitbox);
            this.hitPlayer = Phaser.Geom.Intersects.RectangleToRectangle(this.swordHitbox, player.getBounds());
        } else if(this.anims.currentAnim.key === "stab" && this.anims.currentFrame.index < 4 && this.anims.currentFrame.index > 6){
            this.hitPlayer = false;
        }
        this.swordHitbox.setPosition(0,0);
    }

}

export default Enemy;