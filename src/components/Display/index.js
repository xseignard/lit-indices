import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import Clock from '../Clock';
import Clue from '../Clue';
import Atmosphere from '../Atmosphere';
import Intro from '../Intro';

import C from '../../constants';
import getConf from '../../services/getConf';

import './style.css';

class Display extends Component {
	constructor(props) {
		super(props);
		this.state = {
			intro: false,
			clue: null,
			atmosphere: null,
			muted: true,
			volume: 1.0,
			black: false,
			fadeAtmosphere: '',
		};
		this.socket = io(`${C.SERVER_HOST}:${C.SERVER_PORT}`);
		this.socket.on('black', isBlack => {
			this.setState({ black: isBlack, clue: {} });
		});
		this.socket.on('intro', () => {
			this.setState({ intro: true, black: false });
		});
		this.socket.on('clue', clue => {
			if (clue.clearAtmosphere) {
				this.setState({ atmosphere: null });
			} else {
				this.setState({ clue: null });
				this.clueSound.pause();
				this.clueSound.currentTime = 0;
				if (clue.type === 'image' || clue.type === 'text' || !clue.type) {
					this.setState({ clue, fadeAtmosphere: 'up' });
				} else {
					this.clueSound.addEventListener(
						'ended',
						() => {
							this.setState({ clue, fadeAtmosphere: 'down' });
						},
						{ once: true }
					);
				}
				clue.type && this.clueSound.play();
				this.forceUpdate();
			}
		});
		this.socket.on('atmosphere', atmosphere => {
			this.clueSound.pause();
			this.clueSound.currentTime = 0;
			this.setState({ atmosphere });
		});
		this.socket.on('clock', ({ time, muted }) => {
			this.setState({ time, muted });
		});
		this.socket.on('end', gameover => {
			this.setState({
				clue: {
					type: 'text',
					description: gameover ? 'GAME OVER !' : 'FÉLICITATIONS !!!',
				},
				atmosphere: null,
			});
			this.clueSound.pause();
			this.clueSound.currentTime = 0;
			this.clueSound.play();
		});
		this.socket.on('volume', volume => {
			this.setState({ volume });
		});
	}

	componentDidMount() {
		getConf(this.props.match.params.roomId);
		this.clueSound.volume = this.state.volume;
		this.socket.emit('display', this.props.match.params.roomId);
	}

	componentWillReceiveProps(nextProps) {
		this.socket.emit('display', nextProps.match.params.roomId);
	}

	componentWillUnmount() {
		this.socket.emit('leave', this.props.match.params.roomId);
	}

	componentDidUpdate() {
		this.clueSound.volume = this.state.volume;
	}

	endCallback = () => {
		this.setState({ intro: false }, () => {
			this.socket.emit('intro end', this.props.match.params.roomId);
		});
	};

	clueEnd = () => {
		// TODO: clear clue?
		this.setState({ fadeAtmosphere: 'up' });
	};

	render() {
		return (
			<div id="display">
				{this.state.intro && (
					<Intro endCallback={this.endCallback} volume={this.state.volume} />
				)}
				{!this.state.intro && (
					<Clock time={this.state.time} orange={900} red={300} muted={this.state.muted} />
				)}
				<Clue clue={this.state.clue} volume={this.state.volume} clueEnd={this.clueEnd} />
				{this.state.atmosphere && (
					<Atmosphere
						atmosphere={this.state.atmosphere}
						volume={this.state.volume}
						fade={this.state.fadeAtmosphere}
					/>
				)}
				{this.state.black && <div className="black" />}
				<audio
					id="sound"
					src={
						`${C.SERVER_HOST}:${C.SERVER_PORT}/uploads/${this.props.conf.clueSound}` ||
						`${C.SERVER_HOST}:${C.SERVER_PORT}/fx/bell.mp3`
					}
					ref={c => (this.clueSound = c)}
				/>
			</div>
		);
	}
}

export default connect(state => state)(Display);
