class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, "warrior");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.isAttacking = false;
        this.hitEnemy = false;
        this.attackCooldown = false;
        this.score = 0;
        this.health = 5;
        this.healthText = scene.add.text(10,10, this.health + " HP", {font: "32px Algerian"});
        this.healthText.setScrollFactor(0,0);
        this.jumpCount = 0;
        this.jumpCooldown = false
        this.upFlag = false;
        this.playerIsDead = false;
        //this.setCollideWorldBounds(true);
        this.body.setSize(15,30);
        this.body.setOffset(19,14);
        this.body.setMass(10);
        this.body.setDrag(1000,0);

        //----------------------------------Sounds---------------------------------
        this.hitSound = scene.sound.add("womanHurt", {loop:false});
        this.womanGrunt1 = scene.sound.add("womanGrunt1", {loop:false});
        this.womanGrunt2 = scene.sound.add("womanGrunt2", {loop:false});
        this.womanGrunt3 = scene.sound.add("womanGrunt3", {loop:false});
        this.womanGrunt4 = scene.sound.add("womanGrunt4", {loop:false});
        this.runningGras = scene.sound.add("runningGras", {loop: true, volume: 1});


        //Hit registration player side
        this.hitRegistered = false;

        //-------------------------------Animations---------------------------------------------------------------
        this.anims.create({
            key:"run",
            frames: this.anims.generateFrameNumbers("warrior", {start: 6, end: 13}),
            frameRate: 12,
            repeat: 0
        });

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("warrior", {start: 0, end: 5}),
            frameRate: 10,
            repeat: 0
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

        this.anims.create({
            key: "death",
            frames: this.anims.generateFrameNumbers("warrior", {start: 26, end: 36}),
            frameRate: 10,
            repeat: 0
        })
    }

    update(cursors, enemies) {
        if (!this.playerIsDead) {
            this.playerMovement(cursors);
            enemies.getChildren().forEach(enemy => {
                this.playerKnockback(enemy);
                this.Attack(enemy);
            });
        }
    }
    //------------------------Scoring System-------------------------------------------------------

    //-----------------------Attack Handling-----------------------------------------------------------
    Attack(enemy){
        if (this.isAttacking && ((this.flipX && enemy.x < this.x) || (!this.flipX && enemy.x > this.x))) {
            if(this.anims.currentAnim.key === "attack" && Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) < 40) {
                if(this.anims.currentFrame.index === 5) {
                    enemy.takeHit(1);
                }
            } else if (this.anims.currentAnim.key === "attackHeavy" && Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) < 50) {
                if(this.anims.currentFrame.index === 4) {
                    enemy.takeHit(2);
                }
            }
        }
    }

