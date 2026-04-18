import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#161614] text-[#C8C7C0]">
      <div className="container-site py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="21" r="1" fill="white"/>
                  <circle cx="20" cy="21" r="1" fill="white"/>
                </svg>
              </div>
              <span className="font-display text-white text-lg">AutoDeliver</span>
            </div>
            <p className="text-sm leading-relaxed text-[#8A8880]">
              The trusted platform for shipping cars from Europe to the Gulf and beyond.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/register?role=client" className="hover:text-white transition-colors">Ship a car</Link></li>
              <li><Link href="/register?role=driver" className="hover:text-white transition-colors">Become a driver</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/faq"     className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
              <li><a href="mailto:support@autodeliver.com" className="hover:text-white transition-colors">support@autodeliver.com</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms"   className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2C2C28] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#5A5954]">© 2025 AutoDeliver. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-[#5A5954]">
            <span>🇬🇧 EN</span>
            <span>·</span>
            <span>🇸🇦 AR</span>
            <span>·</span>
            <span>🇩🇪 DE</span>
            <span>·</span>
            <span>🇫🇷 FR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
