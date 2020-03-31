import React, { Component } from 'react'
import './Prompt.css'

class Prompt extends Component {

    headerStyle = () => {
        const style = {
            color: this.props.secondaryColor
        }
        if (typeof this.props.onClose === 'undefined') {
            style.marginLeft = 'auto'
            style.marginRight = 'auto'
        }
        return style
    }

    render() {
        return (
            <div className='Prompt' onClick={this.handleClick}>
                <div className='prompt-container'>
                    <div className='prompt-header' style={{backgroundColor: this.props.primaryColor}}>
                        {typeof this.props.onClose !== 'undefined' && <button className="prompt-cancel-button" onClick={this.props.onClose}>
                            <span className="material-icons">close</span>
                        </button>}
                        <h2 style={this.headerStyle()}>
                            {this.props.title}
                        </h2>
                    </div>
                    <div className='prompt-body'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }

    handleClick = (e) => {
        if (typeof this.props.onClose !== 'undefined' && e.target.className === "Prompt") {
            this.props.onClose()
        }
    }
}

export default Prompt