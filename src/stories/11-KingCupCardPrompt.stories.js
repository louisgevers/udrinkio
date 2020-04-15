import React from 'react'
import KingCupCardPrompt from '../component/GameScreen/KingCupGame/KingCupCardPrompt/KingCupCardPrompt'

export default {
    title: 'KingCupCardPrompt',
    component: KingCupCardPrompt
}

export const Simple = () => <KingCupCardPrompt game={session.game} isTurn={false} card={'9c'} order={session.order} />

const session = {
    game: 
    {
        "id": "kingcup",
        "name": "KINGS",
        "minPlayers": 2,
        "maxPlayers": 12,
        "imageName": "king-cup.png",
        "primaryColor": "#FC0F3B",
        "primaryDark": "#C01A38",
        "secondaryColor": "#3FA2BE"
    },

    order: [
        {
            "username": "louis",
            "userId": 42
        },
        {
            "username": "arthur",
            "userId": 51
        },
        {
            "username": "panda",
            "userId": 2
        }
    ]
}