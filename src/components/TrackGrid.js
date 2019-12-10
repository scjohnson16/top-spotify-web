import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { chunk, debounce } from 'lodash';
import PropTypes from 'prop-types';

import OrdinalCircle from './OrdinalCircle';
import {
  TRACK_REQ_LIMIT,
  SM_WIDTH_BOUNDARY,
  NUM_PER_ROW_DESKTOP,
  NUM_PER_ROW_MOBILE,
  NUM_PER_COL,
} from '../constants/constants';
import { selectOptimizeTracks } from '../reducers/selectors';

// Return as many non-duplicate-album tracks as possible within given params
const makeOptimizedTracks = (tracks, count) => {
  if (count === TRACK_REQ_LIMIT) return tracks;

  const uniqueArr = [];
  const duplicateAlbumArr = [];

  tracks.forEach((t, i) => {
    if (uniqueArr.find((u) => u[1].album.id === t.album.id)) {
      duplicateAlbumArr.push([i, t]);
    } else {
      uniqueArr.push([i, t]);
    }
  });

  if (uniqueArr.length >= count) { return uniqueArr.map((u) => u[1]).slice(0, count); }

  const combinedArr = [...uniqueArr];

  // Fill in remaining slots with duplicate-album tracks, favoring higher positions
  for (let i = 0; i < (count - uniqueArr.length); i += 1) {
    if (duplicateAlbumArr[i]) {
      combinedArr.splice(duplicateAlbumArr[i][0], 0, duplicateAlbumArr[i]);
    }
  }

  return combinedArr.map((t) => t[1]).slice(0, count);
};

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const Track = ({ track, position }) => (
  <li key={track.id}>
    <div style={{
      display: 'inline-flex',
      position: 'relative',
      float: 'left',
      width: '100%',
    }}
    >
      <div style={{ position: 'relative', width: '50px', height: '50px' }}>
        <img
          height="50"
          width="50"
          src={track.album.images.length ? track.album.images[0].url : 'images/music_note.svg'}
          alt={track.name}
          style={{ objectFit: 'cover' }}
        />
        <OrdinalCircle
          position={position}
        />
      </div>

      <div style={{ marginLeft: '0.5em', lineHeight: '1.3' }}>
        <div>
          <div style={{ display: 'grid' }}>
            <p
              className="text-s s"
              style={{
                margin: '0',
                textAlign: 'left',
              }}
            >
              <b>{track.artists[0].name}</b>
            </p>
          </div>
          <div style={{ display: 'grid' }}>
            <p
              className="text-s xs"
              style={{
                margin: '0',
                textAlign: 'left',
              }}
            >
              {track.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  </li>
);

Track.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.string,
    album: PropTypes.object,
    artists: PropTypes.array,
    name: PropTypes.string,
  }).isRequired,
  position: PropTypes.number.isRequired,
};

const TrackCol = ({
  tracks, numPerRow, rowIndex, colIndex,
}) => (
  <Col key={tracks.map((t) => t.id).toString()}>
    <ul style={{ listStyleType: 'none', padding: '0', marginTop: '1em' }}>
      {tracks.map((track, trackIndex) => (
        <Track
          track={track}
          key={track.id}
          position={rowIndex * numPerRow + colIndex * NUM_PER_COL + trackIndex + 1}
        />
      ))}
    </ul>
  </Col>
);

TrackCol.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
  numPerRow: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
  colIndex: PropTypes.number.isRequired,
};

export const TrackRow = ({ tracks, index, numPerRow }) => (
  <div key={tracks.map((t) => t.id).toString()}>
    <Row>
      {index > 0 && (
      <hr
        style={{
          margin: '2rem 0 0 0',
          border: '1px solid rgba(255,255,255,.1)',
          width: '100%',
        }}
      />
      )}
    </Row>
    <Row className="grid-row" key={tracks.map((t) => t.id).join()} style={{ marginTop: '1em' }}>
      {chunk(tracks, NUM_PER_COL).map((colTracks, colIndex) => (
        <TrackCol
          tracks={colTracks}
          key={colTracks.map((t) => t.id).toString()}
          numPerRow={numPerRow}
          rowIndex={index}
          colIndex={colIndex}
        />
      ))}
      {tracks.length < numPerRow && <Col />}
    </Row>
  </div>
);

TrackRow.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
  index: PropTypes.number.isRequired,
  numPerRow: PropTypes.number.isRequired,
};

// grid sets # of items per row based on window width
const TrackGrid = ({ tracks, count }) => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  const optimizeTracks = useSelector(selectOptimizeTracks);

  const tracksToMap = optimizeTracks ? makeOptimizedTracks(tracks, count) : tracks.slice(0, count);

  const getNumPerRow = useCallback(() => (windowDimensions.width <= SM_WIDTH_BOUNDARY
    ? NUM_PER_ROW_MOBILE
    : NUM_PER_ROW_DESKTOP), [windowDimensions]);

  const [numPerRow, setNumPerRow] = useState(getNumPerRow());

  const makeTracksByRow = useCallback(() => (
    chunk(tracksToMap, numPerRow)), [tracksToMap, numPerRow]);

  const [tracksByRow, setTracksByRow] = useState(makeTracksByRow(tracksToMap, windowDimensions));

  // Optimize grid arrangement for responsive screen width
  useEffect(() => {
    const handleResize = debounce(() => {
      const dimens = getWindowDimensions();

      if (dimens !== windowDimensions) {
        setWindowDimensions(dimens);
        setNumPerRow(getNumPerRow());
        setTracksByRow(makeTracksByRow());
      }
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tracksToMap, windowDimensions, getNumPerRow, makeTracksByRow]);

  return (
    count > 0 ? (
      <div>
        {tracksByRow.map((rowTracks, i) => (
          <TrackRow
            tracks={rowTracks}
            key={rowTracks.map((t) => t.id).toString()}
            index={i}
            numPerRow={numPerRow}
          />
        ))}
      </div>
    ) : null
  );
};

TrackGrid.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
  count: PropTypes.number.isRequired,
};

export default TrackGrid;
