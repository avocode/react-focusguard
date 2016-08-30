let FocusGuard = React.createFactory(require('../src/focusguard'))
let { div, button } = React.DOM

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

      div({
        className: 'box',
        onFocus: this._handleFocus,
        onBlur: this._handleBlur,
        onClick: this._handleOpenModal,
        tabIndex: '-1',
      },
        this.state.modalVisible &&
          div({
            className: 'modal',
            onDoubleClick: this._handleCloseModal,
            tabIndex: '-1'
          },
            FocusGuard(null,
              div(null, 'Modal window')
            )
          )
      )

    )
  }
}
