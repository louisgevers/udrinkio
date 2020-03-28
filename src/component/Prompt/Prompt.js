import React, { Component } from 'react'
import './Prompt.css'

class Prompt extends Component {
    render() {
        return (
            <div className='Prompt' onClick={this.handleClick}>
                <div className='prompt-container'>
                    <div className='prompt-header' style={{backgroundColor: this.props.primaryColor}}>
                        <button className="prompt-cancel-button" onClick={this.props.onClose}>
                            <span className="material-icons">close</span>
                        </button>
                        <h2 style={{color: this.props.secondaryColor}}>
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
        if (e.target.className === "Prompt") {
            this.props.onClose()
        }
    }
}

export default Prompt