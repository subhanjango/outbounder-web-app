# 🚀 Outbounder Web App

A modern, responsive Vue.js application for managing outbound sales activities, built with PrimeVue components.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)
![PrimeVue](https://img.shields.io/badge/PrimeVue-4.x-007ACC?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)

## ✨ Features

- **🔐 User Authentication** - Secure login/register system with local storage
- **📊 Dashboard** - Overview with statistics and quick actions
- **👥 Contact Management** - Import, enrich, and manage contacts with advanced filtering
- **🏢 Account Management** - Interactive Kanban board with drag-and-drop functionality
- **🤖 AI Chat System** - Integrated chat with knowledge base support
- **🔍 Company Research** - Research tools for prospect companies
- **📚 Knowledge Base** - Document upload and management system
- **💬 Contact Chat** - Direct messaging with LinkedIn/email integration
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI** - Clean white theme with PrimeVue components

## 🚀 Quick Start

### Prerequisites

Before you begin, make sure you have the following installed on your computer:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

> **💡 Tip:** To check if you have Node.js installed, open a terminal/command prompt and type `node --version`

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/subhanjango/outbounder-web-app.git
   cd outbounder-web-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   > This will download all the required packages. It may take a few minutes.

3. **Start the Development Server**
   ```bash
   npm run serve
   ```

4. **Open Your Browser**
   
   The app will automatically open at: `http://localhost:8080`
   
   If it doesn't open automatically, copy and paste the URL into your browser.

### 🎉 That's it! You should now see the login page.

## 🖥️ Using the Application

### Login Credentials
The app uses mock authentication - you can register with any email/password or use these test credentials:
- **Email:** test@example.com
- **Password:** password123

### Navigation
Once logged in, you can access:
- **Dashboard** - Overview and quick actions
- **Contacts** - Manage your contact database
- **Accounts** - Kanban-style account management
- **AI Chat** - Interactive chat system
- **Company Research** - Research tools
- **Knowledge Base** - Document management

### Key Features to Try
1. **Drag & Drop Accounts** - Move accounts between status columns in the Accounts section
2. **Contact Import** - Upload CSV files in the Contacts section
3. **AI Chat** - Ask questions and get responses
4. **Document Upload** - Add files to your knowledge base

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run serve` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm run lint` | Check and fix code style issues |

## 📱 Browser Support

This application works on:
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- 📱 Mobile browsers

## 🔧 Troubleshooting

### Common Issues

**1. "npm: command not found"**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

**2. "Port 8080 is already in use"**
- The app will automatically use the next available port (8081, 8082, etc.)
- Check the terminal output for the correct URL

**3. White screen or errors**
- Make sure all dependencies are installed: `npm install`
- Clear your browser cache and refresh

**4. Installation fails**
- Try deleting `node_modules` folder and `package-lock.json`
- Run `npm install` again

### Getting Help

If you encounter any issues:
1. Check the terminal/console for error messages
2. Make sure you're using Node.js version 18 or higher
3. Try running `npm install` again
4. Create an issue on the GitHub repository

## 🏗️ Tech Stack

- **Frontend Framework:** Vue.js 3 with Composition API
- **UI Components:** PrimeVue 4 with Aura theme
- **Routing:** Vue Router 4
- **Styling:** PrimeFlex utilities + custom CSS
- **Icons:** PrimeIcons
- **Build Tool:** Vue CLI
- **Package Manager:** npm

## 📂 Project Structure

```
outbounder-web-app/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable Vue components
│   ├── views/            # Page components
│   ├── router/           # Route configuration
│   ├── App.vue           # Root component
│   └── main.js           # App entry point
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🚀 Deployment

To deploy this application:

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to any static hosting service:
   - [Vercel](https://vercel.com/) (recommended)
   - [Netlify](https://netlify.com/)
   - [GitHub Pages](https://pages.github.com/)
   - [Firebase Hosting](https://firebase.google.com/docs/hosting)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Made with ❤️ using Vue.js and PrimeVue**

*For more detailed documentation, visit the [Vue.js](https://vuejs.org/) and [PrimeVue](https://primevue.org/) official websites.*