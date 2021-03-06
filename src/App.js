import React, { Component } from 'react';
import './styles/main.scss';
import Header from './Header';
import Search from './Search';
import ConcertDisplay from './ConcertDisplay';
import AudioPlayer from './AudioPlayer';

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentSong: 0,
      currentSetlist: [{title: '--', mp3: '', duration: 0}],
      currentShow: {date: "--", venue: {name: "--", location: "--"}},
      currentSearch: '',
      concertData: [],
      showAllConcerts: false,
      concertVenues: [],
      concertDates: [],
      songs: []
    };
  } 

  componentDidMount() {
    fetch('https://whateverly-datasets.herokuapp.com/api/v1/phishShows')
      .then(response => response.json()) 
      .then(concertData => {
        this.setState({
          concertData: concertData.phishShows,
          concertVenues: Array.from(concertData.phishShows).map(show => {
            return show.venue.name;
          }),
          concertDates: Array.from(concertData.phishShows).map(show => {
            return show.date;
          })
        })
      })
      .catch(error => console.error(error));
    fetch('https://whateverly-datasets.herokuapp.com/api/v1/setLists')
      .then(response => response.json())
      .then(setListData => {
        const showKeys = Object.keys(setListData.setLists);
        const newSongs = [];
        showKeys.forEach(show => {
          Array.from(setListData.setLists[show]).forEach(song => {
            newSongs.push(song.title);
          });
        });
        this.setState({
          setlistData: setListData.setLists,
          songs: newSongs
        })
      })
      .catch(error => console.error(error));
  }

  toggleShowAllConcerts = (boolean, e) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    this.setState({
      showAllConcerts: boolean
    });
  }

  updateRandomConcertData = (e) => {
    e.preventDefault();
    this.toggleShowAllConcerts(false, e);
    this.forceUpdate();
  }

  updateCurrentSetlist = (id) => {
    let show = this.state.concertData.find((concert) => {
      return concert.id === id;
    });

    this.setState({
      currentSetlist: this.state.setlistData[id],
      currentShow: show
    });
  }

  goToNextSong = (isSongFinished) => {
    if (isSongFinished === 1) {
      this.setState({
        currentSong: this.state.currentSong + 1
      });
    } else {
      this.setState({
        currentSong: this.state.currentSong - 1
      });
    }
  }

  updateCurrentDisplay = (searchValue) => {
    this.setState({
      currentSearch: searchValue
    });
  }

  updateCurrentSongIndex = (songIndex) => {
    this.setState({
      currentSong: songIndex
    });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Search updateCurrentDisplay={this.updateCurrentDisplay}
          updateRandomConcertData={this.updateRandomConcertData}
          concertDates={this.state.concertDates}
          songs={this.state.songs}
          concertVenues={this.state.concertVenues}
          toggleShowAllConcerts={this.toggleShowAllConcerts}/>
        <ConcertDisplay concertData={this.state.concertData}
          showAllConcerts={this.state.showAllConcerts}
          currentShow={this.state.currentShow}
          currentSetlist={this.state.currentSetlist}
          setlistData={this.state.setlistData}
          currentSearch={this.state.currentSearch}
          updateCurrentSong={this.updateCurrentSong}
          updateCurrentSongIndex={this.updateCurrentSongIndex}
          updateCurrentSetlist={this.updateCurrentSetlist}
          updateRandomConcertData={this.updateRandomConcertData}
          toggleShowAllConcerts={this.toggleShowAllConcerts}/>
        <AudioPlayer currentSong={this.state.currentSong}
          currentSetlist={this.state.currentSetlist}
          currentShow={this.state.currentShow}
          goToNextSong={this.goToNextSong} />
      </div>
    );
  }
}

export default App;
