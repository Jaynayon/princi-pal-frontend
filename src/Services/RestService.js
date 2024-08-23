import axios from 'axios';
import { saveAs } from 'file-saver';

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

    const authenticateUser = async (email, password) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_AUTH}/login`, {
                emailOrUsername: email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response) {
                console.log(response.data)
            }

            return response.data;
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw new Error("Authentication failed. Please try again later.");
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

    const getLrByDocumentId = async (doc_id) => {
        try {
            if (doc_id) {
                const response = await instance.get(`${process.env.REACT_APP_API_URL_LR}/documents/${doc_id}`)
                if (response) {
                    console.log(response.data);
                }
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching lrs by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const getJevByDocumentId = async (doc_id) => {
        try {
            if (doc_id) {
                const response = await instance.get(`${process.env.REACT_APP_API_URL_JEV}/documents/${doc_id}`)
                if (response) {
                    console.log(response.data);
                }
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
            const response = await instance.get(`${process.env.REACT_APP_API_URL_DOC}/school/${school_id}/${year}/${month}`)
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

    const getLrByKeyword = async (keyword) => {
        try {
            const response = await instance.get(`${process.env.REACT_APP_API_URL_LR}/keyword/${keyword}`)
            if (response) {
                console.log(response.data);
            }
            return response.data;
        } catch (error) {
            console.log(error.resonse.data)
            //console.error('Error fetching lrs by document id:', error.message);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const getExcelFromLr = async (docId, schoolId, year, month) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_DOWNLOAD}`, {
                documentId: docId,
                schoolId: schoolId,
                year,
                month
            }, {
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

    const deleteLrById = async (lr_id) => {
        try {
            const response = await instance.delete(`${process.env.REACT_APP_API_URL_LR}/${lr_id}`)
            if (response) {
                console.log(response.data)
            }
            return response.status === 200;
        } catch (error) {
            console.error('Error fetching lrs by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const updateLrById = async (colId, rowId, value) => {
        let obj = {}

        // Construct the payload object based on the provided colId
        if (colId === "amount") {
            obj = { amount: value };
        } else if (colId === "particulars") {
            obj = { particulars: value };
        } else if (colId === "orsBursNo") {
            obj = { orsBursNo: value };
        } else if (colId === "date") {
            obj = { date: value };
        } else if (colId === "objectCode") {
            obj = { objectCode: value };
        } else if (colId === "payee") {
            obj = { payee: value };
        } else if (colId === "natureOfPayment") {
            obj = { natureOfPayment: value };
        }

        try {
            const response = await instance.patch(`${process.env.REACT_APP_API_URL_LR}/${rowId}`, obj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response) {
                console.log(response.data);
            }
            return response.status === 200;
        } catch (error) {
            console.error('Error fetching lrs by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const updateJevById = async (colId, rowId, value) => {
        let obj = {}

        // Construct the payload object based on the provided colId
        if (colId === "amount") {
            obj = { amount: value };
        }

        try {
            const response = await instance.patch(`${process.env.REACT_APP_API_URL_JEV}/${rowId}`, obj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response) {
                console.log(response.data);
            }
            return response.status === 200;
        } catch (error) {
            console.error('Error fetching lrs by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const createLrByDocId = async (doc_id, obj) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_LR}/create`, {
                documentsId: doc_id,
                date: obj.date,
                orsBursNo: obj.orsBursNo,
                particulars: obj.particulars,
                amount: obj.amount,
                objectCode: obj.objectCode,
                payee: obj.payee,
                natureOfPayment: obj.natureOfPayment
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.status === 201;
        } catch (error) {
            console.error('Error creating user by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
              } else if (error.request) {
                // Request was made but no response received
                console.error('Request:', error.request);
              }  else {
              console.error('Non-Axios Error:', error);
            }
            return null;
        }
    };

    const createDocBySchoolId = async (schoolId, month, year, obj) => {
        try {
            // Troubleshooting: year and month passed is an array
            // Extracting the year value from the array
            const yearValue = Array.isArray(year) ? year[0] : year;

            // Extracting the month value from the array
            const monthValue = Array.isArray(month) ? month[0] : month;

            const response = await instance.post(`${process.env.REACT_APP_API_URL_DOC}/create`, {
                schoolId,
                month: monthValue,
                year: yearValue
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Check if document creation was successful
            if (response) {
                const newDocumentId = response.data.id;

                // If a payload (obj) is passed, create document and lr, else only document.
                if (obj) {
                    if (obj.cashAdvance) {
                        const setDocumentBudget = await updateDocumentById(newDocumentId, "Cash Advance", obj.cashAdvance);

                        if (setDocumentBudget) {
                            console.log("Budget set successfully");
                        } else {
                            console.error('Failed to set budget')
                        }
                    } else {
                        // Insert new LR using the newly created document's ID
                        const lrCreationResponse = await createLrByDocId(newDocumentId, obj);

                        if (lrCreationResponse) {
                            console.log('LR created successfully');
                        } else {
                            console.error('Failed to create LR');
                        }
                    }
                }

                return response.data; // Return the created document data
            } else {
                console.error('Failed to create document');
                return null;
            }
        } catch (error) {
            console.error('Error creating document:', error);
            return null;
        }
    };

    const updateDocumentById = async (docId, description, value) => {
        // Construct the payload object based on the provided colId
        const payload = {
            "Claimant": { claimant: value },
            "SDS": { sds: value },
            "Head. Accounting Div. Unit": { headAccounting: value },
            "Budget Limit": { budgetLimit: value },
            "Cash Advance": { cashAdvance: value }
        }[description] || {};


        try {
            const response = await instance.patch(`${process.env.REACT_APP_API_URL_DOC}/${docId}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            return response.status === 200;
        } catch (error) {
            console.error('Error fetching lrs by document id:', error);
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
        authenticateUser,
        validateUsernameEmail,
        validateToken,
        getIsAuthenticated,
        getUserById,
        getLrByDocumentId,
        getDocumentBySchoolIdYearMonth,
        getExcelFromLr,
        deleteLrById,
        updateLrById,
        createLrByDocId,
        updateDocumentById,
        getJevByDocumentId,
        updateJevById,
        createDocBySchoolId,
        getLrByKeyword,
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