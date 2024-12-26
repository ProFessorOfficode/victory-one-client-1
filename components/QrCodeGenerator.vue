<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="6">
                <v-card class="pa-4">
                    <!-- Existing QR Code Generator Section -->
                    <v-select v-model="selectedProduct" :items="products" item-text="name" item-value="id"
                        label="Select Product" outlined @change="onProductSelect"></v-select>
                    <v-text-field v-model="productInfo" label="Enter Product Information" outlined
                        class="mt-4"></v-text-field>
                    <v-btn color="primary" class="mt-4" @click="generateQrCode">
                        Generate QR Code
                    </v-btn>
                    <div class="mt-4 text-center">
                        <canvas v-show="qrCodeGenerated" ref="qrCanvas"></canvas>
                    </div>

                    <!-- New QR Code Scanner Section -->
                    <div class="mt-4">
                        <v-text-field
                            v-model="scannedData"
                            label="Scanned Data"
                            readonly
                            class="mt-4"
                            @input="handleScannerInput" 
                        ></v-text-field>
                    </div>
                </v-card>

                <!-- Snackbar for Notifications -->
                <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3000">
                    {{ snackbar.message }}
                </v-snackbar>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import QRCode from 'qrcode';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '~/plugins/firebase'; // Import Firestore instance

export default {
    data() {
        return {
            products: [], // List of products
            selectedProduct: null, // Selected product ID
            productInfo: '', // QR code content
            qrCodeGenerated: false,
            scannedData: '', // Scanned QR code data
            snackbar: {
                visible: false,
                message: '',
                color: 'success', // success, error, etc.
            },
        };
    },
    async created() {
        try {
            // Fetch product data from Firestore
            const productSnapshot = await getDocs(collection(firestore, 'Products'));
            this.products = productSnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().ProductName,
                details: JSON.stringify({
                    id: doc.id,
                    name: doc.data().ProductName,
                    price: doc.data().Price,
                }),
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    },
    methods: {
        onProductSelect() {
            const selected = this.products.find(product => product.id === this.selectedProduct);
            this.productInfo = selected ? selected.details : '';
        },
        async generateQrCode() {
            if (!this.productInfo) {
                this.showSnackbar('Please enter product information.', 'error');
                return;
            }

            try {
                const canvas = this.$refs.qrCanvas;
                await QRCode.toCanvas(canvas, this.productInfo, {
                    width: 200,  // Increased width for better readability
                    margin: 4,   // Increase margin for clearer edges
                });
                this.qrCodeGenerated = true;
                this.showSnackbar('QR Code generated successfully!', 'success');
            } catch (error) {
                console.error('Error generating QR code:', error);
                this.showSnackbar('Failed to generate QR code.', 'error');
            }
        },
        // Handle barcode scanner input
        handleScannerInput(event) {
            const scannedValue = event.target.value.trim(); // Remove extra spaces or newlines

            // Log the scanner input to the console
            console.log('Scanner is scanning... Scanned Value: ', scannedValue);

            // Update scannedData with the scanned value
            if (scannedValue && scannedValue !== this.scannedData) {
                this.scannedData = scannedValue;
                this.showSnackbar('Data scanned successfully!', 'success');
            }
        },
        showSnackbar(message, color) {
            this.snackbar.message = message;
            this.snackbar.color = color;
            this.snackbar.visible = true;
        },
    },
};
</script>
