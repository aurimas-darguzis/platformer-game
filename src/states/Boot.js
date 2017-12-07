import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#EDEEC9'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', '../../assets/images/loading_bg.jpg')
    this.load.image('loaderBar', '../../assets/images/loading_bar.png')

    /**
     * Sprites for animated player and mouse, which have some animations and images for backgorund and foreground.
     * The map data for 2 levels, using tiled_json format.
     * Images - signs, collectables, UI elements.
     * Audio sprite
     */
    this.load.spritesheet('player', '../assets/images/sprites/FoxSprite.png', 210, 210)
    this.load.image('gameBg', '../assets/images/Background.png')
    this.load.tilemap('level1', '../assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.tilemap('level2', '../assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('Tiles', '../assets/images/Tiles.png')
    this.load.image('coin', '../assets/images/coin.png')
    this.load.image('scoreholder', '../assets/images/scoreholder.png')
    this.load.image('sign', '../assets/images/scoreholder.png')
    this.load.image('gameover_bg', '../assets/images/gameover_bg.png')
    this.load.audiosprite('sfx', ['../assets/sounds/sfx.mp3', '../assets/sounds/sfx.ogg'], '../assets/sounds/sfx.json')
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
