/**
 * 功能模块
 * @param {{title:string}} props 
 */
function FeaturesContainer(props) {
    return (
        <div style={{margin:'0 0 12px 4px'}}>
            <h5 style={{ margin: '0' }}>{props.title}</h5>
            <div className="features-content">
                {props.children}
            </div>
        </div>)
}

export default FeaturesContainer;