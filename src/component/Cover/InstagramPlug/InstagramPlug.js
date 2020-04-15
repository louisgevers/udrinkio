import React, { Component } from 'react'
import './InstagramPlug.css'

class InstagramPlug extends Component {
    render = () => {
        return (
            <div className='InstagramPlug'>
                <i className='fa fa-instagram'></i>
                <span className='instagram-text'>
                    &nbsp;Join us on instagram <a href='https://www.instagram.com/udrink.io/' target='_blank'>@udrink.io</a>
                </span>
            </div>
        )
    }
}

export default InstagramPlug