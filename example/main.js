import React from 'react'
import ReactDOM from 'react-dom'
import './main.less'
import App from './app'

let element = React.createElement(App)
ReactDOM.render(element, document.getElementById('app'))
