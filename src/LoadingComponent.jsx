import React from 'react'
import PropTypes from 'prop-types'
import { Dialog } from 'primereact/dialog'
import { ProgressSpinner } from 'primereact/progressspinner'


const LoadingComponent = ({ inverted, content }) => (
    <Dialog visible={inverted} style={{ width: '20vw' }} modal={true} showHeader={false} closeOnEscape={false} onHide={inverted}>
        <div className="p-grid p-fluid">
            <div className="p-col-12" style={{ textAlign: 'center', justifyContent: 'center' }}>
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration="4s" />
            </div>
            <div className="p-col-12" style={{ textAlign: 'center', justifyContent: 'center', marginBottom: '10px', marginTop: '15px' }}>
                <span style={{ fontWeight: 'bold', textAlign: 'center' }}>Espere por favor... !</span>
            </div>
        </div>
    </Dialog>
)

LoadingComponent.propTypes = {
    inverted: PropTypes.bool,
    content: PropTypes.string.isRequired
}

LoadingComponent.defaultProps = {
    inverted: false
}

export default LoadingComponent
