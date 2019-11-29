import React from 'react'
import FocusGuard from '../src/focusguard'

export default class extends React.Component {
  constructor() {
    super()

    this.state = {
      modalVisible: false,
    }
  }

  _handleFocus = () =>
    console.log('focus - activeElement', document.activeElement)

  _handleBlur = () =>
    console.log('blur - activeElement', document.activeElement)

  _handleOpenModal = () =>
    this.setState({ modalVisible: true })

  _handleCloseModal = () =>
    this.setState({ modalVisible: false })

  render() {
    return (
      <div
        className='box'
        tabIndex='-1'
        onFocus={this._handleFocus}
        onBlur={this._handleBlur}
        onClick={this._handleOpenModal}
      >
        {
          this.state.modalVisible &&
          <div
            className='modal'
            tabIndex='-1'
            onDoubleClick={this._handleCloseModal}
          >
            <FocusGuard>
              Modal window
            </FocusGuard>
          </div>
        }
      </div>
    )
  }
}
