/**
 * The player character in this game is a fox. This game is built
 * to run on the keyboard, so the fox is going to need to respond
 * to the standard cursor keys for left and right movements and the
 * spacebar will cause to jump.
 */

export default class Player extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'player', 0)

    /**
     * Let's get to move the fox and animate fluidity. To get things started,
     * there are series of object-level variables that we will be using here.
     * Speed, airSpeed and jumPower are used to control the speed and the
     * character moves. To give the fox a bit more responsive feel, he will have
     * a different speed when in air.
     */
    this.speed = 400
    this.airSpeed = 300
    this.jumpPower = 600

    /**
     * This requires that the fox was in the air last frame and
     * has hit the ground on the current update frame.
     */
    this.inAir = true
    this.hitGround = false

    /**
     * Let's set up player physics and animations. Much of it is basic animation setup,
     * but there are a few important parts of the setup that either are tweakable or will
     * come up later in the player object.
     */
    this.animations.add('idle', [0, 1, 2, 3, 4, 3, 2, 1])
    this.animations.add('jump', [0, 5, 6, 7, 8, 9])
    this.animations.add('run', [11, 12, 13, 14, 15, 16, 17])
    
    /**
     * Land animation that will be referenced later, but it is stored in an object-level variable.
     */
    this.landAnimation = this.animations.add('land', [7, 6, 5])

    this.game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = true

    /**
     * Drag is an important property to tweak to get a character's motion feeling correct.
     * In this case, we want him to have a snappy start and stop feeling when moving horizontally.
     * A large drag in the x direction will pull him to a stop quickly. The drag is set to zero for
     * the y-axis because the fox doesn't need any effects of air resistance in this game. The hitbox
     * is reduced to a size that won't aggravate the player via the setSize method of the physics body.
     * The new collision box is located in the middle of the character. Finally, the anchor point (from
     * which he will rotate and scale around) is set to the center bottom point of the sprite. Later on,
     * we will be 'flipping' this character to face right and left by changing his scale, and this prevents
     * him from flipping around on the back of his tail.
     */
    this.body.drag = { x: 600, y: 0 }
    this.body.setSize(60, 100)
    this.anchor.setTo(0.5, 1)
    this.cursor = this.game.input.keyboard.createCursorKeys()
    this.jumpButton = this.game.input.addKey(Phaser.Keyboard.SPACEBAR)
    this.jumpButton.onDown.add(this.jump, this)

    this.animations.play('idle', 9, true)

    /**
     * The last interesting part of the setup function is addition of a chained tween to the sprite.
     * This animation is stored in an object-level variable, so it can be stopped and reused without
     * having to create a new animation every time a flash is needed.
     */
    this.flashEffect = this.game.add.tween(this)
      .to({alpha: 0}, 50, Phaser.Easing.BounceOut)
      .to({alpha: 0.8}, 50, Phaser.Easing.BounceOut)
      .to({alpha: 1}, 150, Phaser.Easing.BounceOut)
  }

  animationState () {
    if (this.hitGround) {
      this.animations.play('land', 15)
    } else if (!this.inAir && !this.landAnimation.isPlaying) {
      if (Math.abs(this.body.velocity.x) > 4) {
        this.animations.play('run', 9, true)
      } else if (this.body.onFloor()) {
        this.animations.play('idle', 9, true)
      }
    }
  }

  update () {
    this.hitGround = false
    const wasAir = this.inAir
    this.inAir = !this.body.onFloor()

    if (this.inAir != wasAir && this.body.velocity > 0) {
      this.hitGround = true
    }

    this.animationState()

    this.speedToUse = this.inAir ? this.airSpeed : this.speed

    if (this.cursor.left.isDown) {
      this.scale.x = -1
      this.body.velocity.x = -this.speedToUse
    }

    if (this.cursor.right.isDown) {
      this.scale.x = 1
      this.body.velocity.x = this.speedToUse
    }
  }

  jump () {
    if (this.body.onFloor() === true) {
      this.body.velocity.y = -this.jumpPower
      this.animations.play('jump', 30)
      this.doubleJump = true
    } else if (this.doubleJump === true) {
      console.log('doubleJump: ', this.doubleJump)
      this.doubleJump = false
      this.body.velocity.y = -this.jumpPower
      this.anmations.play('jump', 30)
    }
  }

  flash () {
    if (!this.flashEffect.isRunning) {
      this.flashEffect.start()
    }
  }
}
