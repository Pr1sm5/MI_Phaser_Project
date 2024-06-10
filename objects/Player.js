class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, "warrior");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setSize(20,30);
        this.body.setOffset(16,14);
        this.body.setMass(10);
        this.body.setDrag(1000,0);

        //Hit registration player side
        this.hitRegistered = false;

        this.anims.create({
            key:"run",
            frames: this.anims.generateFrameNumbers("warrior", {start: 6, end: 13}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("warrior", {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key:"jump",
            frames: this.anims.generateFrameNumbers("warrior", {start: 41, end: 43}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: "hover",
            frames: this.anims.generateFrameNumbers("warrior", {start: 44, end: 45}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: "falling",
            frames: this.anims.generateFrameNumbers("warrior", {start: 46, end: 48})
        });

        this.anims.create({
            key: "attack",
            frames: this.anims.generateFrameNumbers("warrior", {start:14, end: 26}),
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: "hit",
            frames: this.anims.generateFrameNumbers("warrior", {start: 37, end: 40}),
            frameRate: 10,
            repeat: 0
        })
    }

    update(cursors, enemy) {

        this.playerMovement(cursors);
        this.playerKnockback(enemy);

    }

    playerKnockback(enemy){
        if (this.playerHit(enemy)) {
            const knockbackDirection = (this.x > enemy.x) ? 1: -1;
            this.setVelocity(knockbackDirection* 50, -30);
        }
    }

    playerHit(enemy){
        if (enemy.hitPlayer && !this.hitRegistered) {
            this.hitRegistered = true;
            console.log("Player hit")
            enemy.hitPlayer = false;
            this.anims.play("hit", true);
            this.on(Phaser.Animations.Events.ANIMATION_STOP, () => {this.hitRegistered=false;})
            console.log(this.hitRegistered);
            return true;
        }
        return false;
    }

    playerMovement(cursors) {
        //Player Movement Shorts
        const cursorsLeft = cursors.left.isDown;
        const cursorsRight = cursors.right.isDown;
        const cursorsUp = cursors.up.isDown;
        const cursorsDown = cursors.down.isDown;


        if(cursorsLeft && this.body.touching.down) {
            this.setVelocityX(-170);
            this.flipX=true;
            this.setOffset(33,14);
            this.anims.play("run", true);
        }
        else if(cursorsRight && this.body.touching.down) {
            this.setVelocityX(170);
            this.body.setOffset(16,14);
            this.flipX=false;
            this.anims.play("run", true);
        }

        if(cursorsUp && this.body.touching.down) {
            this.setVelocityY(-120);
            this.anims.play("jump",true);
        } else if (!this.body.touching.down) {
            if (this.body.velocity.y < 0) {
                this.anims.play("hover");
            } else if (this.body.velocity.y > 30) {
                this.anims.play("falling", true);
            }
        }

        if(cursors.space.isDown) {
            this.anims.play("attack");
        }

        if (this.body.touching.down && this.anims.currentAnim.key !== "hit") {
            if (!cursorsLeft && !cursorsRight) {
                this.setDrag(1000, 0);
                this.anims.play("idle", true);
            } else {
                this.setDrag(0, 0);
            }
        } else {
            this.setDrag(0, 0);
        }
    }
}

export default Player;