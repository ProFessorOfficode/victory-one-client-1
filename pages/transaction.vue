<template>
  <v-container>
    <v-card>
      <v-card-title>
        My Previous Transactions
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          class="ml-2"
        ></v-progress-circular>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="transactions"
        item-value="orderId"
        class="elevation-1"
        dense
      >
        <template #item.actions="{ item }">
          <v-btn small color="primary" @click="rateProduct(item)">
            Rate Product
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firestore } from "~/plugins/firebase";

export default {
  data() {
    return {
      headers: [
        { text: "Order ID", value: "orderId" },
        { text: "Product Name", value: "productName" },
        { text: "Total", value: "total" },
        { text: "Payment Method", value: "paymentMethod" },
        { text: "Delivery Address", value: "deliveryAddress" },
        { text: "Delivery Date", value: "deliveryDate" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      transactions: [],
      loading: false, // Track loading state
      unsubscribe: null, // Store the Firestore listener unsubscribe function
    };
  },
  methods: {
    async fetchProductName(productID) {
      try {
        const productDoc = await getDoc(doc(firestore, "Products", productID));
        return productDoc.exists() ? productDoc.data().ProductName : "Unknown Product";
      } catch (error) {
        console.error("Error fetching product:", error);
        return "Error";
      }
    },
    startListening(userId) {
      if (this.unsubscribe) {
        this.unsubscribe(); // Unsubscribe from any previous listener
      }

      const transactionsQuery = query(
        collection(firestore, "Orders"),
        where("userId", "==", userId),
        where("status", "==", "Completed")
      );

      this.loading = true; // Start loading
      this.unsubscribe = onSnapshot(
        transactionsQuery,
        async (snapshot) => {
          const transactions = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();
              const productNames = await Promise.all(
                (data.cartItems || []).map((item) => this.fetchProductName(item.productID))
              );
              return {
                orderId: doc.id,
                productName: productNames.join(", "),
                total: data.total || 0,
                paymentMethod: data.paymentMethod || "N/A",
                deliveryAddress: data.deliveryAddress || "N/A",
                deliveryDate: data.estimatedDeliveryDate || "N/A",
                status: data.status || "Pending",
              };
            })
          );
          this.transactions = transactions;
          this.loading = false; // Stop loading
        },
        (error) => {
          console.error("Error fetching transactions:", error);
          this.loading = false; // Stop loading on error
        }
      );
    },
    rateProduct(transaction) {
      // Navigate to the /rating page and pass the orderId as a query parameter
      this.$router.push({ path: '/rating', query: { orderId: transaction.orderId } });
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.startListening(user.uid);
      } else {
        this.transactions = [];
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      }
    });
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe(); // Clean up the Firestore listener on component destruction
    }
  },
};
</script>

<style scoped>
.v-data-table {
  max-width: 100%;
}
</style>
