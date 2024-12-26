<template>
  <v-container>
    <!-- Breadcrumbs with Router Links -->
    <v-breadcrumbs class="mt-4">
      <v-breadcrumbs-item>
        <v-btn text class="breadcrumb-btn" to="/">
          Home
        </v-btn>
      </v-breadcrumbs-item>
      <v-breadcrumbs-item>
        <v-btn text class="breadcrumb-btn" to="/gallery">
          Products
        </v-btn>
      </v-breadcrumbs-item>
      <v-breadcrumbs-item>
        <v-btn text class="breadcrumb-btn" to="/aboutus">
          About Us
        </v-btn>
      </v-breadcrumbs-item>
      <v-breadcrumbs-item>
        <v-btn text class="breadcrumb-btn" to="/contactus">
          Contact Us
        </v-btn>
      </v-breadcrumbs-item>
    </v-breadcrumbs>

    <!-- Product Section -->
    <v-row v-if="product" class="mt-2 product-section">
      <!-- Product Image -->
      <v-col cols="12" md="6">
        <v-img :src="product.Image" height="400px" contain></v-img>
      </v-col>

      <!-- Product Details -->
      <v-col cols="12" md="6">
        <v-card flat class="pa-0 d-flex flex-column justify-space-between">
          <div>
            <!-- Product Name and Rating -->
            <v-row class="align-center mb-2">
              <v-col class="d-flex align-center" style="margin-bottom: -55px;">
                <v-card-title class="text-h5 font-weight-bold">{{ product.ProductName }}</v-card-title>
                <v-icon style="font-size: 26px;" color="yellow darken-3" class="ml-2">mdi-star</v-icon>
                <span style="color: black; font-weight: bold;">{{ averageRating }} ({{ totalReviews }} ratings)</span>
              </v-col>
            </v-row>

            <!-- Sold Details -->
            <v-row>
              <v-col>
                <v-card-subtitle class="text-subtitle-1">Sold: {{ soldQuantity }} </v-card-subtitle>
              </v-col>
            </v-row>

            <!-- Product Price and Description -->
            <v-card-subtitle class="text-h6 text--primary">₱{{ product.Price }}</v-card-subtitle>
            <v-card-text class="mt-1">{{ product.ProductDescription }}</v-card-text>

            <!-- Aluminum Size Options -->
            <v-card-title class="mt-4">Available Aluminum Sizes</v-card-title>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Size</th>
                  <th class="text-left">Thickness (mm)</th>
                  <th class="text-left">Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(size, index) in aluminumSizes" :key="index">
                  <td>{{ size.size }}</td>
                  <td>{{ size.thickness }}</td>
                  <td>{{ size.weight }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </div>

          <!-- Quantity and Add to Cart -->
          <div class="mt-4">
            <v-row class="align-center justify-start">
              <!-- Quantity Input -->
              <v-col cols="3" class="d-flex align-center">
                <v-text-field v-model.number="quantity" type="number" min="1" :max="stockQuantity"
                  class="mx-2 quantity-input" @input="validateQuantity" hide-details outlined dense
                  label="Quantity"></v-text-field>
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <!-- Add to Cart Button -->
              <v-col cols="12" class="d-flex">
                <v-btn @click="addToCart(product, quantity)" block large color="black" class="add-to-cart-btn">
                  Add to Cart
                </v-btn>
              </v-col>
              <!-- Back to Products Button -->
              <v-col cols="12" class="d-flex">
                <v-btn @click="goToProducts" outlined block large class="back-btn">
                  Back to Products
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error Handling -->
    <v-row v-else>
      <v-col cols="12">
        <v-alert type="error" border="left" colored-border>
          Product not found.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Customer Reviews Section -->
    <v-container class="mt-8">
      <v-row>
        <v-col cols="12">
          <h3 class="text-h6 font-weight-bold" style="margin-bottom: 20px;">Customer Rates</h3>
          <div class="review-summary">
            <div class="rating" style="margin-bottom: 20px;">
              <v-icon color="yellow darken-3">mdi-star</v-icon>
              <span class="font-weight-bold">{{ averageRating }} out of 5</span>
            </div>
            <div class="progress-bars">
              <v-row v-for="(rating, index) in ratingsData" :key="index" class="align-center">
                <v-col cols="1">
                  <span class="star-label" style="color: black;">{{ rating.stars }} Star</span>
                </v-col>
                <v-col cols="8">
                  <v-progress-linear :value="rating.percentage" height="8" color="yellow darken-3"
                    class="my-1 progress-bar-custom"></v-progress-linear>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row v-for="(review, index) in reviews" :key="index" class="review-card">
        <h3 class="text-h6 font-weight-bold" style="margin-bottom: 20px;">Customer Reviews</h3>
        <v-col cols="12" class="d-flex">
          <v-avatar size="40" class="mr-2">
            <v-img :src="review.avatar" />
          </v-avatar>
          <div>
            <div class="review-header d-flex align-center">
              <span class="font-weight-bold">{{ review.name }}</span>
              <v-icon color="yellow darken-3" class="ml-2">mdi-star</v-icon>
              <span class="ml-1">{{ review.rating }}</span>
            </div>
            <p class="review-content">{{ review.comment }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { auth } from '~/plugins/firebase';
import { firestore } from '~/plugins/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, } from 'firebase/firestore';

export default {
  data() {
    return {
      product: null,
      quantity: 1,
      stockQuantity: 0,
      soldQuantity: 0,
      smallImages: [
        require('@/assets/carousel 3.jpg'),
        require('@/assets/carousel 3.jpg'),
        require('@/assets/carousel 3.jpg'),
      ],
      aluminumSizes: [
        { size: "4x8", thickness: 3, weight: 25 },
        { size: "4x10", thickness: 4, weight: 30 },
        { size: "5x10", thickness: 5, weight: 35 },
      ],
      reviews: [
        {

        }
      ],
      ratingsData: [
        { stars: 5, percentage: 10 },
        { stars: 4, percentage: 10 },
        { stars: 3, percentage: 10 },
        { stars: 2, percentage: 10 },
        { stars: 1, percentage: 10 }
      ],
      averageRating: 0, // Initialize averageRating to 0
      cartCount: 0 // Initialize the cart count
    };
  },
  async created() {
    const productId = this.$route.params.id; // Get the product ID from the route parameters
    try {
      const productDoc = doc(firestore, 'Products', productId); // Reference to the specific product document
      const productSnapshot = await getDoc(productDoc); // Get the document snapshot

      if (productSnapshot.exists()) {
        // Store the product data and ensure you include the ID
        this.product = {
          id: productSnapshot.id, // Add the document ID
          ...productSnapshot.data() // Spread the other product fields
        };
        this.fetchProductReviews(productId); // Fetch reviews for the product
        this.stockQuantity = this.product.Stock; // Assuming Stock is a field in your document
        await this.fetchSoldQuantity(productId);
      } else {
        console.log('Product not found.'); // Handle case where product does not exist
      }
    } catch (error) {
      console.error('Error fetching product:', error); // Log any errors during fetching
    }
  },
  methods: {
    async fetchSoldQuantity(productId) {
      try {
        const ordersQuery = query(collection(firestore, 'Orders'));
        const ordersSnapshot = await getDocs(ordersQuery);

        let totalSold = 0;

        ordersSnapshot.forEach((doc) => {
          const orderData = doc.data();
          if (orderData.cartItems) {
            // Check if product exists in cartItems
            orderData.cartItems.forEach((item) => {
              if (item.productID === productId) {
                totalSold += item.Quantity; // Add the quantity of the product
              }
            });
          }
        });

        this.soldQuantity = totalSold; // Update the soldQuantity property
      } catch (error) {
        console.error('Error fetching sold quantity:', error);
      }
    },
    async fetchProductReviews(productId) {
      try {
        const ratingsQuery = query(
          collection(firestore, 'Ratings'),
          where('productName', '==', this.product.ProductName)
        );
        const ratingsSnapshot = await getDocs(ratingsQuery);
        const allRatings = [];
        let totalRatingSum = 0;

        for (const ratingDoc of ratingsSnapshot.docs) {
          const ratingData = ratingDoc.data();

          // Fetch user details from the Users collection
          let userName = 'Anonymous'; // Default name if user data isn't found
          let avatar = require('@/assets/avatar 1.jpg');

          if (ratingData.userId) {
            const userDoc = await getDoc(doc(firestore, 'Users', ratingData.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              userName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
              avatar = userData.avatar || avatar; // Use user's avatar if available
            }
          }

          // Add rating details with user information
          allRatings.push({
            name: userName,
            avatar: avatar,
            rating: ratingData.ratings,
            comment: ratingData.ratingDescription,
          });

          totalRatingSum += ratingData.ratings;
        }

        this.reviews = allRatings;
        this.totalReviews = allRatings.length;

        // Calculate average rating
        this.averageRating = this.totalReviews > 0 ? (totalRatingSum / this.totalReviews).toFixed(1) : 0;

        // Populate the ratings distribution data
        this.calculateRatingsDistribution(allRatings);
      } catch (error) {
        console.error('Error fetching product reviews:', error);
      }
    },
    calculateRatingsDistribution(ratings) {
      const ratingCounts = [0, 0, 0, 0, 0]; // Array to hold counts for 1 to 5 stars

      // Count each rating
      ratings.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          ratingCounts[review.rating - 1]++;
        }
      });

      const totalReviews = ratings.length;

      // Generate percentage data for each star rating (1 to 5 stars)
      this.ratingsData = ratingCounts.map((count, index) => ({
        stars: index + 1, // Star value is the index + 1 (e.g., 1-star for index 0)
        percentage: totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(1) : '0.0',
      }));
    },
    validateQuantity() {
      if (this.quantity > this.stockQuantity) {
        this.quantity = this.stockQuantity; // Reset to max stock quantity if exceeded
      }
    },
    async addToCart(product, quantity) {
      try {
        const user = auth.currentUser; // Get the current logged-in user

        if (!user) {
          // Redirect to sign-in page if the user is not authenticated
          this.$router.push('/sign/signin');
          return;
        }

        // Proceed if the user is authenticated
        const cartRef = collection(firestore, 'Cart'); // Reference to the Cart collection

        // Create a query to check if the product already exists in the user's cart
        const productQuery = query(
          cartRef,
          where('userID', '==', user.uid),
          where('ProductID', '==', product.id)
        );

        const querySnapshot = await getDocs(productQuery); // Get query snapshot

        if (querySnapshot.empty) {
          // If no existing product, add the product to the cart
          await addDoc(cartRef, {
            userID: user.uid, // Add user ID
            ProductID: product.id, // Add Product ID       
            Quantity: quantity, // Add Quantity      
          });

          console.log('Product added to cart:', product.ProductName); // Log success message
        } else {
          // If the product already exists in the cart, update the quantity
          const cartDoc = querySnapshot.docs[0]; // Get the first matching document
          const updatedQuantity = cartDoc.data().Quantity + quantity; // Update the quantity

          await updateDoc(cartDoc.ref, {
            Quantity: updatedQuantity, // Update the quantity field
          });

          console.log('Cart updated with new quantity:', updatedQuantity); // Log success message
        }

        // Update the cart count
        this.cartCount += quantity;
      } catch (error) {
        console.error('Error adding or updating product in cart:', error); // Log any errors during adding or updating
      }
    },
    goToProducts() {
      this.$router.push('/gallery'); // Navigate back to products page
    },
    goToRating() {
      this.$router.push('/rating'); // Navigate to the rating page
    },
    totalReviews() {

    }
  }
};
</script>

<style scoped>
.product-section {
  padding: 20px;
}

.hoverable-image {
  cursor: pointer;
  transition: transform 0.2s;
}

.hoverable-image:hover {
  transform: scale(1.05);
}

.add-to-cart-btn {
  background-color: #ff8f00;
  /* Custom color for Add to Cart button */
  color: white;
  margin-bottom: -10px;
}

.back-btn {
  color: black;
  border: 2px solid black;
}

.review-card {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.rate-products-btn {
  background-color: #ff8f00;
  /* Custom color for Rate Products button */
  color: white;
}
</style>
