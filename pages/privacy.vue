<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" class="mb-6">
        <v-card class="elevation-2 rounded-lg">
          <v-card-title class="headline text-center py-4">Privacy Policy</v-card-title>
          <v-divider class="white-divider"></v-divider>
          <v-card-text class="pa-4">
            <h3 class="subtitle">Introduction</h3>
            <p>
              Welcome to Victory One! Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
            </p>

            <h3 class="subtitle">Information We Collect</h3>
            <ul class="list-style">
              <li>Your name</li>
              <li>Email address</li>
              <li>Shipping address</li>
              <li>Payment information</li>
            </ul>

            <h3 class="subtitle">How We Use Your Information</h3>
            <p>
              We use your information to process your orders, communicate with you, improve our services, and personalize your experience.
            </p>

            <h3 class="subtitle">Data Protection</h3>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>

            <h3 class="subtitle">User Rights</h3>
            <p>
              You have the right to access, correct, or delete your personal information. You can exercise these rights by contacting us.
            </p>

            <h3 class="subtitle">Cookies</h3>
            <p>
              Our website uses cookies to enhance user experience. You can choose to accept or decline cookies.
            </p>

            <h3 class="subtitle">Contact Us</h3>
            <p>
              If you have any questions about this privacy policy, please contact us at <a href="mailto:support@victoryone.com" class="link">support@victoryone.com</a>.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="elevation-2 rounded-lg">
          <v-card-title class="headline text-center py-4">Terms of Service</v-card-title>
          <v-divider class="white-divider"></v-divider>
          <v-card-text class="pa-4">
            <h3 class="subtitle">Introduction</h3>
            <p>
              Welcome to Victory One! By accessing our website, you agree to comply with and be bound by the following terms and conditions.
            </p>

            <h3 class="subtitle">Use of the Site</h3>
            <p>
              You may use our site for lawful purposes only. You are responsible for ensuring that your use of the site complies with all applicable laws.
            </p>

            <h3 class="subtitle">Product Descriptions</h3>
            <p>
              We strive to provide accurate product descriptions. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.
            </p>

            <h3 class="subtitle">Limitation of Liability</h3>
            <p>
              Victory One shall not be liable for any indirect, incidental, or consequential damages arising from the use of our site or products.
            </p>

            <h3 class="subtitle">Contact Us</h3>
            <p>
              For any questions regarding these terms, please contact us at <a href="mailto:support@victoryone.com" class="link">support@victoryone.com</a>.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Make all text black */
.headline, .subtitle, p, ul li, .link {
  color: black;
}

.headline {
  font-weight: bold;
  font-size: 1.75rem;
  text-align: center;
}

.subtitle {
  font-weight: 600;
  margin-top: 1.5rem;
  font-size: 1.1rem;
}

.v-card {
  margin-bottom: 24px;
  border-radius: 12px;
  background-color: #fff; /* Light background for card */
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
}

.v-divider {
  background-color: #ddd; /* Soft divider color */
}

.link {
  color: #1976D2; /* Blue link color */
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

ul {
  padding-left: 20px;
}

ul li {
  font-size: 1rem;
}

.list-style {
  list-style-type: disc;
}

.v-card-text {
  padding: 24px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .v-card {
    margin-bottom: 16px;
  }

  .headline {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .v-card-text {
    padding: 16px;
  }
}
</style>
