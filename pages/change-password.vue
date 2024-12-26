<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-5 elevation-2">
          <v-card-title>
            <h2>Input Your Email To Change Password</h2>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="email" label="Email" type="email" required :rules="emailRules"
                placeholder="Enter your registered email" prepend-icon="mdi-email" />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="sendPasswordResetEmail">Send Reset Link</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '~/plugins/firebase';

export default {
  data() {
    return {
      email: '',
      valid: false,
      // Correct way of defining rules: array of functions
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    };
  },
  methods: {
    async sendPasswordResetEmail() {
      if (this.$refs.form.validate()) {
        try {
          await sendPasswordResetEmail(auth, this.email);
          alert('Password reset email sent. Please check your inbox.');
          this.email = ''; // Reset the email field after success
        } catch (error) {
          console.error('Error sending password reset email:', error);
          alert('Failed to send password reset email. Please try again.');
        }
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  margin-top: 50px;
}
</style>