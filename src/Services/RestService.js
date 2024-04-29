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
            if (error.response && error.response.status === 409) {
                throw new Error("User with the same email or username already exists.");
            } else {
                throw new Error("Registration failed. Please try again later.");
            }
        }
    },
    async authenticateUser(email, password) {
        try {
            const response = await axios.post('http://localhost:4000/users/validate', {
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data.isMatch ? true : false

        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response && error.response.status === 409) {
                throw new Error("User with the same email or username already exists.");
            } else {
                throw new Error("Registration failed. Please try again later.");
            }
        }
    },
    async validateUsernameEmail(details) {
        try {
            const response = await axios.get(`http://localhost:4000/users/exists/${details}`);

            return response.data.exists

        } catch (error) {
            console.error('Error user details:', error);
            /*if (error.response && error.response.status === 409) {
                throw new Error("User with the same email or username already exists.");
            } else {
                throw new Error("Registration failed. Please try again later.");
            }*/
        }
    },
};

export default RestService;
