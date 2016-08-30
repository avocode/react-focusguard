import React from 'react'
import ReactDOM from 'react-dom'

let { div } = React.DOM


export default class extends React.Component {
  static displayName = 'FocusGuard'

  static propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.node,
  }

  static defaultProps = {
    className: null,
  }

  _lastFocusedElement = null

  componentWillMount() {
    this._lastFocusedElement = document.activeElement
  }

  componentWillUnmount() {
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
