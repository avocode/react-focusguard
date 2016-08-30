import jsdom from 'jsdom'
import chai from 'chai'

describe('FocusGuard component', function() {
  let baseProps = null

  let simulant = null
  let FocusGuard = null
  let ReactDOM = null
  let React = null
  let enzyme = null

  let { expect } = chai

  beforeEach(function() {
    global.document = jsdom.jsdom('<html><body></body></html>')
    global.window = document.defaultView
    global.Image = window.Image
    global.navigator = window.navigator
    global.CustomEvent = window.CustomEvent
    simulant = require('simulant')
    ReactDOM = require('react-dom')
    React = require('react')
    enzyme = require('enzyme')
    let chaiEnzyme = require('chai-enzyme')

    chai.use(chaiEnzyme())

    FocusGuard = require('../src/')

    baseProps = {
      className: null
    }
  })

  it('should render component', function() {
    let focusguardComponent = React.createElement(FocusGuard, baseProps)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper.find('FocusGuard')).to.have.length(1)
  })

  it('should not have className attribute by default', function() {
    let focusguardComponent = React.createElement(FocusGuard, baseProps)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper.props().className).to.be.equal(null)
  })

  it('should have className attribute', function() {
    let props = Object.assign({}, baseProps, {
      className: 'testing'
    })
    let focusguardComponent = React.createElement(FocusGuard, props)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper.props().className).to.be.equal('testing')
  })

  it('should not have children by default', function() {
    let focusguardComponent = React.createElement(FocusGuard, baseProps)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper.props().children).to.be.equal(undefined)
  })

  it('should have children', function() {
    let props = Object.assign({}, baseProps, {
      children: React.DOM.div()
    })
    let focusguardComponent = React.createElement(FocusGuard, props)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper).to.contain(React.DOM.div())
  })

  it('should correcly rollback focus to previous element', function() {
    let Test = class Contacts extends React.Component {
      constructor() {
        super()
        this.state = { visible: false }
      }

      _handleOpen = () =>
        this.setState({ visible: true })

      _handleClose = () =>
        this.setState({ visible: false })

      render() {
        return (
          React.DOM.div({
            tabIndex: '-1',
            onClick: this._handleOpen,
            className: 'root',
          },
            this.state.visible &&
              React.DOM.div({
                tabIndex: '-1',
                className: 'child',
                onDoubleClick: this._handleClose,
                children: React.createElement(FocusGuard)
              })
          )
        )
      }
    }

    let wrapper = enzyme.mount(React.createElement(Test))

    expect(wrapper.find('.root')).to.have.length(1)
    expect(wrapper.find('.child')).to.have.length(0)
    expect(document.activeElement).to.be.equal(document.body)

    let rootEl = ReactDOM.findDOMNode(wrapper.instance())
    rootEl.focus()
    wrapper.find('.root').simulate('click')
    expect(document.activeElement).to.be.equal(rootEl)

    expect(wrapper.find('.child')).to.have.length(1)
    let childEl = ReactDOM.findDOMNode(wrapper.instance())
    childEl.focus()
    expect(document.activeElement).to.be.equal(childEl)

    wrapper.find('.child').simulate('doubleClick')
    expect(wrapper.find('.child')).to.have.length(0)
    expect(document.activeElement).to.be.equal(rootEl)
  })


})
