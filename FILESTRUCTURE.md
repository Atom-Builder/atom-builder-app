atom-builder-app/
├── app/
│   ├── builder/
│   │   └── page.tsx
│   ├── creations/
│   │   └── page.tsx
│   ├── ClientLayoutWrapper.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   └── ... (images, etc.)
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   └── AnimatedAtom.tsx
│   │   ├── core/
│   │   │   ├── AtomPreview.tsx
│   │   │   ├── AtomViewport.tsx
│   │   │   ├── ControlsPanel.tsx
│   │   │   ├── ParticleBackground.tsx
│   │   │   └── SettingsModal.tsx
│   │   ├── layout/
│   │   │   ├── BuilderLayout.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   └── sections/
│   │       ├── AntimatterHubSection.tsx
│   │       ├── BuilderSection.tsx
│   │       ├── CommunityGallerySection.tsx
│   │       ├── CreationsGallery.tsx
│   │       ├── Hero.tsx
│   │       └── PeriodicTableSection.tsx
│   ├── data/
│   │   └── periodicTable.ts
│   ├── hooks/
│   │   ├── useAuth.tsx
│   │   ├── useBuilder.tsx
│   │   └── useGraphicsSettings.tsx
│   └── types.ts
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json