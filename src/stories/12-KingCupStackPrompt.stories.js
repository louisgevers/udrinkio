import React from 'react'
import KingCupStackPrompt from '../component/GameScreen/KingCupGame/KingCupStackPrompt/KingCupStackPrompt'

export default {
    title: 'KingCupStackPrompt',
    component: KingCupStackPrompt
}

export const Simple = () => <KingCupStackPrompt game={game} username={'Louis'} timer={5} />

const game = {
    "id": "kingcup",
    "name": "KINGS",
    "minPlayers": 2,
    "maxPlayers": 12,
    "imageName": "king-cup.png",
    "primaryColor": "#FC0F3B",
    "primaryDark": "#C01A38",
    "secondaryColor": "#3FA2BE"
}