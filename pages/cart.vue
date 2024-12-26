<template>
  <v-container>
    <!-- Cart Header -->
    <v-row>
      <v-col cols="12" class="text-center">
        <h2 class="cart-title">Your Cart ({{ cartItems.length }} items)</h2>
      </v-col>
    </v-row>

    <!-- Cart Table -->
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-2">
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Select</th> <!-- Added Select header -->
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cartItems" :key="item.id">
                  <td class="checkbox-align">
                    <v-checkbox v-model="item.selected" class="small-checkbox" hide-details small></v-checkbox>
                  </td>
                  <td>
                    <div class="item-details">
                      <v-img :src="item.image || 'default-image-url.jpg'" class="cart-item-image" />
                      <div class="item-info">
                        <strong>{{ item.productName }}</strong><br />
                        <span>{{ item.description }}</span>
                      </div>
                    </div>
                  </td>
                  <td>₱{{ item.price.toFixed(2) }}</td>
                  <td>
                    <div class="quantity-control">
                      <v-btn small class="decri" @click="decrementQuantity(item)"
                        :disabled="item.Quantity === 1">-</v-btn>
                      <span>{{ item.Quantity }}</span>
                      <v-btn small @click="incrementQuantity(item)">+</v-btn>
                    </div>
                  </td>
                  <td>₱{{ (item.price * item.Quantity).toFixed(2) }}</td>
                  <td>
                    <v-btn @click="removeFromCart(item.id)" icon>
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Summary Section -->
    <v-row>
      <v-col cols="12" md="6" class="text-right ml-auto">
        <v-card class="summary-card">
          <v-card-text>
            <div class="summary-item">
              <span>Subtotal:</span>
              <span>₱{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-item">
              <span>Sales Tax:</span>
              <span>₱{{ tax.toFixed(2) }}</span>
            </div>
            <hr />
            <div class="summary-total">
              <span>Total:</span>
              <span>₱{{ grandTotal.toFixed(2) }}</span>
            </div>
            <div class="summary-shipping">
              <p v-if="subtotal >= 1000">Congrats, you're eligible for Free Shipping!</p>
            </div>
            <v-btn @click="proceedToCheckout" block class="checkout-btn" style="color: white; background-color: #ffa900"
              :disabled="!cartItems.some(item => item.selected) || isLoading">
              <v-progress-circular v-if="isLoading" indeterminate color="white" size="24" width="4" class="mr-2" />
              Check out
            </v-btn>

            <!-- Clear Cart Button -->
            <v-btn @click="clearCart" block class="clear-cart-btn" style="background-color: red; color: white;">
              Clear Cart
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth } from '~/plugins/firebase';
import { firestore } from '~/plugins/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, where, onSnapshot } from 'firebase/firestore';

