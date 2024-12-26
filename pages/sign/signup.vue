<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="auth-card">
          <v-card-title class="justify-center auth-title">Create an Account</v-card-title>

          <div class="text-center" style="margin-top: -20px;">
            ----- sign up using -----
          </div>

          <v-card-text>
            <v-row justify="center">
              <v-col cols="6">
                <v-btn @click="signInWithGoogle" block class="social-btn google-btn" style="background-color: #DB4437;">
                  <v-icon left>mdi-google</v-icon> Google
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <div class="text-center" style="margin-bottom: -10px;">
            ----- or -----
          </div>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="firstName" :rules="nameRules" label="First Name" prepend-icon="mdi-account"
                    required />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="lastName" :rules="nameRules" label="Last Name" prepend-icon="mdi-account"
                    required />
                </v-col>
              </v-row>

              <v-text-field v-model="email" :rules="emailRules" label="Email" prepend-icon="mdi-email" required />

              <v-text-field v-model="password" :rules="passwordRules" label="Password"
                :type="showPassword ? 'text' : 'password'" prepend-icon="mdi-lock" required>
                <template v-slot:append>
                  <v-btn icon @click="showPassword = !showPassword">
                    <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                  </v-btn>
                </template>
              </v-text-field>

              <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules" label="Confirm Password"
                :type="showConfirmPassword ? 'text' : 'password'" prepend-icon="mdi-lock" required>
                <template v-slot:append>
                  <v-btn icon @click="showConfirmPassword = !showConfirmPassword">
                    <v-icon>{{ showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                  </v-btn>
                </template>
              </v-text-field>

              <!-- Role Selection (optional) -->
              <v-select v-model="selectedRole" :items="roleOptions" label="Are You a Business Owner?" style="margin-bottom: -15px;"></v-select>

              <v-btn @click="signUp" class="mt-4 primary-btn" block
                style="background-color: #000; color: #fff; font-weight: bold;" :loading="loading">
                Sign Up
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn text @click="goToSignIn" class="redirect-btn" color="primary">Already have an account?</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Sign-up Successful</v-card-title>
        <v-card-text style="color: black;">
          Please check your email for verification. Thank you for signing up!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="background-color: #ffa900; color: white" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      valid: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      selectedRole: 'customer', // Default role
      showPassword: false,
      showConfirmPassword: false,
      loading: false, // Added loading state
      dialog: false,
      roleOptions: ['Business Owner'], // Only 'Business Owner' role in the list
      nameRules: [v => !!v || 'Name is required', v => v.length >= 2 || 'Name must be at least 2 characters'],
      emailRules: [v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters',
        v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
        v => /[0-9]/.test(v) || 'Password must contain at least one number',
        v => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character',
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirm Password is required',
        v => v === this.password || 'Passwords must match',
      ],
    };
  },
  methods: {
    async signUp() {
      if (this.$refs.form.validate() && this.password === this.confirmPassword) {
        this.loading = true; // Start loading
        const auth = getAuth();
        const db = getFirestore();
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          const user = userCredential.user;

          // Update Firestore with default role 'customer' and other user details
          await setDoc(doc(db, 'Users', user.uid), {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            role: this.selectedRole,  // Use the selected role, defaulting to 'customer'
            createdAt: new Date(),
            userID: user.uid  // Add the userID field with the auto-generated UID
          });

          // Redirect to home page immediately after sign-up
          this.$router.push('/');

        } catch (error) {
          console.error("Sign-up error: ", error);
        } finally {
          this.loading = false; // Stop loading
        }
      }
    },
    async checkEmailVerification(user) {
      // Check if the email is verified
      if (!user.emailVerified) {

        // Optionally: Automatically resend the verification email
        await sendEmailVerification(user);
      } else {
        // Proceed after email is verified (close the dialog or redirect)
        this.closeDialog();
      }
    },
    goToSignIn() {
      this.$router.push({ path: '/sign/signin' });
    },
    closeDialog() {
      this.dialog = false;
      this.$router.push('/');  // Redirect to home page (or root route)
    },
    async signInWithGoogle() {
      const auth = getAuth();
      const googleProvider = new GoogleAuthProvider();

      try {
        // Attempt to sign in with Google
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Split the display name into first and last names
        const [firstName = '', lastName = ''] = user.displayName ? user.displayName.split(' ') : ['', ''];

        // Reference to Firestore database
        const db = getFirestore();
        const userDocRef = doc(db, 'Users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // If the user document doesn't exist, create a new document
          console.log('User document not found, creating new document...');
          await setDoc(userDocRef, {
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            userID: user.uid,  // Save the user ID
            createdAt: new Date(), // Save creation date
            role: 'customer', // Default role
          });
        } else {
          console.log('User document found, no need to create.');
        }

        // Redirect to home page ('/')
        this.$router.push('/');
      } catch (error) {
        // Handle sign-in errors
        this.handleSignInError(error);
      }
    },
    handleSignInError(error) {
      let errorMessage = "Sign-in failed. Please try again.";

      // Customize messages for specific errors
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Sign-in cancelled. Please try again.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network issue. Please check your connection and try again.";
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = "Another sign-in request was made. Please try again.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      alert(errorMessage);
    },
    redirectToSignIn() {
      this.$router.push('/sign/signin');
    },
  },
};
</script>

<style scoped>
.auth-card {
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px; /* Reduced padding for a more compact design */
  max-width: 500px;
  min-height: 50vh; /* Reduced height to 50vh for a smaller card */
  margin: 0 auto;
}

.auth-title {
  margin-bottom: 20px;
  font-size: 32px;
  color: black;
}

.social-btn {
  color: white;
  font-size: 16px;
  border-radius: 24px;
  height: 48px;
}

.fb-btn {
  background-color: #007bff;
}

.google-btn {
  background-color: #db4437;
}

.primary-btn {
  margin-top: -20px;
  font-weight: bold;
  border-radius: 24px;
  height: 48px;
}

.redirect-btn {
  margin-top: -20px;
  color: black;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}

.v-text-field input {
  font-size: 16px;
  padding: 10px;
}

.v-text-field .v-input__prepend-inner {
  color: #333;
}

.v-text-field .v-label {
  font-size: 14px;
}
</style>
