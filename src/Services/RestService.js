import axios from 'axios';

//Function that allows us to accept credentials
const instance = axios.create({
    baseURL: 'http://localhost:4000', // Set your backend URL
    withCredentials: true, // Enable sending cookies with cross-origin requests
});

const RestService = (() => {
    let isAuthenticated = false;

    const createUser = async (fname, mname, lname, username, email, password, position) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_USER}/create`, {
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
            })

            if (response) {
                console.log(response.data)
            }

            return response.status === 201;
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response && error.response.status === 409) {
                throw new Error("User with the same email or username already exists.");
            } else {
                throw new Error("Registration failed. Please try again later.");
            }
        }
    };

    const createUserPrincipal = async (adminId, fname, mname, lname, username, email, password) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_USER}/create/principal`, {
                adminId,
                fname,
                mname,
                lname,
                username,
                email,
                password,
                position: "Principal"
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response) {
                console.log(response.data)
            }

            return response.status === 201;
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response && error.response.status === 409) {
                throw new Error("User with the same email or username already exists.");
            } else {
                throw new Error("Registration failed. Please try again later.");
            }
        }
    };



    const validateUsernameEmail = async (email) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_USER}/exists`, {
                emailOrUsername: email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response) {
                console.log(response.data);
            }

            return response.data
        } catch (error) {
            console.error('Error validating username/email:', error);
            throw new Error("Validation failed. Please try again later.");
        }
    };

    const validateToken = async (token) => {
        try {
            if (token) {
                const response = await instance.get(`${process.env.REACT_APP_API_URL_AUTH}/verify/?token=${token}`)
                if (response) {
                    console.log(response.data)
                }
                return response.data
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
            const response = await instance.get(`${process.env.REACT_APP_API_URL_USER}/${user_id}`)
            if (response) {
                console.log(response.data);
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error("Get user failed. Please try again later.");
        }
    };

    const getDocumentBySchoolIdYear = async (school_id, year) => {
        try {
            const response = await instance.get(`${process.env.REACT_APP_API_URL_DOC}/school/${school_id}/${year}`)
            if (response) {
                console.log(response.data);
            }
            return response.data
        } catch (error) {
            console.log(error.response.data)
            //console.error('Error fetching lrs by document id:', error.message);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const getSchoolName = async (name) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_SCHOOL}/name`, {
                name
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error retrieving school:', error);
            return null;
        }
    };

    const getSchoolFullName = async (fullName) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_SCHOOL}/fullname`, {
                fullName
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error retrieving school:', error);
            return null;
        }
    };

    const createSchool = async (name, fullName) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_SCHOOL}/create`, {
                name,
                fullName
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error creating school:', error);
            return null;
        }
    };

    const getPrincipal = async (schoolId) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_SCHOOL}/principal`, {
                schoolId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error creating school:', error);
            return null;
        }
    };

    const getUserByEmailUsername = async (email) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_USER}/schools`, {
                emailOrUsername: email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error creating school:', error);
            return null;
        }
    };

    const insertUserAssociation = async (userId, schoolId) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_ASSOC}/insert`, {
                userId,
                schoolId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error creating school:', error);
            return null;
        }
    };

    const getSchools = async () => {
        try {
            const response = await instance.get(`${process.env.REACT_APP_API_URL_SCHOOL}/all`); // Adjust endpoint as needed
            console.log('Fetched schools:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching schools:', error);
            throw new Error('Failed to fetch schools. Please try again later.');
        }
    };

    const updateUserPassword = async (userId, newPassword) => {
        try {
            const response = await instance.patch(`${process.env.REACT_APP_API_URL_USER}/${userId}/password`, {
                newPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.status === 200;
        } catch (error) {
            console.error('Error updating password:', error);
            return false;
        }
    };

    const createNotification = async (userId, message, type) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_NOTIFICATION}/create`, {
                userId,
                message,
                type
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.status === 201;
        } catch (error) {
            console.error('Error creating notification:', error);
            return false;
        }
    };

    // Get notifications for a specific user
    const getNotificationsForUser = async (userId) => {
        try {
            const response = await instance.get(`${process.env.REACT_APP_API_URL_NOTIFICATION}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return null;
        }
    };

    // Mark a notification as read
    const markNotificationAsRead = async (notificationId) => {
        try {
            const response = await instance.patch(`${process.env.REACT_APP_API_URL_NOTIFICATION}/${notificationId}/read`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.status === 200;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return false;
        }
    };

    // Delete a notification
    const deleteNotification = async (notificationId) => {
        try {
            const response = await instance.delete(`${process.env.REACT_APP_API_URL_NOTIFICATION}/${notificationId}`);
            return response.status === 200;
        } catch (error) {
            console.error('Error deleting notification:', error);
            return false;
        }
    };


    return {
        createUser,
        validateUsernameEmail,
        validateToken,
        getIsAuthenticated,
        getUserById,
        getDocumentBySchoolIdYear,
        createUserPrincipal,
        getSchoolName,
        getSchoolFullName,
        createSchool,
        getPrincipal,
        getUserByEmailUsername,
        insertUserAssociation,
        getSchools,
        updateUserPassword,
        createNotification,
        getNotificationsForUser,
        markNotificationAsRead,
        deleteNotification
    };
})();

export default RestService;