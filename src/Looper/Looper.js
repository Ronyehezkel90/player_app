import _ from 'lodash';
import React from 'react';
import TrackList from '../Constants/TracksList';
import Track from "../Track/Track";
import './looper.css'

export default class Looper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playingAll: false,
            sync: false,
            trackList: TrackList,
            maxBpm: 0
        };
        this.shufflePlayAll = this.shufflePlayAll.bind(this);
        this.shuffleSyncAll = this.shuffleSyncAll.bind(this);
        this.setTrackAttribute = this.setTrackAttribute.bind(this);
        this.removeTrack = this.removeTrack.bind(this);

    }

    setTrackAttribute(TrackId, attr, attrVal) {
        var newTrackList = _.map(this.state.trackList, (track) => {
            if (track.Id === TrackId)
                track[attr] = attrVal;
            return track
        });
        this.setState({trackList: newTrackList});
    }

    shufflePlayAll() {
        this.setState({playingAll: !this.state.playingAll});
    }

    shuffleSyncAll() {
        this.setState({sync: !this.state.sync, maxBpm: this.getMaxBpm(), playingAll: !this.state.sync});
    }

    sortTracksByDuration() {
        return _.sortBy(this.state.trackList, 'duration');
    }

    getMaxBpm() {
        return Math.max.apply(Math, _.map(this.state.trackList, (track) => {
            return track.bpm;
        }));
    }

    removeTrack(trackId) {
        var newTrackList = _.filter(this.state.trackList, (i) => i.Id !== trackId);
        this.setState({trackList: newTrackList});
    }

    render() {
        var trackList = this.state.sync ? this.sortTracksByDuration() : this.state.trackList;
        var TrackListComponent = _.map(trackList, (track) => {
            return <Track setTrackAttribute={this.setTrackAttribute} owner={track.owner} bpm={track.bpm} id={track.Id}
                          url={track.url} removeTrack={this.removeTrack} duration={this.duration}
                          playing={this.state.playingAll} sync={this.state.sync} maxBpm={this.state.maxBpm}/>
        });

        return (
            <div className="container">
                <div className="looper center-block">
                    <nav className="clearfix">
                        <label className={'nav_button'}
                               onClick={this.shufflePlayAll}>{this.state.playingAll ? 'Stop' : 'Play'}</label>
                        <label className={'nav_button'}
                               onClick={this.shuffleSyncAll}>{this.state.sync ? 'UnSync' : 'Sync'}</label>
                    </nav>
                    <p className={'selectTrack'}>Select Track</p>
                    {TrackListComponent}
                </div>
            </div>
        )
    }
}