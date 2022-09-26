import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

class DataService {

	postNext(player,choice) {
		return axios.post(API_URL + "/next", {
            nourriture: player.nourriture,
            vie: player.vie,
            argent: player.argent,
            neutrality: player.neutrality,
            step: player.step,
            choice : choice
		});
	};

	getConnection() {
		return axios.get(API_URL);
	};

    postConnection(userId) {
        return axios.post(API_URL, {
            userId: userId
        });
    }

}

export default new DataService();