import React from 'react'
import ReactDOM from 'react-dom'

let { div } = React.DOM


export default class extends React.Component {
  static displayName = 'FocusGuard'

  static propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    targetNodeSelector: React.PropTypes.string,
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
    if (this.props.targetNodeSelector) {
      let targetNode = document.querySelector(this.props.targetNodeSelector)

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
      div({
        className: this.props.className
      }, this.props.children)
    )
  }
}
