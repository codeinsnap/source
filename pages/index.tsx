import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });

export default function Home({ posts }: any) {
  return (
    <></>
  )
}

//https://jsonplaceholder.typicode.com/posts

export async function getStaticProps() { // run at server side- display data in console.
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  // console.log('allPosts', posts)
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
    },
  }
}