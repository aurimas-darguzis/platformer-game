import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.load.image('preloader', '../assets/images/loading_bar.png')
  }
  
  render () {
    this.state.start('Splash')
  }
}
