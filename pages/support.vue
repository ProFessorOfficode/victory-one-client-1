<template>
  <v-container>
    <!-- Header Section -->
    <v-row justify="center" class="text-center">
      <v-col cols="12" class="mb-5">
        <h1 class="headline">We're here to help</h1>
      </v-col>
    </v-row>

    <!-- 6 Grid Layout with v-cards -->
    <v-row>
      <v-col cols="12" md="4" v-for="card in filteredCards" :key="card.id">
        <v-card 
          class="pa-6 elevation-3 custom-card hoverable-card" 
          @click="goToPage(card)"  
        >
          <v-card-title class="d-flex align-center justify-center">
            <v-icon left class="custom-icon">{{ card.icon }}</v-icon>
            <span class="text-title">{{ card.title }}</span>
          </v-card-title>
          <v-card-text class="text-center" style="color: black;">{{ card.content }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      cards: [
        { id: 1, title: 'FAQs', content: 'Find answers to frequently asked questions.', icon: 'mdi-help-circle' },
        { id: 2, title: 'Contact Us', content: 'Get in touch with our support team.', icon: 'mdi-phone' },
        { id: 3, title: 'Privacy Policy', content: 'Understand how we handle your data.', icon: 'mdi-lock' },
      ],
    };
  },
  computed: {
    filteredCards() {
      const searchTerm = this.search.toLowerCase();
      return this.cards.filter(card => 
        card.title.toLowerCase().includes(searchTerm) || 
        card.content.toLowerCase().includes(searchTerm)
      );
    },
  },
  methods: {
    goToPage(card) {
      // Redirect based on card title
      if (card.title === 'FAQs') {
        this.$router.push('/chatbot');
      }
      else if (card.title === 'Contact Us') {
        this.$router.push('/contactus');
      }
      else if (card.title === 'Privacy Policy') {
        this.$router.push('/privacy');
      }
    },
  }
};
</script>

<style scoped>
.headline {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
  position: relative;
  color: #333; /* Dark text color for the headline */
}

.headline::after {
  content: '';
  display: block;
  width: 10%;
  height: 3px;
  background: linear-gradient(90deg, #ffa900, #ff5500);
  margin: 10px auto 0;
}

/* Custom Search Bar */
.search-bar {
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 20px;
}

.custom-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 250px; /* Set height for consistency */
  color: black; /* Text color */
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hoverable-card:hover {
  transform: scale(1.05); /* Card scaling effect */
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
}

.custom-icon {
  color: #ffa900; /* Icon color */
  font-size: 36px; /* Larger icon */
}

.text-title {
  font-weight: 500;
  font-size: 1.1rem;
  margin-left: 10px;
  color: #333; /* Title text color */
}

.text-center {
  color: #555; /* Card text color */
  font-size: 1rem;
  margin-top: 10px;
}

.v-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .headline {
    font-size: 1.5rem; /* Adjust headline for mobile */
  }

  .custom-card {
    height: 220px; /* Adjust card height for smaller screens */
  }

  .custom-icon {
    font-size: 32px; /* Adjust icon size for smaller screens */
  }

  .text-title {
    font-size: 1rem; /* Adjust title size */
  }
}
</style>
