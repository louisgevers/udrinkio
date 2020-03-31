import React, { Component } from 'react'
import './InfoBox.css'

class InfoBox extends Component {
    
    constructor(props) {
        super(props)
        this.infoContainer = React.createRef()
        this.helpButton = React.createRef()
    }

    render() {
        return (
            <div className='InfoBox'>
                <div ref={this.infoContainer} className='info-container'>
                    <p>{this.props.info}</p>
                    <button class='close-button' onClick={this.hideInfo}>
                        <span className='material-icons'>
                            close
                        </span>
                    </button>
                </div>
                <button ref={this.helpButton} class='help-button' onClick={this.displayInfo}>
                    <span className='material-icons'>
                        help
                    </span>
                </button>
            </div>
        )
    }

    displayInfo = () => {
        this.infoContainer.current.style.display = 'block'
        this.helpButton.current.style.display = 'none'
    }

    hideInfo = () => {
        this.infoContainer.current.style.display = 'none'
        this.helpButton.current.style.display = 'block'
    }
    
}

export default InfoBox