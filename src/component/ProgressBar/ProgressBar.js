import React, { Component } from 'react'
import './ProgressBar.css'

class ProgressBar extends Component {
    render = () => {
        return (
            <div className='ProgressBar'>
                <div className='bar-container'>
                    <div className='bar-content' style={{width: `${this.props.progress}%`, backgroundColor: this.props.color}}></div>
                </div>
                <span className='bar-description'>{this.props.description}</span>
            </div>
        )
    }
}

export default ProgressBar