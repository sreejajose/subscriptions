<script setup>
import { ref, watch } from 'vue'
import { useQuery, useResult, useSubscription } from "@vue/apollo-composable";
import gql from 'graphql-tag';
const GET_OPPORTUNITIES = gql`
  query getOpportunities($id: ID!) {
    getOpportunitiesForAccount(accountId: $id) {
      id
      name
      stageName
      closeDate
      quotes {
        id
        name
        netAmount
        currencyCode
        status
        accountId
        poNumber
        expiryDate
      }
      orders {
        id
        orderNumber
        status
        orderAmount
      }
    }
  }
`;

const { result } = useQuery(GET_OPPORTUNITIES, {
      id: '0013J00000SxyAqQAJ',
    })
const opp = useResult(result, [], result.getOpportunitiesForAccount)

const messages = ref([])

const { result1 } = useSubscription(gql`
      subscription Events {
        events {
          createdById
          createdDate
          recordId
          accountId
          eventType
          objectName
          statusChanged
        }
      }
    `)

    watch(
      result1,
      data => {
        messages.value.push(data.messageAdded)
      },
      {
        lazy: true, // Don't immediately execute handler
      },
    )
</script>


<template>
  <div>
    {{result}}
  </div>
</template>

<style scoped>

</style>
