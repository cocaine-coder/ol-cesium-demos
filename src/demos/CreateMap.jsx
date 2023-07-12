import { createSignal } from 'solid-js'
import { OLCSMap } from "../components";
import OLCesium from 'olcs/OLCesium';

export default () => {
    const [d3, setD3] = createSignal(false);

    /**
     * @type {OLCesium}
     */
    let olcsMap;

    function handelD3Change() {
        if (olcsMap) {
            setD3(!d3());
            olcsMap.setEnabled(d3());
        }
    }

    /**
     * 
     * @param {{map:OLCesium}} options 
     */
    function onMapLoad(options) {
        olcsMap = options.map;
    }

    return <OLCSMap onLoad={onMapLoad}>
                <div style={{ cursor: 'pointer', width: 'fit-content' }} onClick={handelD3Change}>
                    <span>3D</span><input type='checkbox' checked={d3()}></input>
                </div>
            </OLCSMap>
}