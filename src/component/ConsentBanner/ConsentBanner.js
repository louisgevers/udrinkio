import React, { Component } from 'react'
import './ConsentBanner.css'

class ConsentBanner extends Component {
    render = () => {
        return (
            <div className='ConsentBanner'>
                <div className='banner-content'>
                    <p>Udrink.io uses cookies to analyse website usage for future improvements.</p>
                    <button className='read-more-button' onClick={this.props.onReadMore}>What does this mean?</button>
                    <button className='refuse-button' onClick={this.props.onRefuse}>Remind me later</button>
                    <button className='accept-button' onClick={this.props.onAccept}>Alright</button>
                </div>
                
            </div>
        )
    }
}

export default ConsentBanner