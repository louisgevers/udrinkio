import React, { Component } from 'react'

class FTheDealerInfo extends Component {
    render() {
        return (
            <div className='FTheDealerInfo'>
                <h1>F*ck the Dealer</h1>
                <h2>Game rules</h2>
                <p>
                    The <b>dealer</b> holds the deck of cards in his or her hands and can see the first card on the deck.<br/><br/>
                    Players take turns <b>clockwise</b> (numbers under nicknames are given to help you) to guess the card:
                </p>
                <ul>
                    <li><b>1st try</b>: the player can guess any card besides 6, 7, or 8</li>
                    <ul>
                        <li><b>CORRECT</b> guess: the dealer reveals the card and drinks, next player's turn</li>
                        <li><b>INCORRECT</b> guess: the dealer tells the player whether the card is higher or lower than the given guess</li>
                    </ul>
                    <li><b>2nd try</b>: the player can guess any card now</li>
                    <ul>
                        <li><b>CORRECT</b> guess: the dealer reveals the card and drinks, next player's turn</li>
                        <li><b>INCORRECT</b> guess: the dealer reveals the card and the player drinks, next player's turn</li>
                    </ul>
                </ul>
                <p>
                    The <b>3rd player</b> that fails in a row becomes the <b>new dealer</b>.<br/><br/>
                    Notes:
                </p>
                <ul>
                    <li>When all cards of a given number (depending on the game setting) are on the table, the cards are turned on their back.</li>
                    <li>As for any game, decide with your friends the amount to drink. We suggest:</li>
                    <ul>
                        <li><b>1st try CORRECT</b>: dealer drinks half a chug</li>
                        <li><b>2nd try CORRECT</b>: dealer drinks 5 sips</li>
                        <li><b>2nd try INCORRECT</b>: player drinks the difference between the cards (e.g. if the player guessed 7 but the card is a 5, drink 2 sips)</li>
                    </ul>
                </ul>
                <h2>Controls</h2>
                <p>
                    The <b>dealer</b> holds the deck:
                </p>
                <ul>
                    <li>The next card is not visible:</li>
                    <ul>
                        <li><b>NEXT CARD</b>-button: reveal the next card (only the dealer sees the next card)</li>
                        <li><b>ASSIGN DEALER</b>-button: assign the given player as the new dealer</li>
                        <li><b>UNDO</b>-button: if you just revealed a card to everyone by mistake, you can hide it back in your hand</li>
                    </ul>
                    <li>The next card is visible:</li>
                    <ul>
                        <li><b>SHOW CARD</b>-button: reveal the current card to everyone (puts the card on the table)</li>
                    </ul>
                </ul>
            </div>
        )
    }
}

export default FTheDealerInfo