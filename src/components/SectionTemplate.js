import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Container, Row, Col } from "react-bootstrap";

import SectionHeader from "./SectionHeader";
import ArtistGrid from "./ArtistGrid";
import TrackGrid from "./TrackGrid";
import WordCloud from "./WordCloud";
import ComponentHeader from "./ComponentHeader";

const SectionTemplate = ({ title, timeRange }) => {
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);

  const isFetchComplete = () => artists.length > 0 && tracks.length > 0;

  useEffect(() => {
    const fetchArtists = async () => {
      const result = await axios
        .get("http://localhost:3000/my-top-artists", {
          params: {
            time_range: timeRange + "_term",
            limit: 50
          }
        })
        .catch(err => console.log(err));

      setArtists(result.data.items);
    };

    const fetchTracks = async () => {
      const result = await axios
        .get("http://localhost:3000/my-top-tracks", {
          params: {
            time_range: timeRange + "_term",
            limit: 50
          }
        })
        .catch(err => console.log(err));

      setTracks(result.data.items);
    };

    fetchArtists();
    fetchTracks();
  }, [timeRange]);
  return (
    <div style={{ marginTop: "2em" }}>
      <SectionHeader title={title} />
      {!isFetchComplete && <Spinner animation="border" />}
      {isFetchComplete && (
        <Container>
          <Row>
            <ComponentHeader title="Artists" />
          </Row>
          {artists.length > 0 && (
            <ArtistGrid artists={artists.slice(0, 10)} numRows={2} />
          )}
          {tracks.length > 0 && (
            <Row style={{ paddingTop: "2em" }}>
              <Col xs={8} style={{ padding: "0 0.5em 0 0" }}>
                <WordCloud
                  genres={[...artists.map(a => a.genres).flat()]}
                  count={40}
                />
              </Col>
              <Col xs={4} style={{ padding: "0 0 0 0.5em" }}>
                <TrackGrid tracks={tracks} count={5} />
              </Col>
            </Row>
          )}
        </Container>
      )}
    </div>
  );
};

export default SectionTemplate;
