import React, { Component } from 'react'
import './InfoBox.css'

class InfoBox extends Component {
    
    constructor(props) {
        super(props)
        this.infoContainer = React.createRef()
        this.helpButton = React.createRef()
        // this.infoContentComponent = React.lazy(() => import('../InfoBox/InfoContents/MineFieldInfo.js'))
    }

    render() {
        const InfoComponent = typeof this.props.infoComponent !== 'undefined' ? require(`../InfoBox/InfoContents/${this.props.infoComponent}`).default : require(`../InfoBox/InfoContents/EmptyInfo.js`).default
        return (
            <div className='InfoBox'>
                <div ref={this.infoContainer} className='info-container'>
                    {
                        (typeof InfoComponent !== 'undefined') &&
                            <InfoComponent></InfoComponent>
                    }
                    <button className='close-button' onClick={this.hideInfo}>
                        <span className='material-icons'>
                            close
                        </span>
                    </button>
                </div>
                <button ref={this.helpButton} className='help-button' onClick={this.displayInfo}>
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