import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { chunk } from 'lodash';
import ComponentHeader from './ComponentHeader';

const ArtistGrid = ({ artists }) => {
  const chunkedArtists = chunk(artists, 5);

  return chunkedArtists.map((artistRow, i) => (
    <div key={artistRow.map((a) => a.id).toString()}>
      {i === 0 && (
        <ComponentHeader title="Artists" />
      )}
      <Row key={chunkedArtists[i].map((a) => a.id).toString()} style={{ paddingTop: `${i > 0 ? '4px' : '0px'}` }}>
        {artistRow.map((artist) => (
          <Col key={artist.id} style={{ padding: '0px 2px 0px 2px' }}>
            <div style={{
              display: 'flex', paddingBottom: '100%', overflow: 'hidden', position: 'relative',
            }}
            >
              <img
                src={artist.images[0] ? artist.images[0].url : ''}
                alt={artist.name}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  zIndex: '10',
                  width: '100%',
                  bottom: '0',
                  marginBottom: '0',
                  background: 'rgba(0,0,0,0.5)',
                }}
              >
                <p
                  className="s"
                  style={{
                    marginBottom: '0',
                    color: 'white',
                  }}
                >
                  <b>{artist.name}</b>
                </p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  ));
};

export default ArtistGrid;
