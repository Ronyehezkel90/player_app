import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './track.css'
import TrackSound from "../TrackSound/TrackSound";
import CircularProgressBar from "../CircularProgressBar/CircularProgressBar";

class Track extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            volume: 50,
            playing: false,
            origin: false
        };
        this.button_clicked = false;
        this.shuffleSound = this.shuffleSound.bind(this);
        this.getPlayingStatus = this.getPlayingStatus.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.showOriginalBpm = this.showOriginalBpm.bind(this);

    }

    shuffleSound() {
        this.button_clicked = true;
        this.setState({playing: !this.state.playing}, () => {
            this.button_clicked = false;
        });
    }

    changeVolume(volume) {
        if (this.state.playing) {
            this.button_clicked = true;
            this.setState({volume: volume}, () => {
                this.button_clicked = false;
            });
        }
        else if (this.props.playing) {
            this.setState({volume: volume});
        }
    }

    removeTrack() {
        this.props.removeTrack(this.props.id);
    }

    getPlayingStatus() {
        return this.button_clicked ? this.state.playing : this.props.playing;
    }

    showOriginalBpm() {
        if (this.props.sync)
            this.setState({origin: !this.state.origin})
    }

    render() {
        return (
            <div className="track row" id={this.props.id}>
                <div className="col-sm-2" id={this.props.id + 'progress_bar'}>
                    <TrackSound url={this.props.url}
                                playing={this.getPlayingStatus()}
                                loop={!this.button_clicked}
                                id={this.props.id}
                                setTrackAttribute={this.props.setTrackAttribute}
                                shuffleSound={this.shuffleSound}
                                volume={this.state.volume}
                    />
                </div>
                <div className="col-sm-5 text-left">
                    <p>
                        name: {this.props.url.split('/').pop()}
                    </p>
                    <p>
                        owner: {this.props.owner}
                    </p>
                    <p onClick={this.showOriginalBpm}>
                        bpm: {this.props.sync && !this.state.origin ? this.props.maxBpm : this.props.bpm}
                    </p>

                </div>
                <div id={this.props.id + 'track_data'}/>
                <a href={this.props.url} download/>
                <div className="col-sm-5">
                    <div className="clearfix">
                        <span className={"glyphicon glyphicon-trash pull-right"}
                              onClick={this.removeTrack}/>
                    </div>
                    <div className="row volume-container">
                        <div className="col-sm-7">

                            <span className={"glyphicon glyphicon-volume-up pull-right"}/>
                        </div>
                        <div className="col-sm-5 pull-right">
                            <InputRange minValue={1} maxValue={100}
                                        onChange={(value) => this.changeVolume(value)}
                                        value={this.state.volume}/>
                        </div>

                    </div>

                </div>
            </div>
        )
    }


}

export default Track;
