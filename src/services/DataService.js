import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

class DataService {

	postNext(player) {
		return axios.post(API_URL, {
            nourriture: player.nourriture,
            vie: player.vie,
            argent: player.argent,
            neutrality: player.neutrality,
            step: player.step
		})
	}

}

export default new DataService();