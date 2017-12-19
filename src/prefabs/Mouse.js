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
     * First, let's check of the player is near enough to make an attack. The distance between the mouse and the player is calculated
     * using Phaser's built-in distance method. Distance in this case is thge length of the line from the player's anchor
     * point to the mouse's anchor point.
     */
    const dist = Phaser.Math.distance(this.x, this.y, this.player.x, this.player.y)

    /**
     * The next portion checks to see if the player qualifies as 'close enough' based on the distance between the mouse and player.
     * The 'magic number' of 210 has been provided in here because it gives a very good feel to the reaction time of the mouse,
     * but you are free to play with this number to get values for a very lazy mouse or one that really just wants to swing its sword a lot.
     * If the player is close enough, the swing animation is triggered, abnd the mouse is flipped to face player. The flip (scaling left or right)
     * is based on the location of the mouse relative to the player. If the player's x location is less than the mouse's x position, then the mouse needs to face left
     * to swing, or vice versa, for right.
     */
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
/**
 * Note: Where does the Player Object come from?
 * 
 * Nowhere in the mouse's code is the player expicitly set. The player reference will be provided in the game state code right
 * after the mouse is created. Look for the line 'this.enemies.setAll('player', this.player)' to se how the reference is provided.
 */