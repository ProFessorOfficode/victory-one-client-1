import { auth, firestore } from '~/plugins/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function ({ redirect, route }) {
    // Check if we are on the client-side
    if (process.client) {
        const user = auth.currentUser; // Get the current user

        // Check if the user is trying to access the checkout page
        if (route.path === '/checkout' && !user) {
            console.log("User is not authenticated, redirecting to sign-in.");
            return redirect('/sign/signin'); // Redirect to sign-in page if not authenticated and accessing checkout
        }

        // If the user is authenticated, handle role-based access
        if (user) {
            try {
                // Fetch the user's role from Firestore using the user's UID
                const userRef = doc(firestore, 'Users', user.uid);
                const userDoc = await getDoc(userRef);

                // If user document doesn't exist or role is not set, redirect to no-access page
                if (!userDoc.exists() || !userDoc.data().role) {
                    console.log("User document not found or role not set.");
                    return redirect('/no-access');
                }

                // Get the user's role from Firestore
                const userRole = userDoc.data().role;
                console.log("User role fetched from Firestore:", userRole);

                // Define the roles that can access any page
                const allowedRoles = ['customer', 'admin', 'owner', 'cashier', 'Business Owner'];

                // If the user has one of the allowed roles, grant access
                if (allowedRoles.includes(userRole)) {
                    console.log("Access granted for role:", userRole);
                    return;
                }

                // Default action if role is not allowed (e.g., redirect to no-access page)
                console.log("Access denied for role:", userRole);
                return redirect('/no-access');
            } catch (error) {
                console.error("Error fetching user document and role:", error);
                return redirect('/no-access'); // In case of an error, redirect to no-access page
            }
        }
    }
}
