import * as Actions from "../actions/AiActions.js";

class Skeleton extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, player) {
        super (scene, x,y, "skeletonIdle");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.gameScene = scene;
        this.health = 3;
        this.player = player;
        this.hitPlayer = false;
        this.hitRegistered = false;
        this.attackCooldown = false;
        this.isDead = false;
        this.collidesTurnAround = false;
        this.turnCoolDown = false;
        this.setDrag(1000,0);

        this.body.setSize(20,42);
        this.body.setOffset(36, 21);
        this.swordHitbox = new Phaser.Geom.Rectangle(0,0,40, 10);
        this.debugGraphics = scene.add.graphics();

        //---------------------------------Animations--------------------------------------------------------

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
        });

        this.anims.create({
            key:"swing",
            frames: this.anims.generateFrameNumbers("skeletonSwing", {start: 0, end: 8}),
            frameRate: 10
        });

        this.anims.create({
            key: "hit",
            frames: this.anims.generateFrameNumbers("skeletonHurt", {start: 0, end: 4}),
            frameRate: 10
        });

        this.anims.create({
            key: "die",
            frames: this.anims.generateFrameNumbers("skeletonDie", {start: 0, end: 12}),
            frameRate: 10
        });

    }
    update(player){
        let distance = Math.sqrt(Math.pow((Math.abs( this.body.center.x - this.player.body.center.x)),2) + Math.pow(Math.abs(this.body.center.y - this.player.body.center.y), 2));
        if (!this.isDead) {
            this.followPlayer(this.player);
            if (distance > 200) {
                this.idleWalking();
            }
        }
    }

    //lets the skeleton walk from left to right
    //needs detection for free placed platforms (no walls)
    idleWalking(){
        if (!this.hitRegistered) {
            if (this.body.blocked.right) {
                this.body.setVelocityX(-80);
                this.body.setOffset(42, 21);
                this.flipX = false;
                this.anims.play("walk", true);
            } else if (this.body.blocked.left) {
                this.body.setVelocityX(80);
                this.body.setOffset(36, 21);
                this.flipX = true;
                this.anims.play("walk", true);
            } else if (this.body.velocity.x < 0) {
                this.body.setVelocityX(-80);
                this.body.setOffset(42, 21);
                this.flipX = true;
                this.anims.play("walk", true);
            } else {
                this.body.setVelocityX(80);
                this.flipX = false;
                this.body.setOffset(36, 21);
                this.anims.play("walk", true);
            }
        }
    }

    //takes the distance (pythagoras c=sqrt(a^2+b^2))
    //distance = sqrt((player.x - enemy.x)^2 + (player.y - enemy.y)^2)
    //turns the skeleton when the player is left or right
    //
    followPlayer(player){
        let distance = Math.sqrt(Math.pow((Math.abs( this.body.center.x - this.player.body.center.x)),2) + Math.pow(Math.abs(this.body.center.y - this.player.body.center.y), 2));
        if (distance < 200 &&  distance >= 50 && (this.anims.currentAnim.key !== "stab" || !this.anims.isPlaying) ) {
            if (this.player.body.center.x < this.body.center.x && !this.hitRegistered) {
                this.body.setVelocityX(-100);
                this.body.setOffset(42,21);
                this.flipX = true;
                this.anims.play("walk", true);
            } else if (this.player.body.center.x > this.body.center.x && !this.hitRegistered) {
                this.body.setVelocityX(100);
                this.body.setOffset(36,21);
                this.flipX = false;
                this.anims.play("walk", true);
            }
        } else if (distance <=55) {
            this.body.setVelocityX(0);
            this.attackPlayer(this.player);
        }
    }

    attackPlayer2(player) {

    }

    //------------------------------------Skeleton Damage Handle----------------------------------------

    knockBack(amount){
        if (amount ===1) {
            if (this.player.x < this.x) {
                this.body.setVelocity(90, -60);
                console.log("KnockBack");
            } else {
                this.body.setVelocity(-90, -60);
                console.log("KnockBack");
            }
        } else {
            if (this.player.x < this.x) {
                this.body.setVelocity(150, -80);
                console.log("KnockBack");
            } else {
                this.body.setVelocity(-150, -80);
                console.log("KnockBack");
            }
        }
    }

    takeHit(amount){
        if (!this.hitRegistered && this.health >= 1){
            this.hitRegistered = true;
            this.anims.play("hit", true);
            this.health -= amount;
            if(this.health <= 0) {
                this.gameScene.enemyKilled(150);
                this.body.setVelocity(0,0);
                this.isDead = true;
                this.anims.play("die", true);
                return;
            }
            this.knockBack(amount);
            console.log(this.health);
            this.scene.time.delayedCall(500,() => {
                this.hitRegistered = false;
            });
        }
    }

    //------------------------------------Skeleton Attack--------------------------------------------------
    //Creates a Sword hit box on attack, and marks hitPlayer = true;
    attackPlayer(player) {
        if (this.attackCooldown || this.hitRegistered) {
            return;
        }
        /*this.body.setVelocityX(0);*/
        this.attackCooldown = true;
        this.anims.play("stab", true);

        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, () => {
            if (this.anims.currentAnim.key === "stab" && this.anims.currentFrame.index === 4) {
                this.swordHitbox.setPosition(this.body.center.x + (this.flipX ? -56 : 18), this.body.center.y - 12);
                this.debugGraphics.lineStyle(1, 0xff0000);
                this.debugGraphics.strokeRectShape(this.swordHitbox);
                if (!this.hitPlayer) {
                    this.hitPlayer = Phaser.Geom.Intersects.RectangleToRectangle(this.swordHitbox, this.player.body.getBounds(this.player.body.center));
                }
            }
        })
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.hitPlayer = false;
        })
        // If the attack animation is not playing, set the hit box dimensions to zero

        setTimeout(() => {
            this.attackCooldown = false;
            this.debugGraphics.clear();
        }, 1250);
    }
}

export default Skeleton;