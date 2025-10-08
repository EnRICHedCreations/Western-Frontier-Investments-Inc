// Firebase Configuration for Western Frontier Investments
const firebaseConfig = {
    apiKey: "AIzaSyCVdqc4TEdKi_yXsL2tDgMdx8Kv7EbcQMY",
    authDomain: "western-frontier.firebaseapp.com",
    projectId: "western-frontier",
    storageBucket: "western-frontier.firebasestorage.app",
    messagingSenderId: "162158328587",
    appId: "1:162158328587:web:1f6f10e82257e2c720400e",
    measurementId: "G-39MZW5CB3S"
};

// Initialize Firebase
let db;
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Cloud Storage Helper
const CloudStorage = {
    // Save data to Firestore
    async saveData(collection, data) {
        try {
            if (!db) {
                throw new Error('Firestore database not initialized. Please check Firebase setup.');
            }
            console.log(`Attempting to save to ${collection}...`);
            const docRef = db.collection(collection).doc('data');
            await docRef.set({ items: data, lastUpdated: new Date().toISOString() });
            console.log(`Data saved successfully to ${collection}`);
            return true;
        } catch (error) {
            console.error(`Error saving to ${collection}:`, error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            throw error;
        }
    },

    // Load data from Firestore
    async loadData(collection, defaultValue = []) {
        try {
            const docRef = db.collection(collection).doc('data');
            const doc = await docRef.get();

            if (doc.exists) {
                const data = doc.data();
                console.log(`Loaded ${data.items?.length || 0} items from ${collection}`);
                return data.items || defaultValue;
            } else {
                console.log(`No data found in ${collection}, using default`);
                return defaultValue;
            }
        } catch (error) {
            console.error(`Error loading from ${collection}:`, error);
            return defaultValue;
        }
    },

    // Listen for real-time updates
    onDataChange(collection, callback) {
        const docRef = db.collection(collection).doc('data');
        return docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                callback(data.items || []);
            }
        }, (error) => {
            console.error(`Error listening to ${collection}:`, error);
        });
    }
};

// Utility Functions
const WFIUtils = {
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePhone(phone) {
        const re = /^[\d\s\-\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    },

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    },

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existing = document.getElementById('toast-message');
        if (existing) existing.remove();

        // Create new message
        const toast = document.createElement('div');
        toast.id = 'toast-message';
        toast.className = `fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-500 ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
        } text-white font-semibold`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Fade in
        setTimeout(() => toast.classList.add('opacity-100'), 10);

        // Remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }
};

// Make utilities globally available
window.CloudStorage = CloudStorage;
window.WFIUtils = WFIUtils;
