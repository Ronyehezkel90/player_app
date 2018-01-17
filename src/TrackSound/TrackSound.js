import Sound from 'react-sound';
import React from 'react';
import Detecor from '../Utils/bpmDetector';
import './trackSound.css';
import CircularProgressBar from "../CircularProgressBar/CircularProgressBar";


class Voice extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (this.props.playing !== nextProps.playing || this.props.volume !== nextProps.volume || this.props.refresh !== nextProps.refresh);
    }

    render() {
        return (
            <Sound
                url={this.props.url}
                //PLAYING,STOPPED,PAUSED
                playFromPosition={this.props.position}
                playStatus={this.props.playing === true ? Sound.status.PLAYING : Sound.status.STOPPED}
                autoLoad={true}
                loop={this.props.loop}
                volume={this.props.volume}
                onLoad={(val) => this.props.onLoad(val.loaded)}
                onLoading={(val) => this.props.onLoading(val)}
                onPlaying={(val) => this.props.handleSongPlaying(val)}
                onStop={this.props.onStop}
                onFinishedPlaying={this.props.onStop}
            />
        )
    }
}

export default class TrackSound extends React.Component {
    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.onStop = this.onStop.bind(this);
        this.handleSongPlaying = this.handleSongPlaying.bind(this);
        this.state = {percent: 0, position: 0}
        this.needRefresh = false;
    }

    handleSongPlaying(playingData) {
        var percent = parseInt((playingData.position / playingData.duration) * 100, 10);
        this.setState({percent: percent, position: playingData.position});
    }

    onLoad(successLoading) {
        if (successLoading) {
            Detecor(this.props.url).then(bpm => {
                this.props.setTrackAttribute(this.props.id, 'bpm', bpm);
            });
        }
    }

    onStop() {
        this.setState({position: 0});
    }

    setDuration(val) {
        if (val.duration !== 0)
            this.props.setTrackAttribute(this.props.id, "duration", parseInt(val.duration))
    }

    componentDidUpdate(prevProps, prevState) {
        this.needRefresh = !prevProps.refresh && this.props.refresh;
    }

    render() {
        return (
            <div>
                <Voice {...this.props} position={this.needRefresh ? 0 : this.state.position}
                       onLoading={(val) => this.setDuration(val)}
                       handleSongPlaying={this.handleSongPlaying} onLoad={this.onLoad} onStop={this.onStop}/>
                <CircularProgressBar percentage={this.props.playing ? this.state.percent : 0}>
                        <span
                            className={this.props.playing ? "glyphicon glyphicon-pause" : "glyphicon glyphicon-play"}
                            onClick={this.props.shuffleSound}/>
                </CircularProgressBar>
            </div>
        )
    }
}