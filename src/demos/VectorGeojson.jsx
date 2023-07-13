import { FeaturesContainer, OLCSMap } from "../components"

import * as Cesium from 'cesium';
import { Map } from "ol";
import VectorTile from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import olStyleStyle from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
import olStyleCircle from 'ol/style/Circle';

import geojson_polygon from '../assets/geojson/polygon.geojson?url'
import geojson_point from '../assets/geojson/point.geojson?url'
import { createSignal } from "solid-js";

export default () => {
    const tile_polygon = new VectorTile({
        source: new VectorSource({
            url: geojson_polygon,
            format: new GeoJSON({ 'dataProjection': "EPSG:4326" }),
        }),
        style: [new olStyleStyle({
            stroke: new olStyleStroke({
                color: 'blue',
                lineDash: [4],
                width: 3
            }),
            fill: new olStyleFill({
                color: 'rgba(0, 0, 255, 0.4)'
            })
        })]
    });

    const tile_point = new VectorTile({
        source: new VectorSource({
            url: geojson_point,
            format: new GeoJSON({ 'dataProjection': "EPSG:4326" })
        }),
        style: [
            new olStyleStyle({
                image: new olStyleCircle({
                    radius: 5,
                    fill: null,
                    stroke: new olStyleStroke({ color: 'red', width: 1 })
                })
            })
        ]
    });

    const [vectorProps, setVectorProps] = createSignal({
        showPolygon: true,
        showPoint: true,
        opacityPolygon: 1,
        opacityPoint: 1,
    });

    function handlePolygonVisibleChange() {
        resetVectorProps("showPolygon", !vectorProps().showPolygon);
        tile_polygon.setVisible(vectorProps().showPolygon);
    }

    function handlePolygonOpacityChange(e) {
        const opacity = Number.parseFloat(e.target.value);
        resetVectorProps("opacityPolygon", opacity);
        tile_polygon.setOpacity(opacity);
    }

    function handlePointVisibleChange() {
        resetVectorProps("showPoint", !vectorProps().showPoint);
        tile_point.setVisible(vectorProps().showPoint);
    }

    function handlePointOpacityChange(e) {
        const opacity = Number.parseFloat(e.target.value);
        resetVectorProps("opacityPoint", opacity);
        tile_point.setOpacity(opacity);
    }

    /**
     * 
     * @param {string} prop 
     * @param {any} value 
     */
    function resetVectorProps(prop, value) {
        const org = { ...vectorProps() }
        org[prop] = value;
        setVectorProps(org);
    }

    return <OLCSMap onLoad={(options) => {
        /**
         * @type {Map} 
         */
        const olMap = options.map.getOlMap();

        olMap.addLayer(tile_polygon);
        olMap.addLayer(tile_point);
        
    }}>
        <FeaturesContainer title="polygon">
            <span>是否显示</span>
            <input type="checkbox" checked={vectorProps().showPolygon} onClick={handlePolygonVisibleChange}></input>
            <span>透明度</span>
            <input type="range" min={0} max={1} step={0.1} value={vectorProps().opacityPolygon} onChange={handlePolygonOpacityChange}></input>
        </FeaturesContainer>

        <FeaturesContainer title="point">
            <span>是否显示</span>
            <input type="checkbox" checked={vectorProps().showPoint} onClick={handlePointVisibleChange}></input>
            <span>透明度</span>
            <input type="range" min={0} max={1} step={0.1} value={vectorProps().opacityPoint} onChange={handlePointOpacityChange}></input>
        </FeaturesContainer>
    </OLCSMap>
}