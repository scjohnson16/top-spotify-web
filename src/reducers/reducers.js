import { combineReducers } from 'redux';
import {
  SET_USER,
  SET_TIME_RANGE_NAME,
  TimeRanges,
  REQUEST_ARTISTS,
  RECEIVE_ARTISTS,
  REQUEST_TRACKS,
  RECEIVE_TRACKS,
  REQUEST_FEATURES,
  RECEIVE_FEATURES,
  SET_ARTIST_COUNT,
  SET_TRACK_COUNT,
  SET_GENRE_COUNT,
  DEFAULT_ARTIST_COUNT,
  DEFAULT_TRACK_COUNT,
  DEFAULT_GENRE_COUNT,
  SET_HAS_CLICKED_CREATE,
  SET_STATS_OPTIONS,
  SET_DISPLAY_PROFILE,
  SET_OPTIMIZE_TRACKS,
  DEFAULT_STATS_OPTIONS,
  REQUEST_ARTIST_COUNTRIES,
  RECEIVE_ARTIST_COUNTRIES,
  REQUEST_ARTIST_RELEASES,
  RECEIVE_ARTIST_RELEASES,
  SET_DISPLAY_MAP,
} from '../constants/constants';

export const initialState = {
  user: {},
  hasClickedCreate: false,
  timeRangeName: TimeRanges.LONG.name,
  artistCount: DEFAULT_ARTIST_COUNT,
  trackCount: DEFAULT_TRACK_COUNT,
  genreCount: DEFAULT_GENRE_COUNT,
  statsOptions: DEFAULT_STATS_OPTIONS,
  displayProfile: true,
  displayMap: true,
  optimizeTracks: true,
  artists: {},
  artistsByTimeRangeName: {},
  tracks: {},
  tracksByTimeRangeName: {},
  features: {},
  featuresByTimeRangeName: {},
  artistCountries: {},
  artistCountriesByTimeRangeName: {},
  artistReleases: {},
  artistReleasesByTimeRangeName: {},
};

function user(state = initialState.user, action) {
  switch (action.type) {
    case SET_USER:
      return action.user;
    default:
      return state;
  }
}

function hasClickedCreate(state = initialState.hasClickedCreate, action) {
  switch (action.type) {
    case SET_HAS_CLICKED_CREATE:
      return true;
    default:
      return state;
  }
}

function timeRangeName(state = initialState.timeRangeName, action) {
  switch (action.type) {
    case SET_TIME_RANGE_NAME:
      return action.timeRangeName;
    default:
      return state;
  }
}

function artistCount(state = initialState.artistCount, action) {
  switch (action.type) {
    case SET_ARTIST_COUNT:
      return action.artistCount;
    default:
      return state;
  }
}

function trackCount(state = initialState.trackCount, action) {
  switch (action.type) {
    case SET_TRACK_COUNT:
      return action.trackCount;
    default:
      return state;
  }
}

function genreCount(state = initialState.genreCount, action) {
  switch (action.type) {
    case SET_GENRE_COUNT:
      return action.genreCount;
    default:
      return state;
  }
}

function statsOptions(state = initialState.statsOptions, action) {
  switch (action.type) {
    case SET_STATS_OPTIONS:
      return action.statsOptions;
    default:
      return state;
  }
}

function displayProfile(state = initialState.displayProfile, action) {
  switch (action.type) {
    case SET_DISPLAY_PROFILE:
      return action.displayProfile;
    default:
      return state;
  }
}

function displayMap(state = initialState.displayMap, action) {
  switch (action.type) {
    case SET_DISPLAY_MAP:
      return action.displayMap;
    default:
      return state;
  }
}

function optimizeTracks(state = initialState.optimizeTracks, action) {
  switch (action.type) {
    case SET_OPTIMIZE_TRACKS:
      return action.optimizeTracks;
    default:
      return state;
  }
}

function artists(state = initialState.artists, action) {
  switch (action.type) {
    case REQUEST_ARTISTS:
      return { ...state, isFetching: true };
    case RECEIVE_ARTISTS:
      return { ...state, isFetching: false, items: action.items };
    default:
      return state;
  }
}

function artistsByTimeRangeName(state = initialState.artistsByTimeRangeName, action) {
  switch (action.type) {
    case RECEIVE_ARTISTS:
    case REQUEST_ARTISTS:
      return { ...state, [action.timeRangeName]: artists(state[action.timeRangeName], action) };
    default:
      return state;
  }
}

function tracks(state = initialState.tracks, action) {
  switch (action.type) {
    case REQUEST_TRACKS:
      return { ...state, isFetching: true };
    case RECEIVE_TRACKS:
      return { ...state, isFetching: false, items: action.items };
    default:
      return state;
  }
}

function tracksByTimeRangeName(state = initialState.tracksByTimeRangeName, action) {
  switch (action.type) {
    case RECEIVE_TRACKS:
    case REQUEST_TRACKS:
      return { ...state, [action.timeRangeName]: tracks(state[action.timeRangeName], action) };
    default:
      return state;
  }
}

function features(state = initialState.features, action) {
  switch (action.type) {
    case REQUEST_FEATURES:
      return { ...state, isFetching: true };
    case RECEIVE_FEATURES:
      return { ...state, isFetching: false, items: action.items };
    default:
      return state;
  }
}

function featuresByTimeRangeName(state = initialState.featuresByTimeRangeName, action) {
  switch (action.type) {
    case RECEIVE_FEATURES:
    case REQUEST_FEATURES:
      return { ...state, [action.timeRangeName]: features(state[action.timeRangeName], action) };
    default:
      return state;
  }
}

function artistCountries(state = initialState.artistCountries, action) {
  switch (action.type) {
    case REQUEST_ARTIST_COUNTRIES:
      return { ...state, isFetching: true };
    case RECEIVE_ARTIST_COUNTRIES:
      return { ...state, isFetching: false, items: action.items };
    default:
      return state;
  }
}

function artistCountriesByTimeRangeName(
  state = initialState.artistCountriesByTimeRangeName,
  action,
) {
  switch (action.type) {
    case RECEIVE_ARTIST_COUNTRIES:
    case REQUEST_ARTIST_COUNTRIES:
      return {
        ...state,
        [action.timeRangeName]:
        artistCountries(state[action.timeRangeName], action),
      };
    default:
      return state;
  }
}

function artistReleases(state = initialState.artistReleases, action) {
  switch (action.type) {
    case REQUEST_ARTIST_RELEASES:
      return { ...state, isFetching: true };
    case RECEIVE_ARTIST_RELEASES:
      return { ...state, isFetching: false, items: action.items };
    default:
      return state;
  }
}

function artistReleasesByTimeRangeName(
  state = initialState.artistReleasesByTimeRangeName,
  action,
) {
  switch (action.type) {
    case RECEIVE_ARTIST_RELEASES:
    case REQUEST_ARTIST_RELEASES:
      return {
        ...state,
        [action.timeRangeName]:
        artistReleases(state[action.timeRangeName], action),
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user,
  hasClickedCreate,
  timeRangeName,
  artistCount,
  trackCount,
  genreCount,
  statsOptions,
  displayProfile,
  displayMap,
  optimizeTracks,
  artists,
  artistsByTimeRangeName,
  tracks,
  tracksByTimeRangeName,
  features,
  featuresByTimeRangeName,
  artistCountries,
  artistCountriesByTimeRangeName,
  artistReleases,
  artistReleasesByTimeRangeName,
});

export default rootReducer;
