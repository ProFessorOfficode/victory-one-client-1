<template>
  <v-app dark>
    <v-app-bar v-if="showNavbar" app fixed elevate height="80px">
      <!-- Menu Icon for Small Screens -->
      <v-btn icon @click="drawer = !drawer" aria-label="Navigation Menu" v-if="$vuetify.breakpoint.xsOnly">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!-- Logo for Small Screens -->
      <v-toolbar-title class="logo-title">
        <img src="@/assets/logo 3.png" alt="Victory One Logo" />
      </v-toolbar-title>

      <!-- Spacer for Layout -->
      <v-spacer></v-spacer>

      <!-- Navigation Buttons for Larger Screens -->
      <v-btn text :class="{ 'clicked': isHomeActive }" @click="goHome" v-if="!$vuetify.breakpoint.xsOnly">
        HOME
      </v-btn>

      <v-btn text :class="{ 'clicked': isAboutUsActive }" to="/aboutus" v-if="!$vuetify.breakpoint.xsOnly">
        ABOUT US
      </v-btn>

      <v-btn text :class="{ 'clicked': isContactUsActive }" to="/contactus" v-if="!$vuetify.breakpoint.xsOnly">
        CONTACT US
      </v-btn>

      <!-- Categories Menu for Larger Screens -->
      <v-menu offset-y v-if="!$vuetify.breakpoint.xsOnly">
        <template #activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            CATEGORIES <v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item v-for="(category, index) in categories" :key="index">
            <v-btn text @click="selectCategory(category)" class="category-button" style="width: 100%;">
              {{ category }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-spacer></v-spacer>

      <v-btn icon @click="handleCartClick">
        <v-icon>mdi-cart-outline</v-icon>
        <v-badge v-if="cartItemCount > 0" color="red" :content="cartItemCount" overlap style="margin-bottom: 20px;">
        </v-badge>
      </v-btn>

      <!-- Profile Menu -->
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-avatar size="32" v-bind="attrs" v-on="on">
            <img
              :src="userProfilePic || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg'"
              alt="User">
          </v-avatar>
        </template>

        <v-list>
          <v-list-item @click="ProfilePage">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-list-item @click="openLogoutConfirmation" :disabled="!isUserLoggedIn">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-dialog v-model="logoutDialog" max-width="400">
      <v-card>
        <v-card-title>Logout</v-card-title>
        <v-card-text>Are you sure you want to log out?</v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="logoutDialog = false">Cancel</v-btn>
          <v-btn text color="red" @click="logout">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="loginPromptDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Login Required</v-card-title>
        <v-card-text>
          To access your profile, please log in first.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="background-color: #FFA900; color: white" @click="proceedToLogin">Log In</v-btn>
          <v-btn text @click="loginPromptDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Drawer for Smaller Screens -->
    <v-navigation-drawer v-model="drawer" app temporary style="background-color: #333;">
      <v-list>
        <v-list-item @click="goHome">
          <v-icon class="white-icon mr-2">mdi-home</v-icon>
          <v-list-item-title class="white-text">HOME</v-list-item-title>
        </v-list-item>
        <v-list-item @click="goToPage('aboutus')">
          <v-icon class="white-icon mr-2">mdi-information-outline</v-icon>
          <v-list-item-title class="white-text">ABOUT US</v-list-item-title>
        </v-list-item>
        <v-list-item @click="goToPage('contactus')">
          <v-icon class="white-icon mr-2">mdi-phone</v-icon>
          <v-list-item-title class="white-text">CONTACT US</v-list-item-title>
        </v-list-item>
        <v-subheader class="white-text">CATEGORIES</v-subheader>
        <v-list-item v-for="(category, index) in categories" :key="index" @click="selectCategory(category)">
          <v-icon class="white-icon mr-2">mdi-tag-outline</v-icon>
          <v-list-item-title class="white-text">{{ category }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-dialog v-model="loginPromptDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Login Required</v-card-title>
        <v-card-text>
          To access your cart, please log in first.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="background-color: #FFA900; color: white" @click="proceedToLogin">Log In</v-btn>
          <v-btn text @click="loginPromptDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Fullscreen Carousel -->
    <v-carousel v-if="showCarousel" height="50vh" hide-delimiter-background :cycle="true">
      <v-carousel-item v-for="(image, index) in images" :key="index">
        <v-img :src="image" class="fill-height">
          <v-container fluid class="d-flex align-center justify-center" style="height: 100%;">
            <v-row>
              <v-col class="text-center">
                <h2 class="carousel-text">{{ carouselTitles[index] }}</h2>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </v-carousel-item>
    </v-carousel>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer class="footer" height="auto" v-if="showFooter">
      <v-container>
        <v-row>
          <!-- Stay Connected Section -->
          <v-col cols="12" md="4">
            <h3>Stay Connected</h3>
            <v-text-field label="Email Address" solo></v-text-field>
            <v-btn block style="margin-top: -20px; background-color: #FFA900; color: white;">SEND</v-btn>
            <div class="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <v-icon small>mdi-facebook</v-icon>
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <v-icon small>mdi-twitter</v-icon>
              </a>
              <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                <v-icon small>mdi-google-plus</v-icon>
              </a>
            </div>
          </v-col>

          <!-- Commitment Section -->
          <v-col cols="12" md="4">
            <h3>Victory One</h3>
            <p>We are proud to serve the community with dedication and care, ensuring a positive impact for future
              generations.</p>
          </v-col>

          <!-- Sitemap & Privacy Section -->
          <v-col cols="12" md="4">
            <h3 class="h3-1">Navigate</h3>
            <v-list style="background-color: #333;">
              <v-list-item>
                <v-btn text class="white-text" to="/">Home</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn text class="white-text" to="/aboutus">About us</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn text class="white-text" to="/contactus">Contact us</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn text class="white-text" to="/cart">My cart</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn text class="white-text" to="/privacy">Privacy Policy</v-btn>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-center">
            <v-divider></v-divider>
            <p>&copy; 2024 Victory One. All rights reserved.</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { firestore } from '~/plugins/firebase';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export default {
  name: 'DefaultLayout',
  data() {
    return {
      loginPromptDialog: false, // Controls the login prompt dialog
      categories: ['Category 1', 'Category 2', 'Category 3'],
      drawer: false,
      logoutDialog: false,
      images: [
        require('@/assets/carousel 3.jpg'),
        require('@/assets/carousel 1.jpeg'),
        require('@/assets/carousel 2.jpg'),
      ],
      carouselTitles: ['ALUMINUM', 'FRAMES', 'GLASS'],
      cartItemCount: 0,
      isUserLoggedIn: false,
      userProfilePic: '',
      userID: '',
    };
  },
  computed: {
    showNavbar() {
      return !['/sign/signin', '/sign/signup', '/sign/before', 'orderConfirmationSuccess'].includes(this.$route.path);
    },
    showFooter() {
      return ['/', '/aboutus', '/contactus', '/profile', '/cart', '/privacy', '/rating', '/support', '/gallery'].includes(this.$route.path);
    },
    showCarousel() {
      return ['/', '/gallery'].includes(this.$route.path);
    },
    showMenuIcon() {
      return ['/admin'].includes(this.$route.path);
    },
    isHomeActive() {
      return this.$route.path === '/';
    },
    isAboutUsActive() {
      return this.$route.path === '/aboutus';
    },
    isContactUsActive() {
      return this.$route.path === '/contactus';
    },
  },
  methods: {
    handleCartClick() {
      if (!this.isUserLoggedIn) {
        this.loginPromptDialog = true; // Show the login dialog
      } else {
        this.$router.push('/cart'); // If logged in, redirect to the cart
      }
    },
    async fetchUserProfilePicture(userID) {
      try {
        const userRef = collection(firestore, 'Users');
        const userQuery = query(userRef, where('userID', '==', userID));

        // Attach a real-time listener
        onSnapshot(userQuery, (querySnapshot) => {
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            this.userProfilePic = userDoc.data().profilePicture || ''; // Update profile picture
          } else {
            console.warn("User document not found.");
            this.userProfilePic = ''; // Default to no profile picture
          }
        });
      } catch (error) {
        console.error("Error fetching user profile picture:", error);
        this.userProfilePic = ''; // Fallback in case of an error
      }
    },
    goToPage(page) {
      this.$router.push(`/${page}`);
    },
    openCategories() {
      // Show categories or open a menu
    },
    goHome() {
      this.$router.push('/');
    },
    ProfilePage() {
      if (this.isUserLoggedIn) {
        this.$router.push('/profile');
      } else {
        this.loginPromptDialog = true; // Show the dialog if the user is not logged in
      }
    },
    proceedToLogin() {
      this.loginPromptDialog = false; // Close the login prompt dialog
      this.$router.push('/sign/signin'); // Redirect to the sign-in page
    },
    async getCategories() {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'Categories'));
        this.categories = querySnapshot.docs.map(doc => doc.data().ProductType); // Fetch the "ProductType" field
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    selectCategory(category) {
      this.$router.push({ path: '/gallery', query: { category } });
    },
    openLogoutConfirmation() {
      this.logoutDialog = true;
    },
    logout() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.isUserLoggedIn = false;
          this.userID = '';
          this.$router.push('/');
          this.logoutDialog = false;
        })
        .catch((error) => {
          console.error("Logout failed:", error.message);
          this.$toast.error("Failed to log out. Please try again.");
        });
    },
    checkUserAuth() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.isUserLoggedIn = true;
          this.userID = user.uid;
          if (user.providerData[0].providerId === 'google.com') {
            this.userProfilePic = user.photoURL; // Use the Google profile picture
          } else {
            await this.fetchUserProfilePicture(user.uid); // Fetch profile picture from the Firestore Users collection
          }
          this.getCartItems(); // Fetch cart items if user is logged in

        } else {
          this.isUserLoggedIn = false;
          this.userID = '';
          this.userProfilePic = ''; // Reset profile picture when logged out
          this.getCartItemsFromLocalStorage(); // Get cart items from localStorage if user is not logged in
        }
      });
    },
    getCartItems() {
      if (!this.isUserLoggedIn) return; // Only proceed if the user is logged in

      const cartRef = collection(firestore, 'Cart');
      const cartQuery = query(cartRef, where('userID', '==', this.userID));

      // Real-time listener for cart items
      onSnapshot(cartQuery, (querySnapshot) => {
        this.cartItemCount = querySnapshot.size; // Update cart item count dynamically
      });
    },
    getCartItemsFromLocalStorage() {
      if (process.client) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.cartItemCount = cartItems.length; // Update cart count from localStorage
      }
    },
  },
  created() {
    this.getCategories();
    this.checkUserAuth();
  },
};
</script>

<style scoped>
.white-text {
  color: white;
}

.v-navigation-drawer {
  color: white;
  /* Text color inside drawer */
}

.v-list-item-title {
  color: white !important;
  /* Ensure titles are visible */
}

.logo-title img {
  height: 80px;
  /* Default size */
}

@media (max-width: 600px) {
  .logo-title img {
    height: 50px;
    /* Adjust for mobile */
  }
}

.footer {
  background-color: #333;
  color: #fff;
  padding: 20px 0;
}

.social-icons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.v-icon {
  color: white;
  /* Default color */
  transition: color 0.3s ease;
  /* Smooth transition for color change */
}

.social-icons a:hover .v-icon {
  color: #FFA900;
  /* Color change on hover */
}

.clicked {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.carousel-text {
  font-size: 36px;
  font-family: 'Sequel Sans', sans-serif;
  text-align: center;
  position: relative;
  color: white;
}

.carousel-text::after {
  content: '';
  display: block;
  width: 50px;
  height: 4px;
  background-color: #FFA900;
  margin: 0 auto;
  margin-top: 10px;
}
</style>
