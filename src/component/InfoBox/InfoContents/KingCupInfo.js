import React, { Component } from 'react'

class KingCupInfo extends Component {
    render() {
        return (
            <div className='KingCupInfo'>
                <h1>King Cup</h1>
                <p>
                    When it is your turn, pick a card from the circle.<br/><br/>
                    Each card has an associated rule. These will be given when you draw the card. Feel free to use your own rules!<br/><br/>
                    When you are ready with card (after having executed the rule), stack the card on the bottle. The more cards stacked on the bottle, the higher the chance that the stack falls.<br/><br/>
                    The player that makes the stack fall has to drink!
                </p>
            </div>
        )
    }
}

export default KingCupInfo