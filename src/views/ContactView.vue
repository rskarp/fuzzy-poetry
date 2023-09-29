<script lang="ts">
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      subject: '',
      emailBody: ''
    }
  },
  methods: {
    callApi(event: MouseEvent) {
      this.firstName = ''
      this.lastName = ''
      this.subject = ''
      this.emailBody = ''
      console.log('Sending email...')
    }
  }
}
</script>

<template>
  <div class="contact">
    <h1 class="text-violet-500 text-2xl">Contact Us</h1>
    <p>We would love to hear from you!</p>
    <label class="label flex-row justify-start">
      <span class="label-text px-2">First Name: </span>
      <input
        type="text"
        class="input input-bordered input-xs items-start"
        v-model="firstName"
        required
      />
    </label>
    <label class="label flex-row justify-start">
      <span class="label-text px-2">Last Name: </span>
      <input type="text" class="input input-bordered input-xs" v-model="lastName" required />
    </label>
    <label class="label flex-row justify-start">
      <span class="label-text px-2">Subject: </span>
      <input type="text" class="input input-bordered w-full input-xs" v-model="subject" />
    </label>
    <textarea
      class="textarea textarea-bordered textarea-lg w-full my-2"
      placeholder="Enter message here..."
      v-model="emailBody"
      required
    ></textarea>
    <button class="btn btn-primary" @click="callApi">Send</button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .contact {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
</style>
