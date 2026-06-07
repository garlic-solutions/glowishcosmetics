import { gql } from "graphql-request";

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $customerName: String!
    $phone: String!
    $address: String!
    $notes: String
    $productIds: [ProductWhereUniqueInput!]!
    $customerEmail: String
    $discountApplied: Float
    $orderNumber: Int
    $paymentMethod: String
  ) {
    createOrder(
      data: {
        customerName: $customerName
        phone: $phone
        address: $address
        notes: $notes
        orderedProducts: { connect: $productIds }
        customerEmail: $customerEmail
        discountApplied: $discountApplied
        orderNumber: $orderNumber
        paymentMethod: $paymentMethod
      }
    ) {
      id
      customerName
      phone
      createdAt
      orderNumber
      paymentMethod
    }
  }
`;

export const PUBLISH_ORDER = gql`
  mutation PublishOrder($id: ID!) {
    publishOrder(where: { id: $id }, to: [PUBLISHED]) {
      id
    }
  }
`;
