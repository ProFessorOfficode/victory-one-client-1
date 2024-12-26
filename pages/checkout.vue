<template>
  <div>
    <div class="checkout-container">
      <!-- Left Column (Cart Items) -->
      <div class="checkout-left">
        <h2>Checkout</h2>

        <!-- Cart Items -->
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.image || defaultImage" alt="Product Image" class="cart-item-image" />
          <div class="cart-item-details">
            <p><strong>{{ item.productName }}</strong></p>
            <p class="price">Price: ₱{{ item.price.toFixed(2) }}</p>
            <p>Quantity: {{ item.Quantity }}</p>
            <p class="total">Total: ₱{{ (item.price * item.Quantity).toFixed(2) }}</p>
          </div>
        </div>

        <!-- Delivery Address Section -->
        <div class="delivery-section">
          <h3>Delivery Address</h3>
          <p>{{ selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.province},
            ${selectedAddress.zip}` : 'No address selected' }}</p>
          <button @click="editAddress">Address Options</button>
        </div>

        <div class="cart-details">
          <p><strong style="font-size: 20px;">Arrives by:</strong> {{ estimatedDeliveryDate }}</p>
        </div>

        <!-- Payment Section -->
        <div class="payment-section">
          <h3>Payment</h3>
          <p v-if="selectedPaymentMethod">{{ selectedPaymentMethod.method }}</p>
          <p v-else>No Payment Method Selected</p>
          
          <button @click="showPaymentModal = true">Payment Options</button>
        </div>
      </div>

      <!-- Right Column (Order Summary) -->
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="summary-item">
          <p>Subtotal:</p>
          <p>₱{{ subtotal.toFixed(2) }}</p>
        </div>
        <div class="summary-item">
          <p>Shipping Fee:</p>
          <p>₱{{ tax.toFixed(2) }}</p>
        </div>
        <hr />
        <div class="total-item">
          <p><strong>Total</strong></p>
          <p><strong>₱{{ total.toFixed(2) }}</strong></p>
        </div>
        <!-- Add this spinner right before the checkout button -->
        <div v-if="loading" class="loading-overlay">
          <div class="spinner"></div>
        </div>
        <button class="checkout-button" @click="placeOrder" :disabled="loading">
          <span v-if="loading">Processing...</span>
          <span v-else>Place Your Order</span>
        </button>
        <button class="back-to-cart-button" @click="goBackToCart">Back to Cart</button>
      </div>
    </div>

    <!-- Modal for Address Selection -->
    <div v-if="showAddressModal" class="address-modal">
      <div class="modal-content">
        <h3>Select a Delivery Address</h3>
        <div v-for="(address, index) in addresses" :key="index" class="address-item">
          <input type="radio" :id="'address' + index" v-model="selectedAddress" :value="address" />
          <label :for="'address' + index" class="address-label">
            {{ address.street }}, {{ address.city }}, {{ address.province }}, {{ address.zip }}
          </label>
          <button class="set-default-button" @click="setDefaultAddress(address.id)"
            :disabled="address.id === defaultAddress?.id">
            {{ address.id === defaultAddress?.id ? "Default" : "Set as Default" }}
          </button>
          <button v-if="address.id === defaultAddress?.id" class="remove-default-button"
            @click="unsetDefaultAddress(address.id)">
            Remove Default
          </button>
        </div>

        <!-- New Address Form -->
        <div class="new-address">
          <h4>Add a New Address</h4>
          <input type="text" v-model="newAddress.street" placeholder="Street Address" class="address-input" />
          <input type="text" v-model="newAddress.city" placeholder="City" class="address-input" />
          <input type="text" v-model="newAddress.province" placeholder="Province" class="address-input" />
          <input type="text" v-model="newAddress.zip" placeholder="Zip Code" class="address-input" />
          <button @click="saveAddress" class="save-button">Save Address</button>
        </div>

        <!-- Action Buttons -->
        <button class="use-button" @click="useAddress">Use Address</button>
        <!-- Move the delete button below the use address button -->
        <button v-if="selectedAddress" @click="deleteAddress(selectedAddress.id)" class="delete-button">Delete</button>
        <button class="close-button" @click="closeAddressModal">Close</button>
      </div>
    </div>

    <!-- Modal for Payment Options -->
    <div v-if="showPaymentModal" class="payment-modal">
      <div class="modal-content">
        <h3>Payment Methods</h3>

        <!-- Default Payment Methods -->
        <div v-for="method in paymentMethods" :key="method.id" class="payment-item">
          <input type="radio" :id="'method' + method.id" v-model="selectedPaymentMethod" :value="method"
            class="payment-checkbox" />
          <label :for="'method' + method.id">{{ method.method }}</label>
        </div>

        <!-- 'Others' Header for Additional Methods -->
        <h4>Others:</h4>
        <div v-for="method in otherPaymentMethods" :key="method.id" class="payment-item">
          <input type="radio" :id="'method' + method.id" v-model="selectedPaymentMethod" :value="method"
            class="payment-checkbox" />
          <label :for="'method' + method.id">{{ method.method }}</label>
        </div>

        <button @click="usePaymentMethod" class="use-button">Use</button>
        <button @click="closePaymentModal" class="close-button">Close</button>
      </div>
    </div>

  </div>
</template>

<script>
import { firestore } from '~/plugins/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  data() {
    return {
      loading: false,  // Track the loading state
      cartItems: [],
      deliveryAddress: ' ',
      subtotal: 0,
      tax: 0,
      total: 0,
      estimatedDeliveryDate: '',
      defaultImage: 'https://via.placeholder.com/60',
      selectedAddress: null,
      showAddressModal: false,
      newAddress: {
        province: '', city: '', street: '', zip: ''
      },
      defaultAddress: null,
      addresses: [],
      selectedPaymentMethod: null,  // Track the selected payment method
      showPaymentModal: false, // Track whether the payment modal is open
      paymentMethods: [], // Store available payment methods
      otherPaymentMethods: [], // Store "Others" payment methods (e.g., "Pick up")
      authInitialized: false, // Track user authentication state
    };
  },
  created() {
    this.loadCartItems();
    this.estimatedDeliveryDate = this.calculateEstimatedDeliveryDate();
    this.loadAddresses();
    this.loadPaymentMethods();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.authInitialized = true;
      } else {
        this.authInitialized = false;
      }
    });
  },
  methods: {
    async loadCartItems() {
      const items = JSON.parse(this.$route.query.items || '[]');
      this.cartItems = items;
      this.calculateTotals();
    },
    calculateTotals() {
      this.subtotal = this.cartItems.reduce((total, item) => total + (item.price * item.Quantity), 0);
      this.tax = this.subtotal * 0.1;
      this.total = this.subtotal + this.tax;
    },
    calculateEstimatedDeliveryDate() {
      const estimatedDate = new Date();
      estimatedDate.setDate(new Date().getDate() + 3);
      return estimatedDate.toDateString();
    },
    async loadAddresses() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const addressesRef = collection(firestore, 'Address');
        const querySnapshot = await getDocs(addressesRef);
        this.addresses = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(address => address.userID === userId);

        // Check for the default address
        this.defaultAddress = this.addresses.find(address => address.isDefault);
        if (this.defaultAddress) {
          this.selectedAddress = this.defaultAddress;
        }
      } else {
        console.error("User not authenticated.");
      }
    },
    async setDefaultAddress(addressId) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;

        // Unset current default address if it exists
        if (this.defaultAddress) {
          const currentDefaultRef = doc(firestore, 'Address', this.defaultAddress.id);
          await updateDoc(currentDefaultRef, { isDefault: false });
        }

        // Set the selected address as default
        const newDefaultRef = doc(firestore, 'Address', addressId);
        await updateDoc(newDefaultRef, { isDefault: true });

        // Reload addresses to reflect changes
        this.loadAddresses();
      } else {
        console.error("User not authenticated.");
      }
    },
    async unsetDefaultAddress(addressId) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user && this.defaultAddress?.id === addressId) {
        try {
          const addressRef = doc(firestore, 'Address', addressId);
          await updateDoc(addressRef, { isDefault: false });
          this.defaultAddress = null; // Clear the current default address
          this.selectedAddress = null; // Reset the selected address if needed
          this.loadAddresses(); // Refresh the address list
        } catch (error) {
          console.error('Error unsetting default address:', error);
        }
      }
    },
    // Load all payment methods from Firestore, without filtering by user
    async loadPaymentMethods() {
      const paymentRef = collection(firestore, 'Payments');
      const querySnapshot = await getDocs(paymentRef);
      const allPaymentMethods = querySnapshot.docs.map(doc => doc.data());

      // Separate "Pick up" or other custom methods
      this.paymentMethods = allPaymentMethods.filter(method => method.method !== 'Pick up');
      this.otherPaymentMethods = allPaymentMethods.filter(method => method.method === 'Pick up');
    },
    // Use the selected payment method globally
    usePaymentMethod() {
      if (this.selectedPaymentMethod) {
        this.closePaymentModal(); // Close the modal after selection
      } else {
        alert('Please select a payment method first.');
      }
    },

    closePaymentModal() {
      this.showPaymentModal = false;
    },
    editAddress() {
      this.showAddressModal = true;
    },
    async saveAddress() {
      const auth = getAuth();
      const userId = auth.currentUser.uid;

      const newAddressData = {
        userID: userId,
        province: this.newAddress.province.trim(),
        city: this.newAddress.city.trim(),
        street: this.newAddress.street.trim(),
        zip: this.newAddress.zip.trim(),
        isDefault: false, // New addresses are not default by default
      };

      const docRef = await addDoc(collection(firestore, 'Address'), newAddressData);
      this.selectedAddress = { id: docRef.id, ...newAddressData };
      this.loadAddresses();
      this.closeAddressModal();
    },
    async deleteAddress(addressId) {
      await deleteDoc(doc(firestore, 'Address', addressId));
      this.loadAddresses(); // Refresh the list after deletion
    },
    closeAddressModal() {
      this.showAddressModal = false;
      this.newAddress = { province: '', city: '', street: '', zip: '' }; // Reset form fields
    },
    useAddress() {
      this.selectedAddress = this.addresses.find(address => address.id === this.selectedAddress.id);
      this.closeAddressModal();
    },
    async placeOrder() {
      if (!this.authInitialized) {
        console.error("User authentication is not initialized.");
        return;
      }

      if (!this.selectedAddress) {
        alert('Please select a delivery address before placing your order.');
        return; // Stop execution if no address is selected
      }

      if (!this.selectedPaymentMethod) {
        alert('Please select a payment method before placing your order.');
        return; // Stop execution if no payment method is selected
      }

      this.loading = true; // Set loading to true to show the spinner

      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const orderData = {
            userId: userId,
            cartItems: this.cartItems,
            deliveryAddress: `${this.selectedAddress.province}, ${this.selectedAddress.city}, ${this.selectedAddress.street}, ${this.selectedAddress.zip}`,
            subtotal: this.subtotal,
            tax: this.tax,
            total: this.total,
            paymentMethod: this.selectedPaymentMethod.method, // Include the payment method in the order data
            estimatedDeliveryDate: this.estimatedDeliveryDate,
            status: 'Pending',
            createdAt: new Date(),
          };
          // Simulate network delay
          setTimeout(() => {
            // Navigate to the Order Confirmation page, passing orderData in query params
            this.$router.push({ name: 'orderConfirmation', query: { orderData: JSON.stringify(orderData) } });
            this.loading = false; // Set loading to false after the order is placed
          }, 2000); // Delay for 2 seconds to simulate network delay
        } else {
          console.error("User not authenticated.");
        }
      } catch (error) {
        console.error("Error placing order:", error);
        this.loading = false; // Set loading to false if there is an error
      }
    },
    goBackToCart() {
      this.$router.push({ name: 'cart' });
    },
  },
};
</script>

<style scoped>
/* Add this to your scoped CSS */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ff6f00;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.checkout-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.checkout-left,
.order-summary {
  flex: 1 1 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  align-items: center;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}

.cart-item-details {
  flex: 1;
}

.cart-details,
.delivery-section,
.payment-section {
  margin-bottom: 20px;
}

h2,
h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

button {
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #f4f4f4;
}

.checkout-button {
  background-color: #ff6f00;
  color: white;
  font-weight: bold;
  margin-bottom: 10px;
}

.checkout-button:hover {
  background-color: #ffa900;
}

button.back-to-cart-button {
  background-color: #f4f4f4;
  color: #ff6f00;
  font-weight: bold;
}

/* Modal Styling */
.address-modal,
.payment-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

/* Media Queries for Responsive Design */
@media (min-width: 768px) {
  .checkout-container {
    flex-wrap: nowrap;
  }

  .checkout-left {
    flex: 0 0 65%;
  }

  .order-summary {
    flex: 0 0 30%;
    margin-top: 0;
  }

  .cart-item-image {
    width: 120px;
    height: 120px;
  }

  h2,
  h3 {
    font-size: 24px;
  }
}

@media (min-width: 1024px) {
  .modal-content {
    width: 400px;
  }
}

.remove-default-button {
  margin-left: 10px;
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-default-button:hover {
  background-color: #cc0000;
}

.set-default-button {
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.set-default-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.delete-button {
  margin-top: 10px;
  background-color: #ff6f00;
  color: white;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #ffa900;
}

.new-address input,
.address-item button {
  margin-bottom: 10px;
}

.new-address input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.close-button {
  background-color: #f5f5f5;
  padding: 8px;
  margin-top: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #eaeaea;
}

.use-button {
  background-color: #ff6f00;
  color: white;
  padding: 8px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.address-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.address-label {
  flex: 1;
  margin-left: 10px;
  font-size: 14px;
  color: #333;
}

.new-address h4 {
  font-size: 16px;
  margin-bottom: 10px;
}

.address-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.save-button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  width: 100%;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #0056b3;
}

.use-button,
.close-button {
  background-color: #ff6f00;
  color: white;
  padding: 10px;
  width: 100%;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.use-button:hover,
.close-button:hover {
  background-color: #ffa900;
}
</style>