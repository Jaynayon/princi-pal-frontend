import axios from 'axios';

const RestService = {
    async createUser(fname, mname, lname, username, email, password, position) {
        try {
            const response = await axios.post('http://localhost:4000/users', {
                fname,
                mname,
                lname,
                username,
                email,
                password,
                position
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data);
            return true;
        } catch (error) {
            console.error('Error creating user:', error);
            return false;
        }
    }
};

export default RestService;
