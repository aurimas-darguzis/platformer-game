import Player from '../prefabs/Player'
import Mouse from '../prefabs/Mouse'
import NumberBox from '../prefabs/NumberBox'

export default class Level1 extends Phaser.State {
  constructor () {
    super()
  }

  create () {
    // physics
    this.physics.startSystem(Phaser.Physics.ARCADE)
    this.physics.arcade.gravity.y = 800 // what are min and max values?

    // map start
    this.map = this.add.tilemap('level1')

    // paralax background
    this.map.addTilesetImage('gamebg')
    this.bg = this.map.createLayer('bg')
    this.bg.scrollFactorX = 0.6
    this.bg.scrollFactorY = 0.6

    // walkable tiles
    this.map.addTilesetImage('Tiles')
    this.layer = this.map.createLayer('Level1')

    // collision
    this.layer.resizeWorld()
    this.map.setCollisionBetween(6, 25, true, this.layer)

    // coin layer
    this.coins = this.add.group()
    this.coins.physicsBodyType = Phaser.Physics.ARCADE
    this.coins.enableBody = true
    this.map.createFromObjects('Collectables', 41, 'coin', null, true, false, this.coins)
    this.coins.setAll('body.gravity', 0)

    // place doors
    this.doors = this.add.group()
    this.doors.physicsBodyType = Phaser.Physics.ARCADE
    this.doors.enableBody = true
    this.map.createFromObjects('doors', 242, 'sign', null, true, false, this.doors)
    this.doors.setAll('body.gravity', 0)
    
    // player
    this.map.createFromObjects('player', 243, null, null, true, false, this.world, Player)
    this.player = this.world.getTop()

    // place enemies
    this.enemies = this.add.group()
    this.map.createFromObjects('enemies', 25, null, null, true, false, this.enemies, Mouse)
    this.enemies.setAll('player', this.player)

    // UI
    this.UIGroup = this.add.group()
    this.scoreField = new NumberBox(this.game, 'scoreholder', this.game.score, this.UIGroup)
    this.scoreField.fixedToCamera = true

    // sound
    this.sfx = this.add.audioSprite('sfx')

    this.camera.follow(this.player)

  }

  update () {
    // collect coin
    // hit enemy
    // keep track of score
  }

  collectCoin (playerRef, coinRef) {

  }

  hitDoor (playerRef, doorRef) {

  }

  hitEnemy (playerRef, enemyRef) {

  }
}