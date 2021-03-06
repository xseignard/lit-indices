import React, { Component } from 'react';
import C from '../../constants';

import './style.css';

const FlipClock = global.FlipClock;
const $ = global.jQuery;

class Clock extends Component {
	componentDidMount() {
		this.clock = new FlipClock($('#clock'), {
			countdown: true,
			clockFace: 'MinuteCounter',
			autoStart: false,
		});
		this.clock.setTime(this.props.time || 3600);
	}

	shouldComponentUpdate(nextProps) {
		return this.props.time !== nextProps.time;
	}

	componentWillUpdate(nextProps) {
		this.clock.setTime(nextProps.time);
		// this.clock.flip();
		this.tick.play();
	}

	render() {
		let className = 'flip-clock-wrapper';
		if (this.props.time <= this.props.orange) className += ' orange';
		if (this.props.time <= this.props.red) className += ' red';
		return (
			<div>
				<div id="clock" className={className} />
				<audio
					muted={this.props.muted}
					src={`${C.SERVER_HOST}:${C.SERVER_PORT}/fx/tick.mp3`}
					ref={c => (this.tick = c)}
				/>
			</div>
		);
	}
}

export default Clock;
