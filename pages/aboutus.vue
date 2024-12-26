<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-container>
          <!-- Victory One Section -->
          <v-row>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
              <v-img :src="require('@/assets/image 5.jpg')" alt="Victory Image" class="static-image square-image"></v-img>
            </v-col>

            <v-col cols="12" md="8">
              <v-card class="victory-one-card" flat>
                <h1 class="profile-header">VICTORY ONE</h1>
                <p class="company-description center-text">
                  is a dynamic and innovative company dedicated to achieving excellence in all we do. Our mission is to
                  empower individuals and businesses to reach their full potential through our exceptional products,
                  services, and unwavering support. We strive to create a positive impact on the world by fostering a
                  culture of integrity, teamwork, and continuous improvement.
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-container>
      <!-- Company Name and Description Section -->
      <v-row class="mt-4">
        <v-col cols="12" md="8">
          <h1 class="profile-header" style="margin-bottom: 40px;">ABOUT OUR COMPANY</h1>
          <p class="company-description">
            We mainly produce seamless steel pipe, precision tube, alloy pipe, copper tube, aluminum tube,
            and special-shaped pipe. We have strong production capacity and technical development capabilities.
            The company is located in Industrial Park, Kaifaqu Liaocheng city, and traffic is very convenient.
            We have 6 production lines for hot and cold rolled tube. The main production diameter is 6mm-426mm,
            with a wall thickness of 0.2mm-30mm.
          </p>
          <p class="company-description">
            We select high-quality raw materials for production; our products are used for fluid, boiler and hot
            exchange, chemical, hydraulic, gas and oil, line and construction, etc. We can provide you with good quality
            at the right price; welcome everyone to inquire!
          </p>
        </v-col>

        <v-col cols="12" md="4" class="d-flex align-center justify-center">
          <v-img :src="require('@/assets/image 1.jpg')" alt="Company Image" class="static-image square-image"></v-img>
        </v-col>
      </v-row>
    </v-container>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-container>
          <v-row>
            <v-col cols="12">
              <h1 class="profile-header center-text">Supplies</h1>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
              <v-img :src="require('@/assets/image 1.jpg')" alt="Image 1" class="grid-image hover-image"></v-img>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
              <v-img :src="require('@/assets/image 2.jpg')" alt="Image 2" class="grid-image hover-image"></v-img>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
              <v-img :src="require('@/assets/image 4.jpg')" alt="Image 3" class="grid-image hover-image"></v-img>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
              <v-img :src="require('@/assets/image 5.jpg')" alt="Image 4" class="grid-image hover-image"></v-img>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
              <v-img :src="require('@/assets/image 3.jpg')" alt="Image 5" class="grid-image hover-image"></v-img>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
              <v-img :src="require('@/assets/image 5.jpg')" alt="Image 6" class="grid-image hover-image"></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <!-- Vision and Mission Sections -->
    <v-container class="mt-4">
      <v-row>
        <v-col cols="12" md="8" class="mx-auto">
          <h2 class="vision-title center-text">Vision</h2>
          <div class="underline"></div>
          <p class="vision-description">
            To be the leading provider of aluminum solutions, recognized for our commitment to innovation and
            sustainability. We envision a world where our products enhance lives and contribute to a greener future.
          </p>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" md="8" class="mx-auto">
          <h2 class="mission-title center-text">Mission</h2>
          <div class="underline"></div>
          <p class="mission-description">
            Our mission is to deliver high-quality aluminum products and solutions that exceed customer expectations.
            We are dedicated to sustainable practices, responsible sourcing, and continuous improvement, ensuring we
            contribute positively to the communities we serve.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
.victory-one-card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-header {
  text-align: center;
  font-size: 36px;
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: bold;
  position: relative;
}

.profile-header::after {
  content: '';
  display: block;
  width: 70px;
  height: 4px;
  background-color: #ffa900;
  margin: 10px auto;
}

.company-name {
  font-size: 36px;
  font-weight: bold;
  color: orange;
  text-transform: uppercase;
}

.company-subtitle {
  font-size: 28px;
  color: orange;
  margin-bottom: 20px;
}

.company-description {
  font-size: 18px;
  margin-bottom: 20px;
}

.center-text {
  text-align: center;
  margin-top: 30px;
}

.static-image {
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.square-image {
  height: 300px;
  width: 400px;
}

.grid-image {
  margin-top: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 200px;
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s, box-shadow 0.3s;
}

.hover-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.vision-mission-card {
  padding: 16px;
  margin: 10px 0;
}

.vision-title,
.mission-title {
  font-size: 32px;
  text-align: center; /* Center text for titles */
}

.underline {
  height: 4px; /* Underline height */
  background-color: #ffa900; /* Underline color */
  width: 70px; /* Underline width */
  margin: 10px auto; /* Center underline */
}

.vision-description,
.mission-description {
  color: black;
  text-align: center; /* Center text for descriptions */
}
</style>