import React, { Component } from 'react'
import { connect } from 'react-redux'
import StyledFracBackdrop from './Styles/StyledFracBackdrop.style'

export class FractalBackdrop extends Component {
    constructor(props) {
        super(props);
        this.state = {
          x: 0, // cursor pos relative to middle of screen
          y: 0, // cursor pos relative to middle of screen
          width: 0, // width of screen total
          height: 0, // height of screen total
          midX: 0, // position of middle of screen relative to top left = 0
          midY: 0 // position of middle of screen relative to top left = 0
        };
      }

    componentDidMount() {
        window.addEventListener("mousemove", this.updatePos);
    }

    componentDidUpdate() {
        const { width: midState, height: midHeight } = this.state
        const { innerWidth: width, innerHeight: height } = window;

        if (midState !== width || midHeight !== height) this.updateMiddlePos()
    }

    updateMiddlePos = () => {
        const { innerWidth: width, innerHeight: height } = window;

        const midX = width ? width / 2 : 0
        const midY = height ? height / 2 : 0

        this.setState({ ...this.state, width, height, midX, midY })
    }

    updatePos = (e) => {
        const { midX, midY } = this.state

        this.setState({ x: e.clientX - midX,  y: e.clientY - midY });
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove')
    }

    render() {
        const { midX, midY } = this.state
        // equation Znext = Zprev^2 + C
        return (
            <StyledFracBackdrop midX={midX} midY={midY}>
                X- {this.state.x} Y - {this.state.y}
            </StyledFracBackdrop>
        )
    }
}

const mapStateToProps = () => {
    return {}
}

export default connect(mapStateToProps, {})(FractalBackdrop)
