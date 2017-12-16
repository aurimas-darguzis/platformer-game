export default class GameOver extends Phaser.State {
    create () {
        this.add.spite(0, 0, 'gameover_bg')
        const style = { font:  '30px Arial', align: 'center', fill: '#fff'}
        this.txtValue = this.add.text(512, 534, this.game.score.toString() + ' points', style)
        this.game.input.onDown.addOnce(this.switchState, this)
    }

    switchState () {
        this.game.score = 0
        this.state.start('Level1')
    }
}
