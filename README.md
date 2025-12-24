# 🎮 Quem sou eu? - Frontend

Um jogo multiplayer em tempo real onde os jogadores descobrem qual personagem foram atribuídos através de dicas e interações. Desenvolvido com React, TypeScript e Socket.IO para proporcionar uma experiência fluida e interativa.

## ✨ Features

- 🎯 **Jogo em Tempo Real** - Comunicação bidirecional via WebSocket
- 🎨 **Interface Moderna** - Design responsivo e animações fluidas com GSAP
- 🔐 **Sistema de Salas** - Criação e entrada em salas com códigos únicos
- 👥 **Multiplayer** - Suporte para múltiplos jogadores simultâneos
- 🎭 **Dois Modos de Jogo**:
  - **Preset**: Personagens predefinidos por categoria (animais, celebridades, comidas, etc.)
  - **Customizado**: Jogadores atribuem personagens uns aos outros
- 🛡️ **Proteção de Rotas** - Sistema robusto de guards e validações
- 💾 **Persistência de Sessão** - Reconexão automática em caso de desconexão

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Socket.IO Client** - Comunicação em tempo real
- **React Router DOM** - Roteamento
- **TailwindCSS** - Estilização
- **GSAP** - Animações
- **Sonner** - Notificações toast
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── game/          # Componentes específicos do jogo
│   ├── layout/        # Layout e estrutura
│   └── ui/            # Componentes reutilizáveis
├── contexts/          # Contextos React (Socket, Room, Player)
├── hooks/             # Custom hooks
├── pages/             # Páginas da aplicação
├── routes/            # Configuração de rotas
├── services/          # Serviços (Socket.IO)
├── types/             # Definições TypeScript
└── utils/             # Utilitários e helpers
```

## 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/lc0808/whoami-frontend.git

# Entre no diretório
cd whoami-frontend

# Instale as dependências
npm install --legacy-peer-deps

# Configure as variáveis de ambiente
cp .env.example .env
```

## ⚙️ Configuração

Edite o arquivo `.env` com a URL do servidor backend:

```env
VITE_SOCKET_URL=http://localhost:3000
```

## 🎯 Executar

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Verificar tipos
npm run type-check

# Lint
npm run lint
```

## 🎮 Como Jogar

1. **Criar Sala**: Escolha o modo de jogo e categoria (se preset)
2. **Compartilhar Código**: Envie o código da sala para os amigos
3. **Aguardar Jogadores**: Mínimo 2 jogadores para iniciar
4. **Atribuição**: No modo customizado, atribua personagens
5. **Descobrir**: Deduza qual personagem você é!

## 🧩 Funcionalidades Técnicas

- **Context API** para gerenciamento de estado global
- **Custom Hooks** para lógica reutilizável
- **Route Guards** para proteção de rotas
- **Session Storage** para persistência de dados
- **Error Boundaries** para tratamento de erros
- **TypeScript** para type safety
- **Responsive Design** mobile-first

## 👨‍💻 Autor

**Lucas Carvalho**

- Portfolio: [em construção]
- LinkedIn: [linkedin.com/in/lucas-carvalho-32aa70227](https://linkedin.com/in/lucas-carvalho-32aa70227)
- GitHub: [@lc0808](https://github.com/lc0808)
- Email: lucasvieirac.dev@gmail.com

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de portfólio.

---

⭐ **Desenvolvido com React + TypeScript + Socket.IO**
