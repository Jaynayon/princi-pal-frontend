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
            const response = await instance.post('http://localhost:4000/users/create', {
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
                .then(response => {
                    console.log('Response data:', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error validating user:', error);
                    // Handle errors here (e.g., display error message)
                });

            console.log(response);

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
            const response = await instance.post('http://localhost:4000/authenticate/login', {
                emailOrUsername: email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log('Response data:', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error validating user:', error);
                    // Handle errors here (e.g., display error message)
                });

            isAuthenticated = response.isMatch;
            return isAuthenticated;
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw new Error("Authentication failed. Please try again later.");
        }
    };

    const validateUsernameEmail = async (email) => {
        try {
            const response = await instance.post('http://localhost:4000/users/exists', {
                emailOrUsername: email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log('Response data:', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error validating user:', error);
                    // Handle errors here (e.g., display error message)
                });
            if (response) {
                return response;
            }
        } catch (error) {
            console.error('Error validating username/email:', error);
            throw new Error("Validation failed. Please try again later.");
        }
    };

    const validateToken = async (token) => {
        try {
            if (token) {
                const response = await instance.get(`http://localhost:4000/authenticate/verify/?token=${token}`)
                    .then(response => {
                        console.log('Response data:', response.data);
                        return response.data;
                    })
                    .catch(error => {
                        console.error('Error verifying token:', error);
                        // Handle errors here (e.g., display error message)
                    });
                return response
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
            const response = await instance.get(`http://localhost:4000/users/${user_id}`)
                .then(response => {
                    console.log('Response data:', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error getting user:', error);
                    // Handle errors here (e.g., display error message)
                });
            if (response) {
                return response;
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error("Get user failed. Please try again later.");
        }
    };

    const getLrByDocumentId = async (doc_id) => {
        try {
            const response = await instance.get(`http://localhost:4000/lr/documents/${doc_id}`)
                .then(response => {
                    console.log('Response data:', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error getting document:', error);
                    // Handle errors here (e.g., display error message)
                });
            if (response) {
                return response;
            }
        } catch (error) {
            console.error('Error fetching lrs by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const getJevByDocumentId = async (doc_id) => {
        try {
            const response = await instance.get(`http://localhost:4000/jev/documents/${doc_id}`)
                .then(response => {
                    console.log('Response data:', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error getting document:', error);
                    // Handle errors here (e.g., display error message)
                });
            if (response) {
                return response;
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

    const getLrByKeyword = async (keyword) => {
        try {
            const response = await instance.get(`http://localhost:4000/lr/keyword/${keyword}`)
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

    const getExcelFromLr = async (docId, schoolId, year, month) => {
        try {
            const response = await instance.post('http://localhost:4000/downloadExcel', {
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
            const response = await instance.delete(`http://localhost:4000/lr/${lr_id}`)
                .then(response => {
                    console.log('Response data:', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error getting document:', error);
                    // Handle errors here (e.g., display error message)
                });
            if (response.status === 200) {
                return true;
            }
            return false;
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
            const response = await instance.patch(`http://localhost:4000/lr/${rowId}`, obj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log('Response data:', response.data);
                return response.data;
            })
                .catch(error => {
                    console.error('Error getting document:', error);
                    // Handle errors here (e.g., display error message)
                });
            if (response.status === 200) {
                return true;
            }
            return false;
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
            const response = await instance.patch(`http://localhost:4000/jev/${rowId}`, obj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log('Response data:', response.data);
                return response.data;
            })
                .catch(error => {
                    console.error('Error getting document:', error);
                    // Handle errors here (e.g., display error message)
                });
            if (response.status === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error fetching lrs by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const createLrByDocId = async (doc_id, obj) => {
        try {
            const response = await instance.post('http://localhost:4000/lr/create', {
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
            }).then(response => {
                console.log('Response data:', response.data);
                return response.data;
            })
                .catch(error => {
                    console.error('Error getting document:', error);
                    // Handle errors here (e.g., display error message)
                });
            if (response.status === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error creating user by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const createDocBySchoolId = async (schoolId, month, year, obj) => {
        try {
            const response = await instance.post('http://localhost:4000/documents/create', {
                schoolId,
                month,
                year
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Check if document creation was successful
            if (response) {
                const newDocumentId = response.data.id;

                // Insert new LR using the newly created document's ID
                const lrCreationResponse = await createLrByDocId(newDocumentId, obj);

                if (lrCreationResponse) {
                    console.log('LR created successfully');
                } else {
                    console.error('Failed to create LR');
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
        let obj = {}

        // Construct the payload object based on the provided colId
        if (description === "Claimant") {
            obj = { claimant: value };
        } else if (description === "SDS") {
            obj = { sds: value };
        } else if (description === "Head. Accounting Div. Unit") {
            obj = { headAccounting: value };
        }

        try {
            const response = await instance.patch(`http://localhost:4000/documents/${docId}`, obj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log('Response data:', response.data);
                return response.data;
            })
                .catch(error => {
                    console.error('Error getting document:', error);
                    // Handle errors here (e.g., display error message)
                });
            if (response.status === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error fetching lrs by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
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
        getExcelFromLr,
        deleteLrById,
        updateLrById,
        createLrByDocId,
        updateDocumentById,
        getJevByDocumentId,
        updateJevById,
        createDocBySchoolId,
        getLrByKeyword
    };
})();

export default RestService;
