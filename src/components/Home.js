import React, { Component } from 'react';

export class Home extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return <div className="ui-g">
            <div className="ui-g-12">
                <div className="card">
                    <iframe id="iframeCenter" src="https://sway.com/s/TjUYUNK5FXmwgqwl/embed" width="100%"
                        height="620px" frameborder="0">
                    </iframe>
                </div>
            </div>
        </div>
    }
}