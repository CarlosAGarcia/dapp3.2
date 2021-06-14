import React, { Component } from 'react'


export default class TransactionHOC extends Component {
    render() {
        return (
            <div>
                <div className='children'>
                    {props.children}
                </div>
            <div>
        )
    }
}
