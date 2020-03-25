import React from 'react';
import ChatContent from '../component/Chat/ChatContent/ChatContent.js'

export default {
    title: 'ChatContent',
    component: ChatContent
}

export const Messages = () => <ChatContent chatMessages={messages} roomUserId={id} />;

// DATA

const id = 2

const messages = [
    {
        username: "Louis",
        userId: id,
        message: "welcome"
    },
    {
        username: "Arthur",
        userId: 1,
        message: "hello"
    },
    {
        username: "Arthur",
        userId: 1,
        message: "ca va?"
    },
    {
        
        username: "Louis",
        userId: id,
        message: "ouai et toi?"

    }
]