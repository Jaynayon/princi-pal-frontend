import axios from 'axios';

//Function that allows us to accept credentials
const instance = axios.create({
    baseURL: 'http://localhost:4000', // Set your backend URL
    withCredentials: true, // Enable sending cookies with cross-origin requests
});

const RestService = (() => {
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
        createNotification,
        getNotificationsForUser,
        markNotificationAsRead,
        deleteNotification
    };
})();

export default RestService;