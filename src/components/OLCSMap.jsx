import { onMount, onCleanup } from 'solid-js'
import 'ol/ol.css'
import * as Cesium from 'cesium'
import OLCesium from 'olcs/OLCesium';
import * as ol from 'ol'
import { transform } from 'ol/proj'
import olLayerTile from 'ol/layer/Tile'
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

    /**
     * @type {OLCesium}
     */
    let olcsMap

    onMount(() => {
        const view = new ol.View({
            center: transform([(120.8653 + 120.8757) / 2, (31.2667 + 31.2769) / 2], 'EPSG:4326', 'EPSG:3857'),
            zoom: 17,
        });

        //https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS
        const ol2d = new ol.Map({
            layers: [
                new olLayerTile({
                    source: new XYZ({
                        url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                        maxZoom: 18,
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

    return (
        <div style={{ display: 'flex', transform: `translateX(${translate_x}px)` }}>
            <div id="olcs-map" style={{ width: `${map_width}px`, height: `${map_height}px`, border: '1px solid #fff' }}></div>
            <div style={{ height: `${map_height}px`, margin: `0 ${map_margin_controls / 2.0}px`, border: '0.2px solid #aaa' }}></div>
            <div id="olcs-map-controls" style={{ width: `${controls_width}px`, height: `${map_height}px` }}>
                {props.children}
            </div>
        </div>)
}

export default OLCSMap;