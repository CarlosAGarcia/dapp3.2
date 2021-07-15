import React, { Component } from 'react'
import { connect } from 'react-redux'
// import useWindowDimensions from '../../util/windowDimensions'


export class FractalBackdrop extends Component {
    constructor(props) {
        super(props);
        this.state = {
          x: 0,
          y: 0
        };
      }

    componentDidMount() {
        // console.log('->', useWindowDimensions())

        window.addEventListener("mousemove", this.updatePos);
    }

    updatePos = (e) => {
        this.setState({
        x: e.clientX,
        y: e.clientY
        });
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove')
    }

    render() {

        return (
            <div >
                X- {this.state.x} Y - {this.state.y}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(FractalBackdrop)
