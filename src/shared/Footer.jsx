import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-12 md:px-20 py-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
        {/* Brand */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-black leading-none">
              ARCHI
              <br />
              HERITAGE
            </h2>

            <p className="mt-6 text-sm text-gray-300 max-w-xs">
              A digital archive dedicated to discovering, preserving and sharing
              architectural heritage across Europe.
            </p>
          </div>

          <div className="mt-16 text-sm">
            <p className="mb-6">Created by:</p>

            <div className="text-4xl font-black tracking-tight">AH+</div>

            <p className="text-xs mt-2">architects.collective</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl mb-6">ARCHIVE CENTER</h3>

          <div className="space-y-3 text-gray-200">
            <a className="underline block">Carrer Nova, 12</a>

            <p>08002 Barcelona</p>

            <a className="underline block">T +34 93 555 24 80</a>

            <a className="underline block">info@archiheritage.eu</a>
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-xl mb-6">SOCIAL NETWORK</h3>

          <div className="space-y-3">
            {["Instagram", "LinkedIn", "Facebook", "Pinterest", "Youtube"].map(
              (item) => (
                <a
                  key={item}
                  className="block underline text-gray-200 hover:text-white"
                >
                  {item}
                </a>
              ),
            )}
          </div>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-xl mb-6">LEGAL INFORMATION</h3>

          <div className="space-y-3">
            {[
              "Legal Notice",
              "Cookie Policy",
              "Privacy Policy",
              "Accessibility",
            ].map((item) => (
              <Link
                key={item}
                className="block underline text-gray-200 hover:text-white"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="mt-20">
            <h3 className="text-xl mb-6">WITH THE SUPPORT OF</h3>

            <div className="border border-white/40 px-6 py-5 inline-block">
              <p className="text-lg font-bold">Generalitat Cultural Fund</p>

              <p className="text-sm text-gray-300">Department of Heritage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-20 pt-8 border-t border-white/30">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <p className="text-sm text-gray-300">
            © Architectural Heritage Archive 2026
          </p>

          <p className="text-sm underline">Submit suggestions</p>
        </div>
      </div>
    </footer>
  );
}
