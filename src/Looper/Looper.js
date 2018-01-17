import _ from 'lodash';
import React from 'react';
import TrackList from '../Constants/TracksList';
import Track from "../Track/Track";
import './looper.css'
import Dropdown from 'react-dropdown'

export default class Looper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playingAll: false,
            sync: false,
            trackList: TrackList,
            maxBpm: 0,
            sourceTrackList: _.map(TrackList, (track) => {
                return track.url.split('/').pop();
            })
        };
        this.shufflePlayAll = this.shufflePlayAll.bind(this);
        this.shuffleSyncAll = this.shuffleSyncAll.bind(this);
        this.setTrackAttribute = this.setTrackAttribute.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.addTrack = this.addTrack.bind(this);
        _.map(this.state.trackList, (track) => {
            this.setTrackAttribute(track.Id, 'inLooper', false)
        });
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
        this.setTrackAttribute(trackId, 'inLooper', false);
        // var newTrackList = _.filter(this.state.trackList, (i) => i.Id !== trackId);
        // this.setState({trackList: newTrackList});
    }

    addTrack(trackVal) {
        var newTrackList = _.map(this.state.trackList, (track) => {
            if (track.url.split('/').pop() === trackVal.value)
                track['inLooper'] = true;
            return track
        });
        this.setState({trackList: newTrackList});
    }

    render() {
        var trackList = this.state.sync ? this.sortTracksByDuration() : this.state.trackList;
        var TrackListComponent = _.map(trackList, (track) => {
            if (track['inLooper'])
                return <Track setTrackAttribute={this.setTrackAttribute} owner={track.owner} bpm={track.bpm}
                              id={track.Id}
                              url={track.url} removeTrack={this.removeTrack} duration={this.duration}
                              playingAll={this.state.playingAll} sync={this.state.sync} maxBpm={this.state.maxBpm}/>
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
                    <Dropdown className="selectTrack dropdown-content" options={this.state.sourceTrackList}
                              onChange={(v) => this.addTrack(v)}
                              value={"Select track to add ..."}/>
                    {TrackListComponent}
                </div>
            </div>
        )
    }
}