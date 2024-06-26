class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, "warrior");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.health = 5;
        this.healthText = scene.add.text(10,10, this.health + " HP", {font: "32px Algerian"});
        this.healthText.setScrollFactor(0,0);
        this.jumpCount = 0;
        this.jumpCooldown = false
        this.upFlag = false;
        //this.setCollideWorldBounds(true);
        this.body.setSize(15,30);
        this.body.setOffset(19,14);
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
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: "hover",
            frames: this.anims.generateFrameNumbers("warrior", {start: 44, end: 45}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: "falling",
            frames: this.anims.generateFrameNumbers("warrior", {start: 46, end: 48}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: "attack",
            frames: this.anims.generateFrameNumbers("warrior", {start:14, end: 22}),
            frameRate: 20,
            repeat: 0
        })

        this.anims.create({
            key: "hit",
            frames: this.anims.generateFrameNumbers("warrior", {start: 37, end: 40}),
            frameRate: 10,
            repeat: 0
        })

        /*this.anims.create({
            key: "death",
            frames: this.anims.generateFrameNumbers("warrior", {start: , end: })
        })*/
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
            this.health -= 1;
            this.healthText.setText(this.health + " HP");
            console.log(this.health);
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

        if (this.body.velocity.y < 0) {
            this.anims.play("hover");
        } else if (this.body.velocity.y > 30) {
            this.anims.play("falling", true);
        }

        //Horizontal movement
        if (cursorsLeft && this.body.blocked.down) {
            this.setVelocityX(-170);
            this.flipX = true;
            this.setOffset(34, 14);
            this.anims.play("run", true);
        } else if (cursorsRight && this.body.blocked.down) {
            this.setVelocityX(170);
            this.body.setOffset(19,14);
            this.flipX = false;
            this.anims.play("run", true);
        }

        //Vertical movement
        if(cursorsUp) {
            if (!this.upFlag &&(this.body.blocked.down || this.jumpCount <= 1)) {
                this.setVelocityY(-200);
                this.jumpCount++;
                console.log(this.jumpCount);
                this.anims.play("jump", true);
                this.upFlag = true;
            }
        } else if (!this.body.blocked.down) {
            if(this.jumpCount === 0) {
                this.jumpCount=1;
            }
            this.upFlag = false;
            if (cursorsLeft) {
                this.setVelocityX(-170);
                this.flipX = true;
                this.setOffset(34, 14);
            } else if (cursorsRight) {
                this.setVelocityX(170);
                this.body.setOffset(19,14);
                this.flipX = false;
            } else {
                const dampingForce = this.body.velocity.x * -0.1; // Adjust the damping factor as needed
                 this.setAccelerationX(dampingForce);
            }
        } else {
            this.setAccelerationX(0);
        }

        if(cursors.space.isDown) {
            this.anims.play("attack");
        }

        if (this.body.blocked.down && this.anims.currentAnim.key !== "hit") {
            this.upFlag = false;
            this.jumpCount = 0;
            if (!cursorsLeft && !cursorsRight && !cursorsDown) {
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