import { onMount, onCleanup, createSignal } from 'solid-js'
import 'ol/ol.css'
import * as Cesium from 'cesium'
import OLCesium from 'olcs/OLCesium'
import * as ol from 'ol'
import { transform } from 'ol/proj'
import Tile from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'

const map_width = 800;
const map_height = 600;

const map_margin_controls = 60;
const controls_width = 300;

const translate_x = (map_margin_controls + controls_width) / 2.0

/**
 * 
 * @param {{onLoad?:(options:{map:OLCesium})=>void}} props 
 * @returns 
 */
function OLCSMap(props) {

    const [d3, setD3] = createSignal(false);

    /**
     * @type {OLCesium}
     */
    let olcsMap

    onMount(() => {
        const view = new ol.View({
            center: transform([(120.8653 + 120.8757) / 2, (31.2667 + 31.2759) / 2], "EPSG:4326", "EPSG:3857"),
            zoom: 17,
        });

        // https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
        const ol2d = new ol.Map({
            layers: [
                new Tile({
                    source: new XYZ({
                        url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                        maxZoom: 18
                    })
                })
            ],
            target: 'olcs-map',
            view
        });

        window.Cesium = Cesium;
        olcsMap = new OLCesium({ map: ol2d });

        if (props.onLoad)
            props.onLoad({ map: olcsMap });
    });

    onCleanup(() => {
        if (!olcsMap)
            return;

        /**
         * @type {Cesium.Scene}
         */
        const cesiumScene = olcsMap.getCesiumScene();

        /**
         * @type {ol.Map}
         */
        const olMap = olcsMap.getOlMap();

        olMap.dispose();
        cesiumScene.canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext();
        cesiumScene.destroy();
    });

    function handelD3Change() {
        if (olcsMap) {
            setD3(!d3());
            olcsMap.setEnabled(d3());
        }
    }

    return (
        <div style={{ display: 'flex', transform: `translateX(${translate_x}px)` }}>
            <div id="olcs-map" style={{ width: `${map_width}px`, height: `${map_height}px`, border: '1px solid #fff' }}></div>
            <div style={{ height: `${map_height}px`, margin: `0 ${map_margin_controls / 2.0}px`, border: '0.2px solid #aaa' }}></div>
            <div id="olcs-map-controls" style={{ width: `${controls_width}px`, height: `${map_height}px` }}>
                <div style={{ cursor: 'pointer', width: 'fit-content' }} onClick={handelD3Change}>
                    <span>3D</span>
                    <input style={{ cursor: 'pointer' }} type='checkbox' checked={d3()}></input>
                </div>
                <div style={{ width: `${controls_width}px`, border: '0.2px solid #aaa', margin: '10px 0' }}></div>
                {props.children}
            </div>
        </div>)
}

export default OLCSMap;