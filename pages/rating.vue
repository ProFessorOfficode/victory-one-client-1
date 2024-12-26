<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-text class="text-center">
            <h2 style="font-weight: bold; color: black;">Rate Your Experience</h2>
            <p>We value your feedback! Please rate your experience and provide any comments below:</p>
            <v-rating
              v-model="rating"
              background-color="black"
              color="yellow darken-2"
              large
              empty-icon="mdi-star-outline"
              full-icon="mdi-star"
            ></v-rating>
            <v-form @submit.prevent="submitFeedback">
              <v-textarea
                v-model="feedback"
                label="Your Feedback"
                rows="4"
                outlined
                class="mt-4"
              ></v-textarea>
              <v-text-field
                v-model="email"
                label="Your Email (optional)"
                outlined
                class="mt-4"
              ></v-text-field>
              <v-btn class="mt-4" type="submit" style="background-color: #ffa900; color: white;" block>Submit</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar for showing messages -->
    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { firestore } from "~/plugins/firebase";
import { getDoc, doc, collection, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      rating: 0,
      feedback: '',
      email: '',
      orderId: null,
      cartItems: [],
      productNames: [],
      snackbarVisible: false,
      snackbarMessage: '',
      snackbarColor: 'success', // Set default color to 'success'
    };
  },
  mounted() {
    this.orderId = this.$route.query.orderId;
    console.log("Order ID:", this.orderId);
    if (this.orderId) {
      this.fetchOrderDetails();
    }
  },
  methods: {
    async fetchOrderDetails() {
      try {
        const orderDoc = await getDoc(doc(firestore, "Orders", this.orderId));
        if (orderDoc.exists()) {
          const orderData = orderDoc.data();
          this.cartItems = orderData.cartItems || [];
          this.productNames = await Promise.all(
            this.cartItems.map(async (item) => {
              const productDoc = await getDoc(doc(firestore, "Products", item.productID));
              return productDoc.exists() ? productDoc.data().ProductName : "Unknown Product";
            })
          );
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    },
    async submitFeedback() {
      if (this.rating < 1 || this.rating > 5) {
        this.showSnackbar("Please select a valid rating between 1 and 5.", "error");
        return;
      }

      try {
        const user = getAuth().currentUser;
        if (user) {
          const ratingData = {
            userId: user.uid,
            productName: this.productNames.join(", "), // Join all product names for a collective rating
            ratings: this.rating,
            ratingDescription: this.feedback || "No comments",
          };

          // Add the rating to the Ratings collection
          await setDoc(doc(collection(firestore, "Ratings"), `${user.uid}-${this.orderId}`), ratingData);
          this.resetForm();
          this.showSnackbar("Thank you for your feedback!", "success");
        } else {
          this.showSnackbar("You must be logged in to submit a rating.", "error");
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        this.showSnackbar("Something went wrong. Please try again.", "error");
      }
    },
    resetForm() {
      this.rating = 0;
      this.feedback = '';
      this.email = '';
    },
    showSnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbarVisible = true;
    },
  },
};
</script>

<style scoped>
.v-card {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  margin-bottom: 5px;
}

.v-rating {
  margin-bottom: 16px;
}
</style>
