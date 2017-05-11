import React, { Component } from 'react';

import './style.css';

const FlipClock = global.FlipClock;
const $ = global.jQuery;

class Clock extends Component {
	componentDidMount() {
		this.clock = new FlipClock($('#clock'), {
			countdown: true,
			clockFace: 'MinuteCounter',
			autoStart: false
		});
	}

	componentWillReceiveProps(nextProps) {
		this.clock.setTime(nextProps.time);
		this.clock.flip();
		this.tick.play();
	}

	render() {
		let className = 'flip-clock-wrapper';
		if (this.props.time <= this.props.orange) className += ' orange';
		if (this.props.time <= this.props.red) className += ' red';
		return (
			<div>
				<div id="clock" className={className}></div>
				<audio src="../fx/tick.mp3" ref={(c) => this.tick = c} />
			</div>
		);
	}
}

export default Clock;