//---------------------Hit/Damage handling-----------------------------------------------------------------------------
    playerKnockback(enemy){
        if (this.playerHit(enemy)) {
            const knockbackDirection = (this.x > enemy.x) ? 1: -1;
            this.hitSound.play();
            this.setVelocity(knockbackDirection* 50, -30);
        }
    }

    playerHit(enemy){
        if (enemy.hitPlayer && !this.hitRegistered && this.health >= 1) {
            this.hitRegistered = true;
            console.log("Player hit")
            this.health -= 1;
            this.healthText.setText(this.health + " HP");
            enemy.hitPlayer = false;
            this.anims.play("hit", true);
            this.scene.time.delayedCall(750, () => {
                this.hitRegistered = false;
            }, [],this);
            return true;
        } else if (this.health <= 0) {
            this.playerIsDead = true;
            this.playerDeath();
            return false;
        }
        return false;
    }

    playerDeath(){
        if (this.health <= 0) {
            this.body.setVelocity(0,0);
            this.womanGrunt3.play();
            this.anims.play("death", true);
        }
    }

    soundHandling(){
        if (this.anims.currentAnim) {
            if (this.anims.currentAnim.key === "attack") this.womanGrunt1.play();
            if (this.anims.currentAnim.key === "attackHeavy") this.womanGrunt2.play();
        }
    }

    //---------------------Player Movement Handling-----------------------------------------------------------------------------
    playerMovement(cursors) {
        //Player Movement Shorts
        const cursorsLeft = cursors.left.isDown;
        const cursorsRight = cursors.right.isDown;
        const cursorsUp = cursors.up.isDown;
        const cursorsDown = cursors.down.isDown;
        const cursorsSpace = cursors.space.isDown;
        const cursorsShift = cursors.shift.isDown;

        if(this.body.velocity.x !== 0 && this.body.blocked.down) {
            if(!this.runningGras.isPlaying) {
                this.runningGras.play();
            }
        } else {
            if(this.runningGras.isPlaying) {
                this.runningGras.pause();
            }
        }

        // Check if attacking
        this.isAttacking = this.anims.currentAnim && (this.anims.currentAnim.key === "attack" || this.anims.currentAnim.key === "attackHeavy");

        // If attacking, set velocity to 0 and skip movement logic
        if (this.isAttacking) {
            this.setVelocityX(0);
            this.setDrag(0, 0);
            return;
        }

        if (this.body.velocity.y < 0) {
            this.anims.play("hover");
        } else if (this.body.velocity.y > 30) {
            this.anims.play("falling", true);
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
            this.setOffset(35, 14);
            this.anims.play("run", true);
        }
        else if(cursorsRight && this.body.blocked.down) {
            this.setVelocityX(170);
            this.body.setOffset(19,14);
            this.flipX=false;
            this.anims.play("run", true);
        } else if (this.anims.currentAnim && this.anims.currentAnim.key === "slide") {
            // Maintain slide velocity
            if (this.flipX) {
                this.setVelocityX(-225);
            } else {
                this.setVelocityX(225);
            }
        }

        //Vertical movement
        if(cursorsUp) {
            if (!this.upFlag &&(this.body.blocked.down || this.jumpCount <= 1)) {
                this.setVelocityY(-200);
                this.womanGrunt4.play();
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
                this.body.setOffset(19, 14);
                this.flipX = false;
            } else if (!this.playerIsDead){
                const dampingForce = this.body.velocity.x * -0.1; // Adjust the damping factor as needed
                this.setAccelerationX(dampingForce);
            }
        } else {
            this.setAccelerationX(0);
        }


        if(cursorsSpace && this.body.blocked.down && !this.attackCooldown) {
            this.anims.play("attack", true);
            this.womanGrunt1.play();
            this.attackCooldown = true;
            this.scene.time.delayedCall(600, () => {
                this.attackCooldown = false;
            });
        }

        // if(cursorsSpace && !this.body.blocked.down) {
        //     this.anims.play("attack", true);
        //     this.setVelocityX(-100);
        // }

        if (cursorsShift && this.body.blocked.down && !this.attackCooldown) {
            this.anims.play("attackHeavy", true);
            this.attackCooldown = true;
            this.womanGrunt2.play();
            this.scene.time.delayedCall(1200, () => {
                this.attackCooldown = false;
            });
        }

        if (cursorsShift && !this.body.blocked.down) {
            this.anims.play("attackHeavy", true);
            this.attackCooldown = true;
            this.womanGrunt2.play();
            this.setVelocityY(100);
            this.scene.time.delayedCall(1200, () => {
                this.attackCooldown = false;
            });
        }

        if (this.body.onWall() && !this.body.blocked.down && this.body.velocity.y > 0) {
            this.anims.play("wallSlide", true);
            this.setVelocityY(100);
        }


        if (this.body.blocked.down && this.anims.currentAnim.key !== "hit") {
            this.upFlag = false;
            this.jumpCount = 0;
            if (!cursorsLeft && !cursorsRight && !cursorsUp) {
                if(this.anims.currentAnim.key === "run") this.anims.play("idle", true);
                this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {if(!this.playerIsDead) this.anims.play("idle", true);})
                this.setDrag(1000, 0);
            } else {
                this.setDrag(0, 0);
            }
        } else {
            this.setDrag(0, 0);
        }
    }
}

export default Player;