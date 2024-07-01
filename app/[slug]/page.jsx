import UserProfile from "./Profile"
const base_URL = process.env.NEXT_PUBLIC_BASE_URL
export async function generateMetadata({ params }) {
  return {
    title: `Send loved to ${params.slug} | share Your Love`,
    description: `Share your love with ${params.slug}`,
    openGraph: {
      title: `Share your love with ${params.slug}`,
      description: 'Share your love with others',
      url: base_URL + `${params.slug}`,
      images: [
        {
          url: 'https://loved-project.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co%2FhmhqZns%2Fcroped1717571929480.jpg&w=640&q=75', // Must be an absolute URL
          width: 800,
          height: 600,
        },

      ],
      locale: 'en_US',
      type: 'website',
    },
  }
}
export default function User({ params }) {
  return (
    <div>
      <UserProfile params={params} />
    </div>
  )
}
