import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

class DataService {

	postNext(player,choice,userId) {
        console.log("postNext called");
		return axios.post(API_URL + "/player/next", {
            player_id: userId,
            nourriture: player.nourriture,
            vie: player.vie,
            argent: player.argent,
            neutrality: player.neutrality,
            step: player.step,
            choice : choice
		});
	};

	getConnection() {
        console.log("getConnection called")
		return axios.get(API_URL + "/player");
	};

    postConnection(userId) {
        console.log("postConnection called")
        return axios.post(API_URL + "/player", {
            player_id: userId
        });
    }

    deletePlayer(userId) {
        console.log("postConnection called")
        return axios.post(API_URL + "/player/delete", {
            player_id: userId
        });
    }

}

export default new DataService();