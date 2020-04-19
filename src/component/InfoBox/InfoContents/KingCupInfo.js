import React, { Component } from 'react'

class KingCupInfo extends Component {
    render() {
        return (
            <div className='KingCupInfo'>
                <h1>Kings</h1>
                <h2>Game Rules</h2>
                <p>
                    When it is your turn, pick a card from the circle.<br/><br/>
                    Each card has an associated rule. These will be given when you draw the card. Feel free to use your own rules!<br/><br/>
                    When you are ready with card (after having executed the rule), stack the card on the bottle. The more cards stacked on the bottle, the higher the chance that the stack falls.<br/><br/>
                    The player that makes the stack fall has to drink!
                </p>
                <h2>Controls</h2>
                <ul>
                    <li><b>CARD</b>s around the bottle: click on one card to pick it (when it is your turn)</li>
                    <li><b>STACK</b>-button: stack the card on the bottle (small chance of falling)</li>
                    <li><b>END GAME</b>-button: appears when all cards are picked, allows everyone to quit the game or to play again</li>
                </ul>
            </div>
        )
    }
}

export default KingCupInfo