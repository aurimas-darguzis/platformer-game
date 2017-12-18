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

    /**
     * The jump is handled by a key down handler.
     */
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

  /**
   * Let's hand the animation. It has been placed into separate method so as much of the animation can
   * be done in one place and not get lost throughout all the other portions of the player's update and
   * state code.
   * First, if the player has just hit the ground, then the landing animation is triggered. While it is
   * only a few frames, the bit of down and compression on the character when he lands imparts a good and
   * solid 'landing feeling'.
   * If the player is not in the process of landing and they are on the ground, the game then checks the
   * player's speed. If they're moving fast enough on the x-axis (the Math.abs removing the need to deal
   * with negative speed), then the run animation is activated for this sprite. If they player isn't moving
   * fast enough to warrant a run animation, the idle is played instead. Because the check for the switch to
   * idle transition still contains some movement for the character, fox will slide slightly to a complete stop.
   */
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

  /**
   * Now that the player is set up, the next step is to implement the player's custom
   * update method. The first step of this process is to place the object into the right
   * animation state. This game object has animations for running, standing, jumping, falling,
   * and hitting the groud. For the animations to work properly, the prefab needs to track the
   * properties that relate to those animations and trigger a change when sonemthing significant
   * happens. The factors that affect the player's are if it is currently airborne or if just
   * hit the ground and should trigger the hit ground animation.
   */
  update () {
    /**
     * We need to track these states. First, inAir state of the object is stored from the last frame,
     * which will be contrasted later on with the current in air state to determine if the player just
     * hit the ground. Next, using `this.body.onFloor`, the player updates its inAir state. Finally, the
     * hitGround property is set to false to ensure the value will only be 'true' frame when it hits the ground.
     * There are two conditions that need to be met for the hitGround property to be true. First, the fox needs
     * to be in the air last update, and on the ground this update. Also the player needs to be falling downward
     * (meaning they need a downward velocity greater than zero).
     * Once the general state of the player has been property set, a method is called to actually figure out
     * which animation should be currently playing.
     */
    this.hitGround = false
    const wasAir = this.inAir
    this.inAir = !this.body.onFloor()
    if (this.inAir != wasAir && this.body.velocity > 0) {
      this.hitGround = true
    }
    this.animationState()

    /**
     * The next step is to move the player. The actual movement code is a simple test to see if the left or right
     * arrows are depressed and to add velocity to the object if they are. Because the player has a varied speed based
     * on his grounded state, the speed to use as his velocity is stored in a vaible beforehand. If the player is in the
     * sky, then speedToUse will default to the left side of the colon in the first line (this.airSpeed). If the player is
     * grounded the right side of the colon (this.speed) will be the speed that will be used for the player motion.
     * Based on the direction the player is inputting to the keyboard, the player sprite will be flipped right or left by changing
     * its scale.x to be positive (facing right) or negative (facing left).
     */
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

  /**
   * This handler will implement a double jump, so there are two sets of
   * jump conditions to be validated. For the first jump, it is only necessary to check to see if the player is on the ground.
   * If they are, they are given an upward velocity equal to the jump power configured in the constructor.
   * The jump animation is triggered and the doubleJump flag is set to true.
   * If the jump button is pressed and the player is not on the ground, the double jump flag is checked. If it
   * is 'true', then the player can jump again. The same impulse and animation are applied, and the double jump flag is deactivated.
   * The player will not be able to use another jump in the sky until they jump from the ground again and reset the doubleJump variable.
   */
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

  /**
   * It is a simple method that will play the flash animation that was configured in the constructor.
   * The only other special consideration in this method is to ensure that it will not restart the
   * animation every time the flash method is called. This will give the animation the time it needs
   * to actually play through its whole duration, so the player will actually flash and not just fade.
   */
  flash () {
    if (!this.flashEffect.isRunning) {
      this.flashEffect.start()
    }
  }
}
