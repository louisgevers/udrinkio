import * as Pixi from 'pixi.js'

export default class Button extends Pixi.Container {

    constructor(text, color) {
        super()
        this.create(text, color)
    }

    create = (text, color) => {
        const buttonText = new Pixi.Text(text)
        buttonText.style = {
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: '14px',
            fill: 'white',
            fontWeight: 'normal'
        }
        buttonText.resolution = 2

        const buttonBgr = new Pixi.Graphics()
        buttonBgr.beginFill(parseInt(color.replace('#', '0x')), 1);
        const width = buttonText.width + 20
        const height = buttonText.height + 10
        buttonBgr.drawRoundedRect(0, 0, width, height, height / 5);
        buttonBgr.endFill();

        this.addChild(buttonBgr)
        this.addChild(buttonText)

        buttonText.x = this.width / 2 - buttonText.width / 2
        buttonText.y = this.height / 2 - buttonText.height / 2
        
        this.text = buttonText
        this.background = buttonBgr

        this.interactive = true
        this.buttonMode = true

        this.on('mousedown', () => {
            this.text.style.fill = 'black'
        }, this)
        
        this.on('mouseout', () => {
            this.text.style.fill = 'white'
        })
        
        this.on('mouseup', () => {
            this.text.style.fill = 'white'
        })
    }
}