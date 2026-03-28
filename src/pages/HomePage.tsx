import { Home } from 'lucide-react'
import { Empty } from '../components/Empty'

export function HomePage() {
  // TODO better home page
  return <>
    <title>Home</title>
    <Empty icon={Home} message="Select or create a conversation to get started." />
  </>
}
