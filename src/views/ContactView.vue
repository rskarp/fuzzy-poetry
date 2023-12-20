<script lang="ts">
import type { SendEmailMutation } from '@/API'
import { API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import { type GraphQLQuery } from '@aws-amplify/api'

export default {
  data() {
    return {
      fullName: '',
      subject: '',
      emailBody: '',
      emailAddress: '',
      errorMessage: '',
      loading: false
    }
  },
  methods: {
    callApi(event: MouseEvent) {
      this.errorMessage = ''
      if (!this.fullName || !this.emailAddress || !this.emailBody) {
        this.errorMessage = 'Missing required Fields'
        return
      }

      API.graphql<GraphQLQuery<SendEmailMutation>>({
        query: mutations.sendEmail,
        variables: {
          senderName: this.fullName,
          senderAddress: this.emailAddress,
          emailSubject: this.subject,
          emailContent: this.emailBody
        }
      })
        .then((result) => {
          this.fullName = ''
          this.emailAddress = ''
          this.subject = ''
          this.emailBody = 'Sent!'
        })
        .catch((result) => {
          this.emailBody = `An error occurred. ${result.errors?.at(0)?.message}`
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<template>
  <div class="contact">
    <h1 class="text-violet-500 text-2xl">Contact Us</h1>
    <p>We would love to hear from you!</p>
    <label class="label flex-row justify-start">
      <span class="label-text px-2">Full Name: </span>
      <input
        type="text"
        class="input input-bordered w-full input-xs items-start"
        v-model="fullName"
        required
      />
    </label>
    <label class="label flex-row justify-start">
      <span class="label-text px-2">Email Address: </span>
      <input
        type="text"
        class="input input-bordered w-full input-xs"
        v-model="emailAddress"
        required
      />
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
    <button v-if="!loading" class="btn btn-primary" @click="callApi">Send</button>
    <button v-else class="btn btn-disabled bg-primary text-white">
      <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Sending...
    </button>
    {{ errorMessage }}
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
