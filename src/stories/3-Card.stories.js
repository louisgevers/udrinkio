import React from 'react';
import Card from '../component/GameScreen/Card/Card.js';

export default {
    title: 'Card',
    component: Card
}

export const Simple = () => <Card cardId={'1s'} />;

export const TwoCards = () => 
<div>
    <Card cardId={'1s'} />
    <Card cardId={'qh'} />
</div>