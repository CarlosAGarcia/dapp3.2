import React, { Component } from 'react'
import { FractalBackdrop } from './Background/FractalBackdrop'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0'
    }
  }

  render() {
    return (
      <div>
        <FractalBackdrop />
      </div>
    );
  }
}

export default App;
