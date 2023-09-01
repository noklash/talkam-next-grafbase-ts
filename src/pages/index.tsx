import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="flex flex-col">
      <h1 className="text-white">Hello Grafbase!</h1>
    </div>
  )
}
