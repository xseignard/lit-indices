import C from '../constants';
import { store } from '../store';
import { getClues } from '../actions/clues';

const url = `${C.SERVER_HOST}:${C.SERVER_PORT}/api/room/`;

const get = roomId => {
	fetch(url + roomId).then(res => {
		// TODO: handle error 500
		res.json().then(json => {
			store.dispatch(getClues(json));
		});
	});
};

export default get;
