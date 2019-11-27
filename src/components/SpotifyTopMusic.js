import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { findKey } from 'lodash';
import {
  Spinner, Container, Row, Col,
} from 'react-bootstrap';

import ArtistGrid from './ArtistGrid';
import TrackGrid from './TrackGrid';
import WordCloud from './WordCloud';
import Statistics from './Statistics';
import ComponentHeader from './ComponentHeader';
import {
  receiveArtists,
  receiveTracks,
  receiveFeatures,
  fetchArtistsIfNeeded,
  fetchTracksIfNeeded,
  fetchFeaturesIfNeeded,
} from '../actions/actions';
import { TimeRanges } from '../constants/constants';

const SpotifyTopMusic = ({ socket }) => {
  const user = useSelector((state) => state.user.user);
  const timeRange = useSelector((state) => state.timeRange);
  const artistCount = useSelector((state) => state.artistCount);
  const trackCount = useSelector((state) => state.trackCount);
  const genreCount = useSelector((state) => state.genreCount);
  const artists = useSelector((state) => state.artists);
  const tracks = useSelector((state) => state.tracks);
  const features = useSelector((state) => state.features);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchArtistsIfNeeded(timeRange, socket.id));
      dispatch(fetchTracksIfNeeded(timeRange, socket.id));
    }
  }, [user]);

  useEffect(() => {
    socket.on('topArtists', (result) => {
      const matchingTimeRange = findKey(TimeRanges, (r) => r.range === result.range);
      dispatch(receiveArtists(matchingTimeRange, result.items));
    });
  });

  useEffect(() => {
    socket.on('topTracks', (result) => {
      const matchingTimeRange = findKey(TimeRanges, (r) => r.range === result.range);
      dispatch(receiveTracks(matchingTimeRange, result.items));

      // Derive features from tracks
      dispatch(fetchFeaturesIfNeeded(matchingTimeRange, socket.id));
    });
  });

  useEffect(() => {
    socket.on('features', (result) => {
      const matchingTimeRange = findKey(TimeRanges, (r) => r.range === result.range);
      dispatch(receiveFeatures(matchingTimeRange, result.items));
    });
  });

  return (
    user && user.id ? (
      <div style={{ marginTop: '2em' }}>
        <div>
          <h1>{timeRange.title}</h1>
        </div>
        <Container>
          <Row>
            <ComponentHeader title="Artists" />
          </Row>
          {artists && artists.items && artists.items.length ? (
            <ArtistGrid artists={artists.items.slice(0, artistCount)} numRows={2} />
          ) : <Spinner animation="border" />}
          <Row style={{ paddingTop: '2em' }}>
            <Col xs={8} style={{ padding: '0 0.5em 0 0' }}>
              {artists && artists.items && artists.items.length ? (
                <WordCloud
                  genres={[...artists.items.map((a) => a.genres).flat()]}
                  count={genreCount}
                />
              ) : <Spinner animation="border" />}
              {features && features.items && features.items.length && tracks && tracks.items && tracks.items.length
                ? (<Statistics features={features.items} tracks={tracks.items} />)
                : <Spinner animation="border" />}
            </Col>
            <Col xs={4} style={{ padding: '0 0 0 0.5em' }}>
              {tracks && tracks.items && tracks.items.length ? (<TrackGrid tracks={tracks.items} count={trackCount} />) : <Spinner animation="border" />}
            </Col>
          </Row>
        </Container>
      </div>
    ) : null
  );
};

SpotifyTopMusic.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default SpotifyTopMusic;
