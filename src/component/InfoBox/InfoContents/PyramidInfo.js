import React, { Component } from 'react'

class PyramidInfo extends Component {
    render() {
        return (
            <div className='PyramidInfo'>
                <h1>Pyramid</h1>
                <h2>Game rules</h2>
                <p>
                    Each player will be assigned 4 cards. You will then have 30 seconds to <b>remember</b> your cards for the game.<br/><br/>
                    When the game starts, each player will have their 4 cards, hidden, in front of them. The <b>host</b> reveals the cards of the pyramid one by one.<br/><br/>
                    For every revealed card in the pyramid, every player can either <b>nominate</b> someone to drink, or do nothing. When you nominate someone you either:
                </p>
                <ul>
                    <li><b>Possess</b> the same number/figure card last revealed in the pyramid in your 4 hidden cards</li>
                    <li>Are <b>bluffing</b> and do not possess the last revealed card in the pyramid</li>
                </ul>
                <p>
                    The <b>nominee</b> has to choose to either:
                </p>
                <ul>
                    <li><b>ACCEPT</b> and drink the given amount</li>
                    <li><b>CALL OUT</b> bluff. In this case the person that nominated has to reveal 1 card of his hand:</li>
                    <ul>
                        <li>The person <b>fails</b> to show the right card (by mistake or because of bluff): the <b>nominator</b> drinks <b>double</b></li>
                        <li>The person <b>succeeds</b> to show the right card: the <b>nominee</b> drinks <b>double</b></li>
                    </ul>
                </ul>
                <p>
                    After everyone is done with nominating and drinking, the host can reveal the next card in the pyramid.
                </p>
                <p>
                    Notes:
                </p>
                <ul>
                    <li>If for a given card in the pyramid <b>nobody nominates</b> someone, everyone has to drink for that turn</li>
                    <li>You can double or triple the drinking amount if you possess (or bluff that you possess) the card multiple times</li>
                    <li>As for any game, decide with your friends the amount to drink. Note that amounts can easily be doubled with bluffing and mistakes. We suggest:</li>
                    <ul>
                        <li>Every card in the 1st layer of the pyramid: 1 sip</li>
                        <li>Every card in the 2nd layer of the pyramid: 2 sips</li>
                        <li>Etc.</li>
                        <li>Second to last layer: half chug</li>
                        <li>Last layer: chug</li>
                    </ul>
                </ul>
                <h2>Controls</h2>
                <p>
                    The <b>host</b> of the room controls the pyramid:
                </p>
                <ul>
                    <li><b>NEXT</b>-button: reveal the next card in the pyramid</li>
                    <li><b>UNDO</b>-button: hide the last revealed card in the pyramid</li>
                    <li><b>END GAME</b>-button: end the game (button appears when all cards from the pyramid are revealed)</li>
                </ul>
                <p>
                    <b>All players</b> can control their own set of cards:
                </p>
                <ul>
                    <li><b>Reveal</b> a card from your hand by clicking on the card (this card will be visible to every player)</li>
                    <li><b>Hide</b> a card from your hand by clicking on the revealed card again</li>
                    <li>Cards will automatically hide after 5 seconds</li>
                </ul>
            </div>
        )
    }
}

export default PyramidInfo