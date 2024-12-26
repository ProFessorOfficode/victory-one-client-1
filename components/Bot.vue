<template>
  <v-container class="chat-container pa-4" style="max-width: 420px;">
    <!-- Header Title Section (Centered) -->
    <v-row justify="center">
      <v-col cols="12" class="title-btn text-center">
        <h3 class="chat-header">Ask Questions or Concerns</h3>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <!-- Chat Box Section -->
        <div class="chat-box" style="height: 320px; overflow-y: auto; padding: 20px; background: #f9f9f9; border-radius: 15px;">
          <div v-for="(message, index) in messages" :key="index" class="mb-3">
            <div v-if="message.type === 'bot'" class="bot-message">
              <v-chip class="message-bubble bot-bubble" color="primary" dark>{{ message.text }}</v-chip>
            </div>
            <div v-else class="user-message">
              <v-chip class="message-bubble user-bubble" color="teal" dark>{{ message.text }}</v-chip>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Dropdown for Categories -->
      <v-col cols="12" class="title-btn text-center">
        <h4 class="category-label">Choose a Question Category</h4>
      </v-col>

      <v-col cols="12" class="mt-4">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          item-text="name"
          item-value="name"
          label="Select Category"
          return-object
          @change="handleCategoryChange"
          outlined
          dense
          class="category-select"
        ></v-select>
      </v-col>

      <!-- Dropdown for Questions -->
      <v-col cols="12" class="mt-4">
        <v-select
          v-model="selectedQuestion"
          :items="filteredQuestions"
          item-text="text"
          item-value="text"
          label="Select Question"
          return-object
          @change="handleQuestionClick"
          outlined
          dense
          class="question-select"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      messages: [
        { type: "bot", text: "Hi! How can I help you today?" },
      ],
      selectedCategory: null,
      selectedQuestion: null,
      categories: [
        { name: "General", questions: [
          { text: "What are your services?", response: "We provide ordering services!" },
          { text: "Where are you located?", response: "We are located in San Matias, San Fernando, Pampanga." },
          { text: "How do I track my order?", response: "You can track your order in your Profile then there's a list saying 'My Order' section." },
        ] },
        { name: "Policies", questions: [
          { text: "What payment methods do you accept?", response: "We accept Gcash, Cash On Delivery, and Pickup." },
          { text: "Can I cancel my order?", response: "Orders can be canceled within 24 hours of purchase. Please go to your Profile then find the 'My Order' section and cancel the order." },
        ] },
        { name: "Shipping", questions: [
          { text: "Do you ship internationally?", response: "No, we don’t offer international shipping to select countries." },
          { text: "Do you offer free shipping?", response: "Yes, we offer free shipping on orders over ₱1000." },
        ] },
      ],
      filteredQuestions: [],
    };
  },
  methods: {
    handleCategoryChange() {
      // Update filtered questions based on the selected category
      if (this.selectedCategory) {
        this.filteredQuestions = this.selectedCategory.questions;
      } else {
        this.filteredQuestions = [];
      }
    },
    handleQuestionClick(question) {
      // Add the user's question to the chat
      this.messages.push({ type: "user", text: question.text });
      // Add the bot's response to the chat
      this.messages.push({ type: "bot", text: question.response });
      // Scroll to the bottom of the chat
      this.$nextTick(() => {
        const chatBox = this.$el.querySelector(".chat-box");
        chatBox.scrollTop = chatBox.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.chat-container {
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 20px;
}

.chat-box {
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 20px;
}

.message-bubble {
  padding: 12px 16px;
  font-size: 14px;
  max-width: 80%;
  border-radius: 20px;
  word-wrap: break-word;
}

.bot-bubble {
  background-color: #4CAF50;
}

.user-bubble {
  background-color: #008CBA;
}

.user-message {
  text-align: right; /* Align user messages to the right */
}

.v-select {
  width: 100%;
}

.v-btn.question-btn {
  font-weight: 600;
  border-radius: 20px;
  font-size: 14px;
  text-transform: none;
  padding: 10px 15px;
}

.v-btn:focus {
  box-shadow: none;
}

.title-btn h3 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #2C3E50;
}

.category-label {
  font-size: 20px;
  font-weight: 600;
  color: #2C3E50;
}

h4 {
  font-size: 18px;
  font-weight: 600;
}

.category-select,
.question-select {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.v-select .v-select__slot {
  padding: 8px 12px;
}

.v-select .v-input__control {
  padding: 4px 8px;
}

.v-select .v-select__selections {
  color: #34495E;
}

.v-select .v-label {
  font-size: 14px;
  color: #34495E;
}

.v-select .v-select__menu {
  border-radius: 8px;
}
</style>
