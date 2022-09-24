import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';

import styles from '../form/Inputs.module.scss';

function Map({ Location, position, zoom = 7, locationError, text }) {
  const [centerPosition] = useState(
    position.length > 0 ? position : [39.247545, -8.637703],
  );

  return (
    <>
      {text && <label>{text}</label>}
      <div className={styles.map}>
        <MapContainer
          center={centerPosition}
          zoom={zoom}
          doubleClickZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {position.length > 0 && (
            <Marker position={position}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          )}
          {Location && <Location />}
        </MapContainer>
      </div>
      {locationError && <p className={styles.p_error}>{locationError}</p>}
    </>
  );
}

export default Map;
