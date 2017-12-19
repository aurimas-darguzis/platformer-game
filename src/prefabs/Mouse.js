/**
 * The next unique prefab in this game is the mouse prefab that will act as the
 * enemy and obstacle in the game. They are not going to be the smartest of mice
 * and will simply patrol back and forth. Should the fox get near enough to bother
 * them, they will stop and slash at the player but the moment the fox gets out of
 * their 'anger zone', they will resume their patrol.
 */
export default class Mouse extends Phaser.Sprite {
  /**
   * The constructor for the mouse does many of the basic setup functions to get
   * a sprite into a 2D world including setting up its drag, adding animations, and
   * placing the anchor at the center of the sprite so it can be flipped widthwise.
   * 
   * @param {*} game 
   * @param {*} x 
   * @param {*} y 
   * @param {*} player 
   */
  constructor (game, x, y, player) {
    super(game, x, y, 'mouse', 0)

    /**
     * Game object variables
     */
    this.speed = 200
    this.jumpPower = 600

    /**
     * This control patrol area and where the mouse starts on patrol.
     * stepLimit - is the number of steps that the mouse can take in any direction before it will turn
     * around and start walking in the other direction. The currentStep is where the mouse is on its step limit and is initialized
     * as a random number within the step limit. Setting each mouse to a random starting point in its patrol
     * helps to randomise the direction the mice in the game are facing. With the random starting points, the mice
     * will change directions at different times in the game instead of all of them doing an about-face at exactly
     * the same time.
     */
    this.stepLimit = 90
    this.facing = 0
    this.currentStep = Math.floor(Math.random() * this.stepLimit)
    this.player = player

    /**
     * Animations
     */
    this.animations.add('stand', [0])
    this.swingAnimation = this.animations.add('swing', [0, 1, 2, 3, 4, 5, 6, 7])
    this.animations.add('run', [8, 9, 10, 11, 12, 13, 14])

    this.game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = true
    this.body.drag = { x: 600, y: 0 }
    this.body.setSize(60, 80)
    this.anchor.setTo(0.5, 1)

    this.animations.play('run', 9, true)
  }

  /**
   * This method handles moving the mouse forward, flipping it around when it has reached the limits
   * of its patrol, and attacking the player when it gets too near.
   */
  update () {
    /**
     * 
     */
    const dist = Phaser.Math.distance(this.x, this.y, this.player.x, this.player.y)

    if (Math.random(dist) < 210) {
      this.animations.play('swing', 9)

      if (this.x < this.player.x) {
        this.scale.x = 1
      } else {
        this.scale.x = -1
      }
    }

    if (!this.swingAnimation.isPlaying) {
      this.currentStep++
      this.body.velocity.x = this.speed

      this.animations.play('run', 9, true)

      this.scale.x = (this.speed > 0) ? 1 : -1

      if (this.currentStep >= this.stepLimit) {
        this.speed *= -1
        this.currentStep = 0
      }
    }
  }
}
