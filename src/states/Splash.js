import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

/**
 * This game will load in a lot fo image and sound files. It needs sprite sheets for the
 * animated player and mouse, which have some beautiful animations and images that will
 * be used for the world foreground and background. The map data for the two levels is loaded in,
 * using the tiled_json format, so we can access the extra data that Tiled export with its specific
 * maps. Some images are loaded in for other game objects, like signs, collectrables, UI elements.
 * Also audio sprite is loaded. Multiple formats are used for browser compatibility.
 */
export default class extends Phaser.State {
  constructor () {
    super()
    this.asset = null
    this.ready = false
  }

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
  }

  create () {
    this.add.sprite(0, 0, 'loading_bg')
    this.asset = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloader')
    this.asset.anchor.setTo(0.5, 0.5)
    // this.loaderBar.onLoadComplete.addOnce(this.onLoadComplete, this)
    this.load.setPreloadSprite(this.asset)

    this.load.spritesheet('player', 'assets/images/sprites/FoxSprite.png', 210, 210)
    this.load.spritesheet('mouse', 'assets/images/sprites/MouseSprite.png', 165, 160)
    this.load.image('gamebg', 'assets/images/Background.png')
    this.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.tilemap('level2', 'assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('Tiles', 'assets/images/Tiles.png')
    this.load.image('coin', 'assets/images/coin.png')
    this.load.image('scoreholder', 'assets/images/scoreholder.png')
    this.load.image('sign', 'assets/images/sign.png')
    this.load.image('gameover', 'assets/images/gameover_bg.png')
    this.load.audiosprite('sfx', ['assets/sounds/sfx.mp3', 'assets/sounds/sfx.ogg'], 'assets/sounds/sfx.json')

    this.load.start()
  }

  update () {
    if (this.ready) {
      this.game.state.start('game')
    }
  }

  onLoadComplete () {
    this.ready = true
  }
}


// http://www.html5gamedevs.com/topic/27846-issue-with-loading-assets/