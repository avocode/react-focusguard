import React from 'react'
import PropTypes from 'prop-types';

export default class extends React.Component {
  static displayName = 'FocusGuard'

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    targetNodeSelector: PropTypes.string,
  }

  static defaultProps = {
    className: null,
    targetNodeSelector: null,
  }

  _lastFocusedElement = null

  componentWillMount() {
    this._lastFocusedElement = document.activeElement
  }

  componentWillUnmount() {
    setImmediate(this._setFocusToLastFocusedElement)
  }

  _setFocusToLastFocusedElement = () => {
    if (this.props.targetNodeSelector) {
      const targetNode = document.querySelector(this.props.targetNodeSelector)

      if (targetNode) {
        targetNode.focus()
        this._lastFocusedElement = null
        return
      }
    }

    if (this._lastFocusedElement) {
      this._lastFocusedElement.focus()
    }
    this._lastFocusedElement = null
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    )
  }
}
