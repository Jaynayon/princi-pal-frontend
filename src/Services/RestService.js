import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4000', // Set your backend URL
    withCredentials: true, // Enable sending cookies with cross-origin requests
});


const RestService = {
    async createUser(fname, mname, lname, username, email, password, position) {
        try {
            const response = await instance.post('http://localhost:4000/users', {
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
            console.log(document.cookie)
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
            const response = await instance.post('http://localhost:4000/users/validate', {
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
            const response = await instance.get(`http://localhost:4000/users/exists/${details}`);

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
