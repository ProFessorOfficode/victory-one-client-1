<template>
    <div class="checkout-container">
      <h1>Continue to checkout</h1>
      <div class="checkout-forms">
        <!-- Returning Customer Form -->
        <div class="checkout-box">
          <h2>Returning customer</h2>
          <p>Lovely, welcome back! Sign in for faster checkout.</p>
  
          <!-- Sign in with Google Button -->
          <button @click="signInWithGoogle" class="google-btn full-width">
            <v-icon left class="icon-white">mdi-google</v-icon> <!-- Google Icon -->
            Sign in with Google
          </button>
          <!-- Sign in with Facebook Button -->
          <button class="facebook-btn full-width" disabled>
            <v-icon left class="icon-white">mdi-facebook</v-icon> <!-- Facebook Icon -->
            Sign in with Facebook
          </button>
  
          <form @submit.prevent="login">
            <label for="email">Email *</label>
            <input type="email" v-model="email" class="full-width" required />
  
            <label for="password">Password *</label>
            <input
              type="password"
              v-model="password"
              class="full-width"
              required
            />
  
            <div class="extra-options">
              <label>
                <input type="checkbox" v-model="rememberMe" />
                Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
  
            <button type="submit" class="primary-btn full-width">CONTINUE TO CHECKOUT</button>
          </form>
        </div>
  
        <!-- New Customer Box -->
        <div class="checkout-box new-customer">
          <h2 class="align-left">New customer</h2>
          <p class="align-left">Become a member today - it’s fast & free!</p>
          <ul class="benefits-list">
            <li><span class="checkmark">✔</span> 10% off your first purchase</li>
            <li><span class="checkmark">✔</span> Flexible payment options</li>
            <li><span class="checkmark">✔</span> Free online returns</li>
          </ul>
          <button @click="navigateToLogin" class="outline-btn full-width">SIGN UP NOW</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        rememberMe: false,
      };
    },
    methods: {
      async login() {
        const auth = getAuth();
        try {
          // Log in with Firebase
          await signInWithEmailAndPassword(auth, this.email, this.password);
          console.log("Logged in successfully");
          this.$router.push('/checkout'); // Example route to redirect after login
        } catch (error) {
          console.error("Login error:", error.message);
          alert("Login failed: " + error.message); // Notify user of the error
        }
      },
      async signInWithGoogle() {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
          const result = await signInWithPopup(auth, provider);
          // The signed-in user info
          const user = result.user;
          console.log("Logged in with Google:", user);
          // Redirect to another page or perform other actions after successful login
          this.$router.push('/checkout'); // Example route to redirect after login
        } catch (error) {
          console.error("Google login error:", error.message);
          alert("Google login failed: " + error.message); // Notify user of the error
        }
      },
      navigateToLogin() {
        // Navigate to signup page
        this.$router.push('/sign/before');
      }
    },
  };
  </script>
  
  <style scoped>
  .checkout-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .checkout-container h1 {
    margin-bottom: 40px; /* Increased spacing */
  }
  
  .checkout-forms {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .checkout-box {
    background: #f7f7f7;
    padding: 20px;
    flex: 1;
    min-width: 300px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .checkout-box h2 {
    font-size: 1.5em;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  input[type="email"],
  input[type="password"],
  .primary-btn,
  .outline-btn,
  .google-btn,
  .facebook-btn {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .full-width {
    width: 100%;
  }
  
  .primary-btn {
    background-color: black;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .outline-btn {
    background-color: white;
    color: black;
    border: 1px solid black;
    cursor: pointer;
  }
  
  .google-btn {
    background-color: #db4437; /* Google red */
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 10px; /* Spacing above */
    display: flex;
    justify-content: center; /* Center text horizontally */
    align-items: center; /* Center icon and text vertically */
  }
  
  .facebook-btn {
    background-color: #4267B2; /* Facebook blue */
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 10px; /* Spacing above */
    margin-bottom: 20px;
    cursor: not-allowed; /* Not implemented */
    display: flex;
    justify-content: center; /* Center text horizontally */
    align-items: center; /* Center icon and text vertically */
  }
  
  .icon-white {
    color: white; /* Set icon color to white */
  }
  
  .extra-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
  
  .benefits-list {
    list-style: none;
    padding: 0;
    text-align: left;
    margin: 25px 0; /* Adjusted margin to move contents down */
  }
  
  .benefits-list li {
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .checkmark {
    color: green;
    font-weight: bold;
    margin-right: 8px;
  }
  
  /* New Styles */
  .align-left {
    text-align: left;
  }
  
  .new-customer p {
    margin-bottom: 15px;
  }
  </style>