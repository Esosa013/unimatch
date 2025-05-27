import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UniMatch - Find Your Perfect Nigerian University',
  description: 'Discover the ideal private university in Nigeria with our intelligent recommendation system. Match based on budget, courses, location, and preferences.',
  keywords: 'Nigerian universities, private universities Nigeria, university admission, higher education Nigeria',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">UniMatch</h3>
                <p className="text-gray-400">
                  Helping Nigerian students find their perfect university match through intelligent recommendations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/" className="hover:text-white">Home</a></li>
                  <li><a href="/auth/register" className="hover:text-white">Sign Up</a></li>
                  <li><a href="/auth/login" className="hover:text-white">Login</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Universities</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Private Universities</a></li>
                  <li><a href="#" className="hover:text-white">By State</a></li>
                  <li><a href="#" className="hover:text-white">By Course</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 UniMatch. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}