import React, { Component } from 'react'

class MineFieldInfo extends Component {
    render() {
        return (
            <div className='MineFieldInfo'>
                <h1>Mine Field</h1>
                <h2>Game Rules</h2>
                <p>
                    When it is your turn, pick a card.<br/><br/>
                    If the card is red, you can nominate someone to drink. If the card is black, you have to drink.<br/><br/>
                    Decide with your friends the amount you should drink. Some examples are:
                </p>
                <ul>
                    <li>Numbers: 1 sip; Figures (jack, queen, king): 3 sips.</li>
                    <li>Numbers: represent the amount of sips (7 sips for 7 of hearts); Figures (jack, queen, king) represent chugs.</li>
                </ul>
                <p>
                    If there is a card with the <b>same number</b> (different sign) on the <b>same line</b> or the <b>same column</b> of the card you picked, the amount to drink is doubled. If there are two such cards, the amount is tripled, etc.<br/><br/>
                    Feel free to adapt or add rules!
                </p>
                <h2>Controls</h2>
                <ul>
                    <li><b>CLICK</b> on a card: picks the card (when it is your turn)</li>
                    <li><b>END GAME</b>-button: appears when all cards are picked, allows everyone to quit the game or play again</li>
                </ul>
            </div>
        )
    }
}

export default MineFieldInfo