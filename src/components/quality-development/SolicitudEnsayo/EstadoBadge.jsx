import React, { Component } from 'react';
import "../../site.css";

class EstadoBadge extends Component {

    constructor() {
        super();
        this.state = {
            estado: null,
        };
        this.determinarColor = this.determinarColor.bind(this);
    }

    async componentDidMount() {
        this.setState({ estado: this.props.estado });
    }

    determinarColor() {
        return 'badge';
    }

    render() {
        return (
            <span className={this.determinarColor()}>{this.state.estado}</span>
        )
    }
}

export default EstadoBadge;