import axios from 'axios';

import {
  SET_USER,
  SET_HAS_CLICKED_CREATE,
  SET_TIME_RANGE_NAME,
  SET_ARTIST_COUNT,
  SET_TRACK_COUNT,
  RECEIVE_TRACKS,
  RECEIVE_ARTISTS,
  RECEIVE_FEATURES,
  REQUEST_ARTISTS,
  REQUEST_TRACKS,
  REQUEST_FEATURES,
  TRACK_REQ_LIMIT,
  N_TRACKS,
  N_ARTISTS,
  ARTIST_REQ_LIMIT,
  SET_GENRE_COUNT,
  TimeRanges,
  SET_DISPLAY_PROFILE,
  SET_STATS_OPTIONS,
  SET_OPTIMIZE_TRACKS,
} from '../constants/constants';
import { API_URL } from '../config';

const getTimeRangeByName = (name) => Object.values(TimeRanges).find((r) => r.name === name);

export function setUser(user) {
  return { type: SET_USER, user };
}

export function setHasClickedCreate() {
  return { type: SET_HAS_CLICKED_CREATE, hasClickedCreate: true };
}

export function setTimeRangeName(timeRangeName) {
  return { type: SET_TIME_RANGE_NAME, timeRangeName };
}

export function setArtistCount(artistCount) {
  return { type: SET_ARTIST_COUNT, artistCount };
}

export function setTrackCount(trackCount) {
  return { type: SET_TRACK_COUNT, trackCount };
}

export function setGenreCount(genreCount) {
  return { type: SET_GENRE_COUNT, genreCount };
}

export function setStatsOptions(statsOptions) {
  return { type: SET_STATS_OPTIONS, statsOptions };
}

export function setDisplayProfile(displayProfile) {
  return { type: SET_DISPLAY_PROFILE, displayProfile };
}

export function setOptimizeTracks(optimizeTracks) {
  return { type: SET_OPTIMIZE_TRACKS, optimizeTracks };
}

function requestArtists(timeRangeName) {
  return {
    type: REQUEST_ARTISTS,
    timeRangeName,
  };
}

export function receiveArtists(timeRangeName, items) {
  return {
    type: RECEIVE_ARTISTS,
    timeRangeName,
    items,
  };
}

function fetchArtists(timeRangeName, socketId) {
  return (dispatch) => {
    dispatch(requestArtists(timeRangeName));

    const timeRange = getTimeRangeByName(timeRangeName);

    return axios.get(`${API_URL}/api/my-top-artists?socketId=${socketId}`, {
      params: {
        time_range: `${timeRange.range}`,
        offset: 0,
        n: N_ARTISTS,
        limit: ARTIST_REQ_LIMIT,
      },
    });
  };
}

const shouldFetchArtists = (state, timeRangeName) => !state.artistsByTimeRangeName[timeRangeName];

export function fetchArtistsIfNeeded(timeRangeName, socketId) {
  return (dispatch, getState) => {
    if (shouldFetchArtists(getState(), timeRangeName)) {
      return dispatch(fetchArtists(timeRangeName, socketId));
    }
    return Promise.resolve();
  };
}

function requestTracks(timeRangeName) {
  return {
    type: REQUEST_TRACKS,
    timeRangeName,
  };
}

export function receiveTracks(timeRangeName, items) {
  return {
    type: RECEIVE_TRACKS,
    timeRangeName,
    items,
  };
}

function fetchTracks(timeRangeName, socketId) {
  return (dispatch) => {
    dispatch(requestTracks(timeRangeName));

    const timeRange = getTimeRangeByName(timeRangeName);

    return axios.get(`${API_URL}/api/my-top-tracks?socketId=${socketId}`, {
      params: {
        time_range: `${timeRange.range}`,
        offset: 0,
        n: N_TRACKS,
        limit: TRACK_REQ_LIMIT,
      },
    });
  };
}

const shouldFetchTracks = (state, timeRangeName) => !state.tracksByTimeRangeName[timeRangeName];

export function fetchTracksIfNeeded(timeRangeName, socketId) {
  return (dispatch, getState) => {
    if (shouldFetchTracks(getState(), timeRangeName)) {
      return dispatch(fetchTracks(timeRangeName, socketId));
    }
    return Promise.resolve();
  };
}

function requestFeatures(timeRangeName) {
  return {
    type: REQUEST_FEATURES,
    timeRangeName,
  };
}

export function receiveFeatures(timeRangeName, items) {
  return {
    type: RECEIVE_FEATURES,
    timeRangeName,
    items,
  };
}

function fetchFeatures(ids, timeRangeName, socketId) {
  return (dispatch) => {
    dispatch(requestFeatures());

    const timeRange = getTimeRangeByName(timeRangeName);

    return axios
      .get(`${API_URL}/api/track-features?socketId=${socketId}`, {
        params: {
          time_range: `${timeRange.range}`,
          ids: `${ids.join(',')}`,
        },
      });
  };
}

const shouldFetchFeatures = (state, timeRangeName) => !state.featuresByTimeRangeName[timeRangeName];

export function fetchFeaturesIfNeeded(timeRangeName, socketId) {
  return (dispatch, getState) => {
    if (shouldFetchFeatures(getState(), timeRangeName)) {
      const tracks = getState().tracksByTimeRangeName[timeRangeName];
      const ids = tracks ? tracks.items.map((t) => t.id) : null;

      if (ids) { return dispatch(fetchFeatures(ids, timeRangeName, socketId)); }
    }
    return Promise.resolve();
  };
}