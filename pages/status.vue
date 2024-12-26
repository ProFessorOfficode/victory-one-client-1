<template>
  <v-container>
    <v-card>
      <v-card-title>Order Status</v-card-title>
      <v-data-table :headers="headers" :items="orders" item-value="orderId" class="elevation-1" dense>
        <template #item.actions="{ item }">
          <v-btn small color="primary" @click="viewDetails(item)">
            View Details
          </v-btn>
          <v-btn small color="red" @click="openCancelDialog(item.orderId)" style="color: white;">
            Cancel Order
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="cancelDialogVisible" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Cancel Order</v-card-title>
        <v-card-text>
          Are you sure you want to cancel this order?
          <v-select v-model="cancelReason" :items="cancelReasons" label="Select a reason" hint="Optional"
            persistent-hint class="mt-2"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="cancelDialogVisible = false">No</v-btn>
          <v-btn text color="red" @click="confirmCancelOrder">Yes, Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- Order Details Dialog -->
    <v-dialog v-model="dialogVisible" max-width="600px">
      <v-card>
        <v-card-title>
          Order Details
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Order ID:</strong> {{ selectedOrder.orderId }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="selectedOrder.userFirstName && selectedOrder.userLastName">
              <v-list-item-content>
                <v-list-item-title><strong>Customer Name:</strong> {{ selectedOrder.userFirstName }} {{
                  selectedOrder.userLastName }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Product Name:</strong> {{ selectedOrder.productName }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Estimated Delivery:</strong> {{ selectedOrder.estimatedDeliveryDate
                  }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Payment Method:</strong> {{ selectedOrder.paymentMethod
                  }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Delivery Address:</strong> {{ selectedOrder.deliveryAddress
                  }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Total:</strong> {{ selectedOrder.total }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Status:</strong> {{ selectedOrder.status }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firestore } from "~/plugins/firebase";

export default {
  data() {
    return {
      headers: [
        // { text: "Order ID", value: "orderId" },
        { text: "Product Name", value: "productName" },
        { text: "Total", value: "total" },
        { text: "Estimated Delivery", value: "estimatedDeliveryDate" },
        // { text: "Payment Method", value: "paymentMethod" },
        { text: "Delivery Address", value: "deliveryAddress" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      orders: [],
      dialogVisible: false,
      cancelDialogVisible: false, // To control the cancel confirmation dialog
      selectedOrder: {},
      orderToCancel: null, // Store the ID of the order to be cancelled
      cancelReason: "",  // New property for cancel reason
      cancelReasons: [
        "Changed my mind",
        "Found a better price",
        "Not needed anymore",
        "Other"  // You can add more options as needed
      ]
    };
  },
  methods: {
    openCancelDialog(orderId) {
      this.orderToCancel = orderId; // Set the order ID for cancellation
      this.cancelDialogVisible = true; // Show the confirmation dialog
    },
    async fetchProductName(productID) {
      try {
        const productDoc = await getDoc(doc(firestore, "Products", productID));
        return productDoc.exists() ? productDoc.data().ProductName : "Unknown Product";
      } catch (error) {
        console.error("Error fetching product:", error);
        return "Error";
      }
    },
    async fetchUserDetails(userId) {
      try {
        const userDoc = await getDoc(doc(firestore, "Users", userId));
        return userDoc.exists()
          ? {
            firstName: userDoc.data().firstName || "Unknown",
            lastName: userDoc.data().lastName || "Unknown",
          }
          : { firstName: "Unknown", lastName: "Unknown" };
      } catch (error) {
        console.error("Error fetching user details:", error);
        return { firstName: "Error", lastName: "Error" };
      }
    },
    fetchOrders() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is signed in.");
        return;
      }

      const userId = user.uid;
      const ordersQuery = query(
        collection(firestore, "Orders"),
        where("userId", "==", userId)
      );

      onSnapshot(ordersQuery, async (ordersSnapshot) => {
        const orders = await Promise.all(
          ordersSnapshot.docs.map(async (doc) => {
            const orderData = doc.data();
            const productNames = await Promise.all(
              (orderData.cartItems || []).map(async (item) => {
                return await this.fetchProductName(item.productID);
              })
            );
            const userDetails = await this.fetchUserDetails(orderData.userId);
            return {
              orderId: doc.id,
              productName: productNames.join(", "),
              total: orderData.total || 0,
              estimatedDeliveryDate: orderData.estimatedDeliveryDate || "N/A",
              paymentMethod: orderData.paymentMethod || "N/A",
              deliveryAddress: orderData.deliveryAddress || "N/A",
              status: orderData.status || "Pending",
              userFirstName: userDetails.firstName,
              userLastName: userDetails.lastName,
            };
          })
        );
        // Filter out orders with the status "Cancelled"
        this.orders = orders.filter(order => order.status !== "Cancelled");
      });
    },
    viewDetails(order) {
      this.selectedOrder = order;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    async confirmCancelOrder() {
      if (this.orderToCancel) {
        try {
          // Get a reference to the order in Firestore
          const orderRef = doc(firestore, "Orders", this.orderToCancel);
          // Update the order status to "Cancelled" and add the cancellation reason
          await updateDoc(orderRef, {
            status: "Cancelled",
            cancelReason: this.cancelReason || "No reason provided"  // Save the reason
          });

          console.log(`Order ${this.orderToCancel} has been cancelled for reason: ${this.cancelReason}`);

          // Remove the cancelled order from the orders array
          this.orders = this.orders.filter(order => order.orderId !== this.orderToCancel);

        } catch (error) {
          console.error("Error cancelling order:", error);
        } finally {
          // Hide the dialog and reset the order ID and reason
          this.cancelDialogVisible = false;
          this.orderToCancel = null;
          this.cancelReason = "";  // Clear the reason
        }
      }
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.v-data-table {
  max-width: 100%;
}
</style>
