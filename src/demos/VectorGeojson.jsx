import OLCSMap from "../components/OLCSMap"
import { Map } from "ol";

import VectorTile from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import olStyleStyle from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';

import geojson_polygon from '../assets/geojson/polygon.geojson?url'


export default () => {
    return <OLCSMap onLoad={(options) => {
        /**
         * @type {Map} 
         */
        const olMap = options.map.getOlMap();

        olMap.addLayer(new VectorTile({
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
        }))
    }}></OLCSMap>
}