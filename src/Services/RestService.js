import axios from 'axios';
import { saveAs } from 'file-saver';

const instance = axios.create({
    baseURL: 'http://localhost:4000', // Set your backend URL
    withCredentials: true, // Enable sending cookies with cross-origin requests
});

const RestService = (() => {
    let isAuthenticated = false;

    const createUser = async (fname, mname, lname, username, email, password, position) => {
        try {
            const response = await instance.post('/users', {
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
    };

    const authenticateUser = async (email, password) => {
        try {
            const response = await instance.post('/authenticate/login', {
                emailOrUsername: email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            isAuthenticated = response.data.isMatch;
            return isAuthenticated;
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw new Error("Authentication failed. Please try again later.");
        }
    };

    const validateUsernameEmail = async (details) => {
        try {
            const response = await instance.get(`/users/exists/${details}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error validating username/email:', error);
            throw new Error("Validation failed. Please try again later.");
        }
    };

    const validateToken = async (token) => {
        try {
            if (token) {
                const response = await instance.get(`/authenticate/verify/?token=${token}`);
                console.log('Response data:', response.data);
                return response.data;
            }
        } catch (error) {
            console.error('Error validating token:', error);
            throw new Error("Token validation failed. Please try again later.");
        }
    };

    const getIsAuthenticated = () => {
        return isAuthenticated;
    };

    const getUserById = async (user_id) => {
        try {
            const response = await instance.get(`/users/${user_id}`);
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error("Get user failed. Please try again later.");
        }
    };

    const getLrByDocumentId = async (doc_id) => {
        try {
            const response = await instance.get(`http://localhost:4000/lr/documents/${doc_id}`)
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching lrs by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const getDocumentBySchoolIdYearMonth = async (school_id, year, month) => {
        try {
            const response = await instance.get(`http://localhost:4000/documents/school/${school_id}/${year}/${month}`)
                .then(response => {
                    console.log(response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error(error.response.data)
                })

            if (response) {
                return response;
            }
        } catch (error) {
            console.log(error.resonse.data)
            //console.error('Error fetching lrs by document id:', error.message);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const getExcelFromLr = async (document_id) => {
        try {
            const response = await instance.get(`http://localhost:4000/downloadExcel/${document_id}`, {
                responseType: 'blob' // Set the response type to 'blob' to handle binary data
            });

            // Extract blob data from the response
            const blobData = new Blob([response.data], { type: 'application/octet-stream' });

            // Use FileSaver.js to trigger file download
            saveAs(blobData, 'LR-2024.xlsx');

            return response.data; // Optionally return the blob data
        } catch (error) {
            console.error('Error downloading Excel file:', error);
            return null;
        }
    };

    return {
        createUser,
        authenticateUser,
        validateUsernameEmail,
        validateToken,
        getIsAuthenticated,
        getUserById,
        getLrByDocumentId,
        getDocumentBySchoolIdYearMonth,
        getExcelFromLr
    };
})();

export default RestService;
