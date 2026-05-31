import { gql } from "graphql-request";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(orderBy: createdAt_DESC) {
      id
      name
      slug
      code
      description { html }
      tags
      price
      category
      brand { id name slug }
      featured
      image { url width height }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    product(where: { slug: $slug }) {
      id
      name
      slug
      code
      description { html }
      tags
      price
      category
      brand { id name slug }
      image { url width height }
      gallery { url width height }
    }
  }
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts {
    products(where: { featured: true }, first: 6) {
      id
      name
      slug
      code
      tags
      price
      category
      brand { id name slug }
      image { url width height }
    }
  }
`;

export const GET_WEBSITE_SETTINGS = gql`
  query GetWebsiteSettings {
    websiteSettings(first: 1) {
      title
      contactEmail
      contactPhone
      contactAddress
      fburl
      instaUrl
      tiktokUrl
    }
  }
`;

export const GET_PRODUCTS_BY_TAG = gql`
  query GetProductsByTag($tag: String!) {
    products(where: { tags_contains_some: [$tag] }) {
      id
      name
      slug
      code
      tags
      price
      category
      brand { id name slug }
      image { url width height }
    }
  }
`;

export const GET_ALL_BRANDS = gql`
  query GetAllBrands {
    brands(orderBy: name_ASC) {
      id
      name
      slug
    }
  }
`;

export const GET_HERO_SLIDES = gql`
  query GetHeroSlides {
    heroSlides(first: 5) {
      id
      title
      subtitle
      cta
      url
      image {
        url
        width
        height
      }
    }
  }
`;
export const GET_REVIEWS = gql`
  query GetReviews {
    reviews {
      id
      name
      rating
      comment
      userImage {
        url
      }
      product {
        name
      }
    }
  }
`;