export default {
  data() {
    return {
      isLoading: false,  // Loading state
      cartItems: [], // Array to hold cart items
    };
  },
  computed: {
    subtotal() {
      return this.cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + (item.price * item.Quantity), 0);
    },
    tax() {
      return this.subtotal * 0.1; // Assuming 10% sales tax
    },
    grandTotal() {
      return this.subtotal + this.tax;
    },
  },
  async created() {
    // Wait for Firebase authentication state to be initialized
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // If no user is logged in, redirect to the sign-in page
        this.$router.push({ path: '/sign/signin' });
      } else {
        // If a user is logged in, fetch cart items
        await this.fetchCartItems();
      }
    });
  },
  methods: {
    async fetchCartItems() {
      const user = auth.currentUser; // Get the current user
      if (!user) {
        // If user is not logged in, redirect to sign-in page
        this.$router.push({ path: '/sign/signin' });
        return;
      }

      // Fetch the cart items for the logged-in user in real-time
      const cartRef = collection(firestore, 'Cart');
      const productsRef = collection(firestore, 'Products');

      const productsSnapshot = await getDocs(productsRef); // This will fetch products once
      const products = {};
      productsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        products[doc.id] = {
          name: data.ProductName,
          price: Number(data.Price),
          image: data.Image,
          description: data.Description || '',
        };
      });

      // Real-time listener for cart items
      this.cartItemsUnsub = onSnapshot(
        cartRef,
        (cartSnapshot) => {
          const groupedItems = {};

          cartSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            const productID = data.ProductID;

            // Only add items if they are not confirmed orders
            if (data.orderStatus !== 'Confirmed' && data.userID === user.uid) {
              if (!groupedItems[productID]) {
                groupedItems[productID] = {
                  id: doc.id,
                  productID: productID,
                  productName: products[productID]?.name || 'Unknown Product',
                  price: Number(products[productID]?.price) || 0,
                  image: products[productID]?.image || null,
                  description: products[productID]?.description || '',
                  Quantity: data.Quantity,
                  selected: false,
                };
              } else {
                groupedItems[productID].Quantity += data.Quantity;
              }
            }
          });

          // Update the cart items in real-time
          this.cartItems = Object.values(groupedItems);
        },
        (error) => {
          console.error('Error listening to cart items:', error);
        }
      );
    },
    async incrementQuantity(item) {
      const newQuantity = item.Quantity + 1;
      await this.updateCartItemQuantity(item.id, newQuantity);
    },
    async decrementQuantity(item) {
      if (item.Quantity > 1) {
        const newQuantity = item.Quantity - 1;
        await this.updateCartItemQuantity(item.id, newQuantity);
      } else {
        await this.removeFromCart(item.id);
      }
    },
    async updateCartItemQuantity(itemId, quantity) {
      const docRef = doc(firestore, 'Cart', itemId);
      await updateDoc(docRef, { Quantity: quantity });
      this.cartItems = this.cartItems.map((item) => (item.id === itemId ? { ...item, Quantity: quantity } : item));
    },
    async proceedToCheckout() {
      const selectedItems = this.cartItems.filter(item => item.selected);

      if (selectedItems.length === 0) {
        // Alert if no items are selected
        alert("Please select at least one item to proceed to checkout.");
        return; // Prevent checkout if no items are selected
      }

      const user = auth.currentUser;
      if (!user) {
        // Redirect to sign-in if the user is not logged in
        this.$router.push({ path: '/sign/signin' });
      } else {
        this.isLoading = true;  // Set loading state to true before routing

        // Simulate a delay or make API calls here if needed
        setTimeout(() => {
          // After the loading is finished, navigate to checkout page
          this.$router.push({ path: '/checkout', query: { items: JSON.stringify(selectedItems) } });
          this.isLoading = false;  // Reset loading state
        }, 2000);  // Adjust the timeout as per your needs
      }
    },
    async removeFromCart(itemId) {
      const docRef = doc(firestore, 'Cart', itemId);
      await deleteDoc(docRef);
      this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    },
    async clearCart() {
      const cartSnapshot = await getDocs(collection(firestore, 'Cart'));
      const deletePromises = cartSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      this.cartItems = [];
    },
  },
};
</script>

<style scoped>
.v-simple-table th,
.v-simple-table td {
  text-align: left;
  padding: 16px;
  border-bottom: 1px solid #ddd;
  /* Add border between rows */
}

.v-simple-table tbody tr {
  margin-bottom: 10px;
  /* Space between rows */
}

.item-details {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  /* Space between item details */
}

.cart-item-image {
  height: 100px;
  /* Increase size */
  width: 100px;
  /* Increase size */
  object-fit: cover;
  /* Keep images cropped to fit the box */
  border-radius: 8px;
  margin-right: 16px;
  max-width: 100px;
  /* Ensures images don't stretch beyond this */
  max-height: 100px;
  /* Ensures images don't stretch beyond this */
}

.cart-title {
  color: #ffa900;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.summary-card {
  padding: 20px;
  border-radius: 8px;
  margin-top: 10px;
  /* Add space above the summary */
}

.summary-item,
.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}

.summary-total {
  font-weight: bold;
  font-size: 20px;
  margin-top: 10px;
  color: #333;
}

.checkout-btn {
  background-color: #ffa900;
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
}

.remove-selected-btn,
.clear-cart-btn {
  background-color: red;
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
