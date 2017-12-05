export default class Player extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'player', 0)

    /**
     * game object level variables
     */
    this.speed = 400
    this.airSpeed = 300
    this.jumpPower = 600
    this.inAir = true
    this.hitGround = false

    /**
     * animations
     */
    this.animations.add('idle', [0, 1, 2, 3, 4, 3, 2, 1])
    this.animations.add('jump', [0, 5, 6, 7, 8, 9])
    this.landAnimation = this.animations.add('land', [7, 6, 5])
    this.animations.add('run', [11, 12, 13, 14, 15, 16, 17])

    this.game.physics.enable(this, Phaser.Physics.ARCADE)
  }
}
