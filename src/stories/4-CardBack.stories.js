import React from 'react';
import CardBack from '../component/GameScreen/CardBack/CardBack.js';

export default {
    title: 'CardBack',
    component: CardBack
}

export const Simple = () => <CardBack game={games[0]} />;

export const AllCards = () => 
<div>
    {games.map((game, index) => {
        return <CardBack key={index} game={game} />
    })}
</div>

const games = [
    {
        "id": "pyramid",
        "name": "PYRAMID",
        "minPlayers": 2,
        "maxPlayers": 6,
        "imageName": "pyramid.png",
        "primaryColor": "#6D534B",
        "primaryDark": "#5C4944",
        "secondaryColor": "#EEB711"
    },
    {
        "id": "horserace",
        "name": "HORSE RACE",
        "minPlayers": 2,
        "maxPlayers": 6,
        "imageName": "horse-race.png",
        "primaryColor": "#3FA2BE",
        "primaryDark": "#3B8194",
        "secondaryColor": "#FC0F3B"
    },
    {
        "id": "kingcup",
        "name": "KING CUP",
        "minPlayers": 2,
        "maxPlayers": 6,
        "imageName": "king-cup.png",
        "primaryColor": "#FC0F3B",
        "primaryDark": "#C01A38",
        "secondaryColor": "#3FA2BE"
    },
    {
        "id": "triviaquizz",
        "name": "TRIVIA QUIZ",
        "minPlayers": 2,
        "maxPlayers": 8,
        "imageName": "quiz.png",
        "primaryColor": "#EEB711",
        "primaryDark": "#B68F1B",
        "secondaryColor": "#6D534B"
    },
    {
        "id": "minefield",
        "name": "MINE FIELD",
        "minPlayers": 2,
        "maxPlayers": 6,
        "imageName": "minefield.png",
        "primaryColor": "#333333",
        "primaryDark": "#111111",
        "secondaryColor": "#FC0F3B"
    }
]