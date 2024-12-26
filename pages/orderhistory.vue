<template>
    <div class="order-history-container">
      <h1>Order History</h1>

      <div class="search-orders">
        <input type="text" placeholder="Search by Order Number, Brand, or Name" v-model="searchQuery" />
        <button @click="searchOrders">Search Orders</button>
      </div>
      
      <div v-for="order in filteredOrders" :key="order.orderNumber" class="order-item">
        <div class="order-header">
          <div class="order-info">
            <p><strong>Order Date:</strong> {{ order.date }}</p>
            <p><strong>Order Number:</strong> <a href="#">{{ order.orderNumber }}</a></p>
          </div>
          <div class="order-total">
            <p><strong>Total:</strong> {{ order.total }}</p>
          </div>
        </div>
        
        <div class="order-details">
          <img :src="order.image" alt="Item Image" class="item-image" />
          <div class="item-info">
            <p><strong>{{ order.itemName }}</strong></p>
            <p><strong>Size:</strong> {{ order.size }}</p>
            <p><strong>Price:</strong> {{ order.price }}</p>
          </div>
          <div class="order-actions">
            <button class="write-review">Write a Review</button>
            <p><strong>Status:</strong> <span class="delivery-status">{{ order.status }}</span></p>
          </div>
        </div>
      </div>
      <!-- Back to Checkout button -->
      <div class="checkout-button-container">
        <button class="back-to-checkout" @click="goToCheckout">Back to Checkout</button>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      orders: [
        {
          date: 'Oct 19, 2024 at 12:54 PM',
          orderNumber: '112-5302826-1706627',
          total: '₱70.95',
          itemName: 'Glass Sheets',
          size: '8.5',
          price: '₱70.95',
          image: require('@/assets/carousel 2.jpg'),
          status: 'Delivered',
        },
      ],
    };
  },
  computed: {
    filteredOrders() {
      if (!this.searchQuery) {
        return this.orders;
      }
      return this.orders.filter((order) =>
        order.orderNumber.includes(this.searchQuery) ||
        order.itemName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    searchOrders() {
      // Search logic handled in the computed property
    },
    goToCheckout() {
      this.$router.push('/checkout'); // Navigate to checkout page
    },
  },
};
</script>

<style scoped>
.order-history-container {
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}

.search-orders {
  display: flex;
  margin-bottom: 20px;
}

.search-orders input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

.search-orders button {
  padding: 8px 16px;
  background-color: #ffa900;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.checkout-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.back-to-checkout {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.order-item {
  border: 1px solid #e5e5e5;
  margin-bottom: 20px;
  border-radius: 5px;
  padding: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.order-details {
  display: flex;
}

.item-image {
  width: 150px;
  height: 150px;
  margin-right: 20px;
}

.item-info {
  flex: 1;
}

.order-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.write-review {
  padding: 10px 16px;
  background-color: #ffa900;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 50px;
  margin-bottom: 10px;
}

.delivery-status {
  color: green;
}
</style>