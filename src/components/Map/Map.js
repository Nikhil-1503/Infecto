import React, {useEffect} from 'react'
import './Map.css'
import { Map as LeafletMap, TileLayer, Circle, Popup } from 'react-leaflet'
import numeral from 'numeral'

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        multiplier: 800,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 1200,
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 2000,
    },
}

function Map({countries, casesType, center, zoom}) {
    useEffect(() => {
        const mapData = (data, casesType='cases') => {
            data.map(country => (
                <Circle 
                center={[country.countryInfo.lat, country.countryInfo.long]}
                fillOpacity={0.4}
                color={casesTypeColors[casesType].hex}
                fillColor={casesTypeColors[casesType].hex}
                radius={
                    Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
                }
                >
                    <Popup>
                        <div className="info-container">
                            <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})` }} />
                            <div className="info-name">{country.country}</div>
                            <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                            <div className="info-recovered">Recovered: {numeral(country.cases).format("0,0")}</div>
                            <div className="info-deaths">Deaths: {numeral(country.cases).format("0,0")}</div>
                        </div>
                    </Popup>   
                </Circle>
            ))
        }
        
        mapData(countries, casesType);
    }, [])

    return (
        <div className='map'>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
            </LeafletMap>
        </div>
    )
}

export default Map
