class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, "warrior");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setSize(20,30);
        this.body.setOffset(16,14);
        this.body.setMass(10);
        this.body.setDrag(0,0);

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
            frames: this.anims.generateFrameNumbers("warrior", {start:14, end: 22}),
            frameRate: 15,
            repeat: 0
        })

        this.anims.create({
            key: "attackHeavy",
            frames: this.anims.generateFrameNumbers("warrior", {start: 77, end: 83}),
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: "hit",
            frames: this.anims.generateFrameNumbers("warrior", {start: 37, end: 40}),
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: "slide",
            frames: this.anims.generateFrameNumbers("warrior", {start: 84, end: 90}),
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: "wallSlide",
            frames: this.anims.generateFrameNumbers("warrior", {start: 60, end: 63}),
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
        const cursorsSpace = cursors.space.isDown;
        const cursorsShift = cursors.shift.isDown;

        // Check if attacking
        const isAttacking = this.anims.currentAnim && (this.anims.currentAnim.key === "attack" || this.anims.currentAnim.key === "attackHeavy");

        // If attacking, set velocity to 0 and skip movement logic
        if (isAttacking) {
            this.setVelocityX(0);
            this.setDrag(0, 0);
            return;
        }

        //Horizontal movement
        if (cursorsDown && this.body.blocked.down) {
            // Initiate slide
            this.anims.play("slide", true);
            if (this.flipX) {
                this.setVelocityX(-225);
            } else {
                this.setVelocityX(225);
            }
        } else if (cursorsLeft && this.body.blocked.down) {
            this.setVelocityX(-170);
            this.flipX = true;
            this.setOffset(33, 14);
            this.anims.play("run", true);
        } else if (cursorsRight && this.body.blocked.down) {
            this.setVelocityX(170);
            this.body.setOffset(16, 14);
            this.flipX = false;
            this.anims.play("run", true);
        } else if (this.anims.currentAnim && this.anims.currentAnim.key === "slide") {
            // Maintain slide velocity
            if (this.flipX) {
                this.setVelocityX(-225);
            } else {
                this.setVelocityX(225);
            }
        } else {
            this.setVelocityX(0);
        }

        if (cursorsDown && this.body.blocked.down) {
            // Initiate slide
            this.anims.play("slide", true);
            if (this.flipX) {
                this.setVelocityX(-225);
            } else {
                this.setVelocityX(225);
            }
        } else if (cursorsLeft && this.body.blocked.down) {
            this.setVelocityX(-170);
            this.flipX = true;
            this.setOffset(33, 14);
            this.anims.play("run", true);
        } else if (cursorsRight && this.body.blocked.down) {
            this.setVelocityX(170);
            this.body.setOffset(16, 14);
            this.flipX = false;
            this.anims.play("run", true);
        } else if (this.anims.currentAnim && this.anims.currentAnim.key === "slide") {
            // Maintain slide velocity
            if (this.flipX) {
                this.setVelocityX(-225);
            } else {
                this.setVelocityX(225);
            }
        } else {
            this.setVelocityX(0);
        }

        //Vertical movement
        if(cursorsUp && this.body.blocked.down) {
            this.setVelocityY(-200);
            this.anims.play("jump",true);
        } else if (!this.body.blocked.down) {
            if (cursorsLeft) {
                this.setVelocityX(-170);
                this.flipX = true;
                this.setOffset(33, 14);
            } else if (cursorsRight) {
                this.setVelocityX(170);
                this.body.setOffset(16, 14);
                this.flipX = false;
            }
            if (this.body.velocity.y < 0) {
                this.anims.play("hover");
            } else if (this.body.velocity.y > 30) {
                this.anims.play("falling", true);
            }
        }


        if(cursorsSpace && this.body.blocked.down) {
            this.anims.play("attack", true);
        }

        // if(cursorsSpace && !this.body.blocked.down) {
        //     this.anims.play("attack", true);
        //     this.setVelocityX(-100);
        // }

        if (cursorsShift && this.body.blocked.down) {
             this.anims.play("attackHeavy", true);
        }

        if (cursorsShift && !this.body.blocked.down) {
            this.anims.play("attackHeavy", true);
            this.setVelocityY(100);
        }

        if (this.body.onWall()) {
            this.anims.play("wallSlide", true);
            this.setVelocityY(100);
        }


        if (this.body.blocked.down && this.anims.currentAnim.key !== "hit") {
            if (!cursorsLeft && !cursorsRight) {
                if(this.anims.currentAnim.key === "run") this.anims.play("idle", true);
                this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {this.anims.play("idle", true);})
                this.setDrag(500, 0);
            } else {
                this.setDrag(0, 0);
            }
        } else {
            this.setDrag(0, 0);
        }
    }
}

export default Player;