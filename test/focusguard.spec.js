import React from 'react'
import ReactDOM from 'react-dom'
import jsdom from 'jsdom'
import enzyme, { configure } from 'enzyme'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import Adapter from 'enzyme-adapter-react-16';

import FocusGuard from '../src'

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme())

describe('FocusGuard component', () => {
  let baseProps = null
  let simulant = null

  beforeEach(function() {
    global.document = jsdom.jsdom('<html><body></body></html>')
    global.window = document.defaultView
    global.Image = window.Image
    global.navigator = window.navigator
    global.CustomEvent = window.CustomEvent
    simulant = require('simulant')

    baseProps = {
      className: null
    }
  })

  it('should render component', () => {
    let focusguardComponent = React.createElement(FocusGuard, baseProps)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper.find('FocusGuard')).to.have.length(1)
  })

  it('should not have className prop by default', () => {
    let focusguardComponent = React.createElement(FocusGuard, baseProps)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper.props().className).to.be.equal(null)
  })

  it('should have className prop', () => {
    let props = Object.assign({}, baseProps, {
      className: 'testing'
    })
    let focusguardComponent = React.createElement(FocusGuard, props)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper.props().className).to.be.equal('testing')
  })

  it('should not have targetNodeSelector prop by default', () => {
    let focusguardComponent = React.createElement(FocusGuard, baseProps)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper.props().targetNodeSelector).to.be.equal(null)
  })

  it('should have targetNodeSelector prop', () => {
    let props = Object.assign({}, baseProps, {
      targetNodeSelector: '.testing'
    })
    let focusguardComponent = React.createElement(FocusGuard, props)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper.props().targetNodeSelector).to.be.equal('.testing')
  })

  it('should not have children by default', () => {
    let focusguardComponent = React.createElement(FocusGuard, baseProps)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper.props().children).to.be.equal(undefined)
  })

  it('should have children', () => {
    let props = Object.assign({}, baseProps, {
      children: <div className='abc' />
    })
    let focusguardComponent = React.createElement(FocusGuard, props)
    let wrapper = enzyme.mount(focusguardComponent)

    expect(wrapper).to.contain(<div className='abc' />)
  })

  it('should correcly rollback focus to previous element', (callback) => {
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
          <div
            className='root'
            tabIndex='-1'
            onClick={this._handleOpen}
          >
            {
              this.state.visible &&
              <div
                className='child'
                tabIndex='-1'
                onDoubleClick={this._handleClose}
              >
                <FocusGuard />
              </div>
            }
          </div>
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
    let childEl = rootEl.querySelector('.child')
    childEl.focus()
    expect(document.activeElement).to.be.equal(childEl)

    wrapper.find('.child').simulate('doubleClick')
    expect(wrapper.find('.child')).to.have.length(0)

    setImmediate(() => {
      expect(document.activeElement).to.be.equal(rootEl)
      callback()
    })
  })
})
