<template>
  <v-container>
    <v-row class="mt-5">
      <v-col v-for="(card, index) in cards" :key="index" cols="12" md="6" lg="3">
        <v-card class="card-item position-relative">
          <v-avatar class="user-icon" size="80" :class="card.bgColor">
            <v-icon class="white-icon">{{ card.icon }}</v-icon>
          </v-avatar>
          <v-card-title class="card-title underline">{{ card.title }}</v-card-title>
          <v-card-text class="card-text">
            <p class="card-description">{{ card.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card flat color="transparent">
          <v-row>
            <v-col cols="12" md="6">
              <v-card-title>
                <h1 class="contact-header">Contact Us</h1>
              </v-card-title>
              <v-card-text>
                <p class="contact-description">
                  We are here to help you with any questions or concerns you may have. Our team is committed to providing you with the best service and support. Please use the contact details below to get in touch with us or fill out the form on this page for more specific inquiries. We look forward to hearing from you!
                </p>
                <v-divider class="contact-divider"></v-divider>
                <p class="additional-description">
                  Don't hesitate to reach out through social media for quick updates and news about our services!
                </p>
              </v-card-text>
              <v-row class="social-media-icons">
                <v-col v-for="(icon, index) in socialMedia" :key="index" class="text-center" cols="3">
                  <v-btn icon :href="icon.link" target="_blank">
                    <v-icon style="color: #ffa900;">{{ icon.icon }}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="form-card">
                <v-card-title>
                  <h2 class="form-header">Get in Touch</h2>
                </v-card-title>
                <v-card-text>
                  <p class="form-description">
                    We value your feedback and are here to assist you with any questions or concerns. Please fill out the form below, and we will get back to you as soon as possible. For immediate assistance, feel free to reach out to us using the contact details provided above.
                  </p>
                  <v-form ref="contactForm">
                    <v-text-field v-model="form.name" label="Name" outlined required></v-text-field>
                    <v-text-field v-model="form.email" label="Email" type="email" outlined required></v-text-field>
                    <v-text-field v-model="form.address" label="Address" outlined required></v-text-field>
                    <v-textarea v-model="form.message" label="Message" rows="4" outlined required></v-textarea>
                    <v-btn block @click="submitForm" style="background-color: #ffa900; color: white;">Send</v-btn>
                    <v-btn block @click="resetForm" style="background-color: red; color: white; margin-top: 10px" >Reset</v-btn> <!-- Reset button -->
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        address: '',
        message: ''
      },
      cards: [
        { title: 'Contacts', description: 'Charlhet Victory', icon: 'mdi-account', bgColor: 'bg-blue' },
        { title: 'Email Us', description: 'CharlhetVictory@gmail.com', icon: 'mdi-email', bgColor: 'bg-green' },
        { title: 'Call Us', description: '09162299879', icon: 'mdi-phone', bgColor: 'bg-red' },
        { title: 'Address', description: 'San Matias, San Fernando, Pampanga', icon: 'mdi-map', bgColor: 'bg-yellow' }
      ],
      socialMedia: [
        { icon: 'mdi-facebook', link: 'https://facebook.com' },
        { icon: 'mdi-twitter', link: 'https://twitter.com' },
        { icon: 'mdi-instagram', link: 'https://instagram.com' },
      ]
    };
  },
  methods: {
    submitForm() {
      alert('Form submitted!');
      // You can add logic here to send the form data
    },
    resetForm() {
      this.form.name = '';
      this.form.email = '';
      this.form.address = '';
      this.form.message = '';
      // Reset form fields to empty
    }
  }
};
</script>

<style scoped>
.v-card {
  padding: 16px;
  max-width: 990px;
  margin: 0 auto;
}

h1.contact-header {
  text-align: center;
  font-size: 32px;
  margin: 20px 0 10px;
}

h2.form-header {
  font-size: 32px;
  margin-bottom: 20px;
}

.v-card-text {
  padding: 16px;
}

.v-card-title {
  font-weight: bold;
}

.underline {
  border-bottom: 2px solid #ffa900; /* Underline color */
  display: inline-block; /* To adjust the underline position */
  padding-bottom: 4px; /* Space between title text and underline */
}

.contact-description,
.form-description {
  font-size: 16px;
  margin-bottom: 20px;
  color: black;
}

.additional-description {
  font-size: 16px;
  margin: 20px 0;
  color: black;
}

.v-text-field,
.v-textarea {
  margin-bottom: -20px;
  max-width: 100%;
}

.contact-divider {
  margin: 20px 0;
}

.card-item {
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* Aligns items in the card */
  margin-top: 20px;
  height: 200px; /* Set a fixed height for the cards */
}

.user-icon {
  position: absolute;
  top: -40px;
  left: calc(50% - 40px);
  z-index: 1;
  border: 3px solid #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.white-icon {
  color: #ffffff;
}

.bg-blue {
  background: #007bff;
}

.bg-green {
  background: #28a745;
}

.bg-red {
  background: #dc3545;
}

.bg-yellow {
  background: #ffc107;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 30px;
  text-align: center;
}

.card-text {
  text-align: center;
  color: black;
  margin-top: 10px;
}

.card-description {
  color: black;
  font-size: 18px;
  margin-top: auto; /* Push the description to the bottom of the card */
}

.form-card {
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.social-media-icons {
  justify-content: center;
  margin-top: -30px;
  margin-left: -30px;
}

.social-media-icons .v-btn {
  margin: 0 5px;
}
</style>