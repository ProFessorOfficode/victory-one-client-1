<template>
    <v-app>
      <v-container>
        <v-row class="mb-4">
          <v-col cols="12">
            <h2 class="header-title">Sign In Using</h2>
          </v-col>
        </v-row>
  
        <v-row justify="center">
          <v-col cols="12" md="4">
            <v-card class="option-card">
              <v-card-title class="text-h5 text-center">Business</v-card-title>
              <v-card-text>
                <ul class="benefits-list text-black"> <!-- Added class for black text -->
                  <li><span class="checkmark">✔</span> 10% off your first purchase</li>
                  <li><span class="checkmark">✔</span> Flexible payment options</li>
                  <li><span class="checkmark">✔</span> Free online returns</li>
                </ul>
              </v-card-text>
              <v-card-actions>
                <v-btn 
                  class="black-button" 
                  @click="navigateTo('sign/bussignin')" 
                  style="background-color: black; color: white;"
                >
                  Sign In
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="4">
            <v-card class="option-card">
              <v-card-title class="text-h5 text-center">Returning Customer</v-card-title>
              <v-card-text>
                <ul class="benefits-list text-black"> <!-- Added class for black text -->
                  <li><span class="checkmark">✔</span> 10% off your next purchase</li>
                  <li><span class="checkmark">✔</span> Exclusive rewards program</li>
                  <li><span class="checkmark">✔</span> Priority customer support</li>
                </ul>
              </v-card-text>
              <v-card-actions>
                <v-btn 
                  class="black-button" 
                  @click="navigateTo('sign/signin')" 
                  style="background-color: black; color: white;"
                >
                  Sign In
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="4">
            <v-card class="option-card">
              <v-card-title class="text-h5 text-center">New Customer</v-card-title>
              <v-card-text>
                <ul class="benefits-list text-black"> <!-- Added class for black text -->
                  <li><span class="checkmark">✔</span> 10% off your first purchase</li>
                  <li><span class="checkmark">✔</span> Welcome benefits for new users</li>
                  <li><span class="checkmark">✔</span> Easy sign-up process</li>
                </ul>
              </v-card-text>
              <v-card-actions>
                <v-btn 
                  class="black-button" 
                  @click="navigateTo('sign/signup')" 
                  style="background-color: black; color: white;"
                >
                  Sign Up
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  export default {
    methods: {
      navigateTo(route) {
        this.$router.push(`/${route}`); // Navigate to the specified route
      },
    },
  };
  </script>
  
  <style scoped>
  .header-title {
    font-size: 32px;
    font-family: 'Sequel Sans', sans-serif;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .option-card {
    cursor: pointer;
    transition: box-shadow 0.3s, transform 0.3s; /* Added transform transition */
    background-color: #fff; /* Added white background for cards */
    border: 1px solid #e0e0e0; /* Light border for better definition */
    border-radius: 8px; /* More rounded corners */
  }
  
  .option-card:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px); /* Move up on hover */
  }
  
  .benefits-list {
    list-style: none;
    padding: 0;
    text-align: left;
    margin: 20px 0; /* Adjusted margin for better spacing */
  }
  
  .benefits-list li {
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-bottom: 8px; /* Reduced space between benefits */
  }
  
  .checkmark {
    color: green;
    font-weight: bold;
    margin-right: 4px; /* Slight spacing to separate checkmark from text */
  }
  
  .black-button {
    width: 100%; /* Full width */
  }
  
  .text-black {
    color: black; /* Added class for black text color */
  }
  </style>
  