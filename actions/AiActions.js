export function followPlayer(enemy,player){
    let distance = Math.sqrt(Math.pow((Math.abs( enemy.body.center.x - player.body.center.x)),2) + Math.pow(Math.abs(enemy.body.center.y - player.body.center.y), 2));
    if (distance < 200 && distance > 50 && enemy.anims.currentAnim.key !== "stab" || !enemy.anims.isPlaying ) {
        if (player.body.center.x < enemy.body.center.x) {
            enemy.body.setVelocityX(-100);
            enemy.flipX = true;
            enemy.anims.play("walk", true);
        } else if (player.body.center.x > enemy.body.center.x) {
            enemy.body.setVelocityX(100);
            enemy.flipX = false;
            enemy.anims.play("walk", true);
        }
    } else if (distance <= 50) {
        enemy.debugGraphics.clear();
        enemy.body.setVelocityX(0);
        enemy.anims.play("stab", true);
        enemy.attackPlayer(player);
    }
}

export function otherFunktion(){

}
