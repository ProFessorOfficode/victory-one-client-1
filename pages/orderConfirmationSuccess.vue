<template>
    <div class="success-container">
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order is being processed and will be delivered soon.</p>

        <div class="button-container">
            <button @click="redirectHome" class="shop-again-button">Shop Again</button>
            <button @click="redirectOrder" class="close-button">See Your Order</button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        redirectHome() {
            this.$router.push('/');
        },
        redirectOrder() {
            this.$router.push('/status');
        }
    }
};
</script>

<style scoped>
.success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
}

h2 {
    color: #28a745;
    margin-bottom: 15px;
}

p {
    color: #555;
    margin-bottom: 25px;
}

.button-container {
    display: flex;
    gap: 20px;
}

button {
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-size: 16px;
}

.shop-again-button {
    background-color: #007bff;
    color: white;
}

.shop-again-button:hover {
    background-color: #0056b3;
}

.close-button {
    background-color: #6c757d;
    color: white;
}

.close-button:hover {
    background-color: #5a6268;
}
</style>