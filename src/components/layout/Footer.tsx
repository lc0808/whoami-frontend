import { Github, Linkedin, Mail, Code2, Clock, Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";

export function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const socialLinks = [
    { icon: Github, href: "https://github.com/lc0808", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/lucas-carvalho-32aa70227",
      label: "LinkedIn",
    },
    { icon: Mail, href: "mailto:lucasvieirac.dev@gmail.com", label: "Email" },
  ];

  return (
    <footer className="w-full relative mt-auto">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      <div className="bg-[#010409]/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6">
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-blue-400" />
                <h3 className="text-white font-semibold">Lucas Carvalho</h3>
              </div>
              <p className="text-xs text-gray-400 max-w-xs">
                Fullstack Developer especializado em React, Angular, TypeScript
                e Node.js
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-[#1a1e2e]/40 hover:bg-[#1a1e2e]/80 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 border border-gray-800/50 hover:border-blue-500/50"
                    aria-label={social.label}
                  >
                    <social.icon
                      size={18}
                      className="text-gray-400 group-hover:text-blue-400 transition-colors"
                    />
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400">Open to Work</span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>
                  {currentTime.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  - Itapuranga, GO
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gamepad2 size={14} className="text-purple-400" />
                <span className="text-gray-600">
                  React + TypeScript + Socket.IO
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-600 pt-4">
            © {new Date().getFullYear()} Lucas Carvalho. Todos os direitos
            reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
