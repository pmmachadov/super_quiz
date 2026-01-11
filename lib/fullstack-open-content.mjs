// Full Stack Open Course Content for Spaced Repetition Learning
import { createDeck, createCard, getAllDecks, getAllCards } from './spaced-repetition-db.mjs';

const FULLSTACK_OPEN_CONTENT = {
  // Part 0: Fundamentals of Web apps
  part0: {
    name: "Part 0: Fundamentals of Web Apps",
    description: "Basic concepts of web development, HTTP, and browser-server communication",
    color: "#1f77b4",
    cards: [
      {
        type: "definition",
        front: "What is HTTP?",
        back: "HyperText Transfer Protocol - A protocol for transferring data between web browsers and servers",
        category: "Web Fundamentals",
        tags: ["HTTP", "protocol", "web"]
      },
      {
        type: "definition",
        front: "What are HTTP methods?",
        back: "GET (retrieve data), POST (send data), PUT (update data), DELETE (remove data), PATCH (partial update)",
        category: "Web Fundamentals",
        tags: ["HTTP", "methods", "REST"]
      },
      {
        type: "concept",
        front: "Describe the traditional web application model",
        back: "Server renders HTML pages, browser requests full page reloads, server-side routing, minimal client-side JavaScript",
        category: "Web Architecture",
        tags: ["traditional", "server-side", "architecture"]
      },
      {
        type: "concept",
        front: "What is a Single Page Application (SPA)?",
        back: "Web app that loads a single HTML page and dynamically updates content using JavaScript, without full page reloads",
        category: "Web Architecture",
        tags: ["SPA", "client-side", "JavaScript"]
      },
      {
        type: "code",
        front: "What does this HTML form do?\n```html\n<form action='/notes' method='POST'>\n  <input name='note' type='text'>\n  <input type='submit' value='Save'>\n</form>\n```",
        back: "Sends a POST request to '/notes' endpoint with form data containing the note text when submitted",
        category: "HTML Forms",
        tags: ["HTML", "forms", "POST"]
      }
    ]
  },

  // Part 1: Introduction to React
  part1: {
    name: "Part 1: Introduction to React",
    description: "React basics, components, props, state, and event handling",
    color: "#ff7f0e",
    cards: [
      {
        type: "definition",
        front: "What is React?",
        back: "A JavaScript library for building user interfaces, especially single-page applications with reusable components",
        category: "React Basics",
        tags: ["React", "library", "UI"]
      },
      {
        type: "definition",
        front: "What is JSX?",
        back: "JavaScript XML - A syntax extension that allows writing HTML-like code in JavaScript React components",
        category: "React Basics",
        tags: ["JSX", "syntax", "JavaScript"]
      },
      {
        type: "code",
        front: "Create a functional React component named 'Hello' that accepts a 'name' prop",
        back: "```jsx\nconst Hello = ({ name }) => {\n  return <div>Hello {name}!</div>\n}\n```",
        category: "Components",
        tags: ["component", "props", "functional"]
      },
      {
        type: "concept",
        front: "What are React props?",
        back: "Properties passed from parent to child components - immutable data that components receive as parameters",
        category: "Components",
        tags: ["props", "data", "immutable"]
      },
      {
        type: "code",
        front: "How do you use useState hook to manage state?",
        back: "```jsx\nconst [count, setCount] = useState(0)\n// count is current value, setCount updates it\n```",
        category: "State Management",
        tags: ["useState", "hooks", "state"]
      },
      {
        type: "concept",
        front: "What is the difference between props and state?",
        back: "Props: immutable data passed from parent. State: mutable data managed within component that can trigger re-renders",
        category: "State Management",
        tags: ["props", "state", "immutable", "mutable"]
      },
      {
        type: "code",
        front: "Handle a button click event in React",
        back: "```jsx\n<button onClick={() => setCount(count + 1)}>\n  count is {count}\n</button>\n```",
        category: "Event Handling",
        tags: ["onClick", "events", "state"]
      },
      {
        type: "concept",
        front: "What happens when state changes in React?",
        back: "React re-renders the component and its children, updating the DOM to reflect the new state",
        category: "React Lifecycle",
        tags: ["re-render", "DOM", "lifecycle"]
      }
    ]
  },

  // Part 2: Communicating with server
  part2: {
    name: "Part 2: Communicating with Server",
    description: "Forms, HTTP requests, REST APIs, and effect hooks",
    color: "#2ca02c",
    cards: [
      {
        type: "definition",
        front: "What is REST?",
        back: "REpresentational State Transfer - Architectural style for designing networked applications using HTTP methods",
        category: "REST API",
        tags: ["REST", "API", "HTTP"]
      },
      {
        type: "code",
        front: "Make a GET request using axios",
        back: "```javascript\naxios.get('http://localhost:3001/notes')\n  .then(response => {\n    setNotes(response.data)\n  })\n```",
        category: "HTTP Requests",
        tags: ["axios", "GET", "promise"]
      },
      {
        type: "code",
        front: "Use useEffect hook to fetch data on component mount",
        back: "```jsx\nuseEffect(() => {\n  axios.get('/api/notes')\n    .then(response => setNotes(response.data))\n}, []) // empty dependency array\n```",
        category: "Effect Hook",
        tags: ["useEffect", "fetch", "mount"]
      },
      {
        type: "concept",
        front: "What is the purpose of the dependency array in useEffect?",
        back: "Controls when the effect runs: [] = once on mount, [var] = when var changes, no array = every render",
        category: "Effect Hook",
        tags: ["useEffect", "dependencies", "lifecycle"]
      },
      {
        type: "code",
        front: "Handle form submission in React",
        back: "```jsx\nconst handleSubmit = (event) => {\n  event.preventDefault()\n  // process form data\n}\n<form onSubmit={handleSubmit}>\n```",
        category: "Forms",
        tags: ["forms", "preventDefault", "onSubmit"]
      },
      {
        type: "code",
        front: "Create a controlled input component",
        back: "```jsx\n<input \n  value={inputValue} \n  onChange={(e) => setInputValue(e.target.value)}\n/>\n```",
        category: "Forms",
        tags: ["controlled", "input", "onChange"]
      },
      {
        type: "concept",
        front: "What is a controlled component?",
        back: "React component where form data is handled by component state, not DOM. Input value controlled by React state",
        category: "Forms",
        tags: ["controlled", "state", "forms"]
      },
      {
        type: "best-practice",
        front: "How should you handle errors in HTTP requests?",
        back: "Use try-catch with async/await or .catch() with promises. Show user-friendly error messages and handle different error types",
        category: "Error Handling",
        tags: ["error", "HTTP", "UX"]
      }
    ]
  },

  // Part 3: Programming a server with Node.js and Express
  part3: {
    name: "Part 3: Programming a Server with Node.js and Express",
    description: "Backend development, Express.js, middleware, and database integration",
    color: "#d62728",
    cards: [
      {
        type: "definition",
        front: "What is Node.js?",
        back: "JavaScript runtime built on Chrome's V8 engine that allows running JavaScript on the server-side",
        category: "Node.js Basics",
        tags: ["Node.js", "runtime", "server"]
      },
      {
        type: "definition",
        front: "What is Express.js?",
        back: "Minimal and flexible Node.js web application framework for building APIs and web applications",
        category: "Express Basics",
        tags: ["Express", "framework", "Node.js"]
      },
      {
        type: "code",
        front: "Create a basic Express server",
        back: "```javascript\nconst express = require('express')\nconst app = express()\n\napp.get('/', (req, res) => {\n  res.send('Hello World!')\n})\n\napp.listen(3000)\n```",
        category: "Express Setup",
        tags: ["Express", "server", "routes"]
      },
      {
        type: "code",
        front: "Define a GET route that returns JSON",
        back: "```javascript\napp.get('/api/notes', (request, response) => {\n  response.json(notes)\n})\n```",
        category: "Routes",
        tags: ["GET", "JSON", "API"]
      },
      {
        type: "code",
        front: "Define a POST route to create new data",
        back: "```javascript\napp.post('/api/notes', (request, response) => {\n  const note = request.body\n  // process note\n  response.status(201).json(note)\n})\n```",
        category: "Routes",
        tags: ["POST", "create", "body"]
      },
      {
        type: "concept",
        front: "What is middleware in Express?",
        back: "Functions that execute during request-response cycle. Can modify request/response objects or end the cycle",
        category: "Middleware",
        tags: ["middleware", "request", "response"]
      },
      {
        type: "code",
        front: "Use express.json() middleware",
        back: "```javascript\napp.use(express.json())\n// Parses incoming JSON payloads\n```",
        category: "Middleware",
        tags: ["express.json", "parsing", "JSON"]
      },
      {
        type: "code",
        front: "Enable CORS for all routes",
        back: "```javascript\nconst cors = require('cors')\napp.use(cors())\n```",
        category: "CORS",
        tags: ["cors", "cross-origin", "middleware"]
      },
      {
        type: "concept",
        front: "What is CORS and why is it needed?",
        back: "Cross-Origin Resource Sharing - Security feature that restricts web pages from making requests to different domains",
        category: "CORS",
        tags: ["CORS", "security", "cross-origin"]
      },
      {
        type: "best-practice",
        front: "How should you structure Express routes?",
        back: "Use separate router modules, group related routes, use middleware for common functionality, validate input data",
        category: "Architecture",
        tags: ["routes", "structure", "organization"]
      }
    ]
  },

  // Part 4: Testing Express servers, user administration
  part4: {
    name: "Part 4: Testing Express Servers & User Administration",
    description: "Testing, user authentication, authorization, and security",
    color: "#9467bd",
    cards: [
      {
        type: "definition",
        front: "What is JWT?",
        back: "JSON Web Token - Compact, URL-safe means of representing claims between two parties for authentication",
        category: "Authentication",
        tags: ["JWT", "token", "authentication"]
      },
      {
        type: "concept",
        front: "What are the three parts of a JWT?",
        back: "Header (algorithm & token type), Payload (claims/data), Signature (verification)",
        category: "Authentication",
        tags: ["JWT", "header", "payload", "signature"]
      },
      {
        type: "code",
        front: "Hash a password using bcrypt",
        back: "```javascript\nconst bcrypt = require('bcrypt')\nconst saltRounds = 10\nconst hashedPassword = await bcrypt.hash(password, saltRounds)\n```",
        category: "Security",
        tags: ["bcrypt", "hashing", "password"]
      },
      {
        type: "code",
        front: "Compare password with hash",
        back: "```javascript\nconst isValid = await bcrypt.compare(password, hashedPassword)\n```",
        category: "Security",
        tags: ["bcrypt", "compare", "password"]
      },
      {
        type: "code",
        front: "Create and sign a JWT token",
        back: "```javascript\nconst jwt = require('jsonwebtoken')\nconst token = jwt.sign(\n  { userId: user.id, username: user.username },\n  process.env.SECRET\n)\n```",
        category: "Authentication",
        tags: ["JWT", "sign", "token"]
      },
      {
        type: "code",
        front: "Verify a JWT token",
        back: "```javascript\nconst decodedToken = jwt.verify(token, process.env.SECRET)\nconst userId = decodedToken.userId\n```",
        category: "Authentication",
        tags: ["JWT", "verify", "decode"]
      },
      {
        type: "concept",
        front: "What is the difference between authentication and authorization?",
        back: "Authentication: verifying who you are. Authorization: verifying what you're allowed to do",
        category: "Security",
        tags: ["authentication", "authorization", "security"]
      },
      {
        type: "code",
        front: "Write a simple Jest test for an API endpoint",
        back: "```javascript\ntest('notes are returned as json', async () => {\n  await api\n    .get('/api/notes')\n    .expect(200)\n    .expect('Content-Type', /application\\/json/)\n})\n```",
        category: "Testing",
        tags: ["Jest", "testing", "API"]
      },
      {
        type: "best-practice",
        front: "Security best practices for Express apps",
        back: "Hash passwords, use HTTPS, validate input, use environment variables for secrets, implement rate limiting, use helmet middleware",
        category: "Security",
        tags: ["security", "best-practices", "Express"]
      }
    ]
  },

  // Part 5: Testing React apps
  part5: {
    name: "Part 5: Testing React Apps",
    description: "Frontend testing, React Testing Library, E2E testing",
    color: "#8c564b",
    cards: [
      {
        type: "definition",
        front: "What is React Testing Library?",
        back: "Testing utility that focuses on testing components the way users interact with them",
        category: "Testing Tools",
        tags: ["React Testing Library", "testing", "user-centric"]
      },
      {
        type: "concept",
        front: "What is the testing philosophy of React Testing Library?",
        back: "Test behavior, not implementation. Focus on what users see and do, not internal component details",
        category: "Testing Philosophy",
        tags: ["behavior", "user-centric", "philosophy"]
      },
      {
        type: "code",
        front: "Test if a component renders specific text",
        back: "```javascript\ntest('renders hello message', () => {\n  render(<Hello name='World' />)\n  const element = screen.getByText('Hello World!')\n  expect(element).toBeInTheDocument()\n})\n```",
        category: "Component Testing",
        tags: ["render", "getByText", "testing"]
      },
      {
        type: "code",
        front: "Test a button click event",
        back: "```javascript\ntest('clicking button calls event handler', async () => {\n  const mockHandler = jest.fn()\n  render(<Button onClick={mockHandler} />)\n  \n  const button = screen.getByRole('button')\n  await user.click(button)\n  \n  expect(mockHandler).toHaveBeenCalledTimes(1)\n})\n```",
        category: "Event Testing",
        tags: ["click", "mock", "user events"]
      },
      {
        type: "concept",
        front: "What are Jest mocks and when to use them?",
        back: "Functions that replace real implementations for testing. Use for external dependencies, API calls, or complex functions",
        category: "Mocking",
        tags: ["Jest", "mocks", "dependencies"]
      },
      {
        type: "definition",
        front: "What is End-to-End (E2E) testing?",
        back: "Testing complete user workflows from start to finish, simulating real user interactions with the full application",
        category: "E2E Testing",
        tags: ["E2E", "integration", "user workflows"]
      },
      {
        type: "concept",
        front: "What is the testing pyramid?",
        back: "Unit tests (many, fast, isolated) > Integration tests (some, moderate) > E2E tests (few, slow, full system)",
        category: "Testing Strategy",
        tags: ["testing pyramid", "strategy", "levels"]
      },
      {
        type: "best-practice",
        front: "Best practices for React component testing",
        back: "Test user behavior, use semantic queries, avoid testing implementation details, keep tests simple and focused",
        category: "Testing Best Practices",
        tags: ["best practices", "React", "testing"]
      }
    ]
  },

  // Part 6: Advanced state management
  part6: {
    name: "Part 6: Advanced State Management",
    description: "Redux, context, state management patterns, and performance optimization",
    color: "#e377c2",
    cards: [
      {
        type: "definition",
        front: "What is Redux?",
        back: "Predictable state container for JavaScript apps. Centralizes application state in a single store",
        category: "Redux Basics",
        tags: ["Redux", "state management", "store"]
      },
      {
        type: "concept",
        front: "What are the three principles of Redux?",
        back: "1. Single source of truth (one store), 2. State is read-only (immutable), 3. Changes made with pure functions (reducers)",
        category: "Redux Principles",
        tags: ["Redux", "principles", "immutable"]
      },
      {
        type: "definition",
        front: "What is a Redux action?",
        back: "Plain JavaScript object that describes what happened. Must have a 'type' property",
        category: "Redux Actions",
        tags: ["action", "Redux", "type"]
      },
      {
        type: "definition",
        front: "What is a Redux reducer?",
        back: "Pure function that takes current state and action, returns new state. (state, action) => newState",
        category: "Redux Reducers",
        tags: ["reducer", "pure function", "state"]
      },
      {
        type: "code",
        front: "Create a simple Redux reducer",
        back: "```javascript\nconst counterReducer = (state = 0, action) => {\n  switch (action.type) {\n    case 'INCREMENT':\n      return state + 1\n    case 'DECREMENT':\n      return state - 1\n    default:\n      return state\n  }\n}\n```",
        category: "Redux Implementation",
        tags: ["reducer", "switch", "immutable"]
      },
      {
        type: "concept",
        front: "What is React Context?",
        back: "React feature for sharing data between components without passing props down manually through every level",
        category: "React Context",
        tags: ["Context", "prop drilling", "sharing"]
      },
      {
        type: "code",
        front: "Create and use React Context",
        back: "```jsx\nconst ThemeContext = createContext()\n\nconst App = () => (\n  <ThemeContext.Provider value='dark'>\n    <Component />\n  </ThemeContext.Provider>\n)\n\nconst Component = () => {\n  const theme = useContext(ThemeContext)\n  return <div>Theme: {theme}</div>\n}\n```",
        category: "React Context",
        tags: ["createContext", "Provider", "useContext"]
      },
      {
        type: "concept",
        front: "When should you use Redux vs React Context?",
        back: "Redux: complex state logic, time-travel debugging, large apps. Context: simple state sharing, theming, avoiding prop drilling",
        category: "State Management Choice",
        tags: ["Redux", "Context", "comparison"]
      },
      {
        type: "best-practice",
        front: "Redux best practices",
        back: "Keep state normalized, use action creators, don't mutate state, use Redux Toolkit, separate concerns with multiple reducers",
        category: "Redux Best Practices",
        tags: ["best practices", "Redux Toolkit", "normalization"]
      }
    ]
  },

  // Part 7: React router, custom hooks, styling with CSS and webpack
  part7: {
    name: "Part 7: React Router, Custom Hooks & Styling",
    description: "Client-side routing, custom hooks, CSS-in-JS, and build tools",
    color: "#bcbd22",
    cards: [
      {
        type: "definition",
        front: "What is React Router?",
        back: "Library for handling client-side routing in React applications, enabling navigation without page reloads",
        category: "React Router",
        tags: ["React Router", "routing", "SPA"]
      },
      {
        type: "code",
        front: "Set up basic React Router",
        back: "```jsx\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom'\n\n<Router>\n  <Routes>\n    <Route path='/' element={<Home />} />\n    <Route path='/about' element={<About />} />\n  </Routes>\n</Router>\n```",
        category: "React Router Setup",
        tags: ["BrowserRouter", "Routes", "Route"]
      },
      {
        type: "code",
        front: "Create navigation links with React Router",
        back: "```jsx\nimport { Link } from 'react-router-dom'\n\n<nav>\n  <Link to='/'>Home</Link>\n  <Link to='/about'>About</Link>\n</nav>\n```",
        category: "Navigation",
        tags: ["Link", "navigation", "to"]
      },
      {
        type: "code",
        front: "Access URL parameters with useParams",
        back: "```jsx\nimport { useParams } from 'react-router-dom'\n\nconst User = () => {\n  const { id } = useParams()\n  return <div>User ID: {id}</div>\n}\n\n// Route: <Route path='/users/:id' element={<User />} />\n```",
        category: "URL Parameters",
        tags: ["useParams", "parameters", "dynamic"]
      },
      {
        type: "concept",
        front: "What is a custom hook?",
        back: "JavaScript function that starts with 'use' and can call other hooks. Enables sharing stateful logic between components",
        category: "Custom Hooks",
        tags: ["custom hooks", "reusability", "stateful logic"]
      },
      {
        type: "code",
        front: "Create a custom hook for local storage",
        back: "```jsx\nconst useLocalStorage = (key, initialValue) => {\n  const [value, setValue] = useState(() => {\n    const item = localStorage.getItem(key)\n    return item ? JSON.parse(item) : initialValue\n  })\n  \n  const setStoredValue = (newValue) => {\n    setValue(newValue)\n    localStorage.setItem(key, JSON.stringify(newValue))\n  }\n  \n  return [value, setStoredValue]\n}\n```",
        category: "Custom Hooks",
        tags: ["localStorage", "custom hook", "persistence"]
      },
      {
        type: "concept",
        front: "What is CSS-in-JS?",
        back: "Pattern where CSS is composed using JavaScript, allowing dynamic styling and component-scoped styles",
        category: "Styling",
        tags: ["CSS-in-JS", "styling", "dynamic"]
      },
      {
        type: "concept",
        front: "What are CSS Modules?",
        back: "CSS files where class names are locally scoped by default, preventing naming conflicts",
        category: "Styling",
        tags: ["CSS Modules", "scoped", "naming"]
      },
      {
        type: "best-practice",
        front: "React performance optimization techniques",
        back: "React.memo, useMemo, useCallback, code splitting, lazy loading, avoiding inline objects/functions",
        category: "Performance",
        tags: ["performance", "optimization", "React"]
      }
    ]
  },

  // Part 8: GraphQL
  part8: {
    name: "Part 8: GraphQL",
    description: "GraphQL fundamentals, Apollo Client, and server implementation",
    color: "#17becf",
    cards: [
      {
        type: "definition",
        front: "What is GraphQL?",
        back: "Query language and runtime for APIs that allows clients to request exactly the data they need",
        category: "GraphQL Basics",
        tags: ["GraphQL", "query language", "API"]
      },
      {
        type: "concept",
        front: "What are the main advantages of GraphQL over REST?",
        back: "Single endpoint, request exactly needed data, strong type system, real-time subscriptions, introspection",
        category: "GraphQL vs REST",
        tags: ["advantages", "REST", "comparison"]
      },
      {
        type: "code",
        front: "Write a basic GraphQL query",
        back: "```graphql\nquery {\n  user(id: \"123\") {\n    name\n    email\n    posts {\n      title\n      content\n    }\n  }\n}\n```",
        category: "GraphQL Queries",
        tags: ["query", "syntax", "nested"]
      },
      {
        type: "code",
        front: "Define a GraphQL type with resolver",
        back: "```javascript\nconst typeDefs = `\n  type User {\n    id: ID!\n    name: String!\n    email: String!\n  }\n  \n  type Query {\n    user(id: ID!): User\n  }\n`\n\nconst resolvers = {\n  Query: {\n    user: (root, args) => users.find(u => u.id === args.id)\n  }\n}\n```",
        category: "GraphQL Schema",
        tags: ["typeDefs", "resolvers", "schema"]
      },
      {
        type: "definition",
        front: "What is Apollo Client?",
        back: "Comprehensive state management library for JavaScript that manages both local and remote data with GraphQL",
        category: "Apollo Client",
        tags: ["Apollo", "client", "state management"]
      },
      {
        type: "code",
        front: "Use Apollo Client's useQuery hook",
        back: "```jsx\nimport { useQuery, gql } from '@apollo/client'\n\nconst GET_USERS = gql`\n  query GetUsers {\n    users {\n      id\n      name\n    }\n  }\n`\n\nconst Users = () => {\n  const { loading, error, data } = useQuery(GET_USERS)\n  \n  if (loading) return <p>Loading...</p>\n  if (error) return <p>Error: {error.message}</p>\n  \n  return data.users.map(user => <div key={user.id}>{user.name}</div>)\n}\n```",
        category: "Apollo Client Usage",
        tags: ["useQuery", "gql", "loading", "error"]
      },
      {
        type: "concept",
        front: "What are GraphQL subscriptions?",
        back: "Real-time GraphQL operations that allow server to push data to clients when specific events occur",
        category: "GraphQL Subscriptions",
        tags: ["subscriptions", "real-time", "events"]
      },
      {
        type: "best-practice",
        front: "GraphQL best practices",
        back: "Design schema first, use fragments for reusability, implement proper error handling, optimize with DataLoader, validate queries",
        category: "GraphQL Best Practices",
        tags: ["best practices", "schema design", "optimization"]
      }
    ]
  },

  // Part 9: TypeScript
  part9: {
    name: "Part 9: TypeScript",
    description: "TypeScript fundamentals, type safety, and integration with React",
    color: "#1f77b4",
    cards: [
      {
        type: "definition",
        front: "What is TypeScript?",
        back: "Strongly typed programming language that builds on JavaScript by adding static type definitions",
        category: "TypeScript Basics",
        tags: ["TypeScript", "types", "JavaScript"]
      },
      {
        type: "concept",
        front: "What are the main benefits of TypeScript?",
        back: "Type safety, better IDE support, early error detection, improved refactoring, better documentation",
        category: "TypeScript Benefits",
        tags: ["benefits", "type safety", "IDE"]
      },
      {
        type: "code",
        front: "Define a TypeScript interface",
        back: "```typescript\ninterface User {\n  id: number\n  name: string\n  email?: string // optional property\n  isActive: boolean\n}\n```",
        category: "TypeScript Interfaces",
        tags: ["interface", "types", "optional"]
      },
      {
        type: "code",
        front: "Create a typed function in TypeScript",
        back: "```typescript\nfunction greetUser(user: User): string {\n  return `Hello, ${user.name}!`\n}\n\n// Arrow function version\nconst greetUser = (user: User): string => {\n  return `Hello, ${user.name}!`\n}\n```",
        category: "TypeScript Functions",
        tags: ["functions", "parameters", "return types"]
      },
      {
        type: "code",
        front: "Define a React component with TypeScript",
        back: "```tsx\ninterface Props {\n  name: string\n  age?: number\n}\n\nconst UserCard: React.FC<Props> = ({ name, age }) => {\n  return (\n    <div>\n      <h2>{name}</h2>\n      {age && <p>Age: {age}</p>}\n    </div>\n  )\n}\n```",
        category: "React TypeScript",
        tags: ["React", "Props", "FC"]
      },
      {
        type: "concept",
        front: "What are TypeScript generics?",
        back: "Way to create reusable components that work with multiple types while maintaining type safety",
        category: "TypeScript Generics",
        tags: ["generics", "reusable", "type safety"]
      },
      {
        type: "code",
        front: "Use TypeScript with useState hook",
        back: "```tsx\nconst [user, setUser] = useState<User | null>(null)\nconst [count, setCount] = useState<number>(0)\nconst [items, setItems] = useState<string[]>([])\n```",
        category: "React Hooks TypeScript",
        tags: ["useState", "generics", "hooks"]
      },
      {
        type: "concept",
        front: "What is type assertion in TypeScript?",
        back: "Way to tell TypeScript compiler about the type of a value when you know more than TypeScript does",
        category: "Type Assertion",
        tags: ["assertion", "casting", "compiler"]
      },
      {
        type: "best-practice",
        front: "TypeScript best practices",
        back: "Use strict mode, prefer interfaces over types, avoid 'any', use union types, enable strict null checks",
        category: "TypeScript Best Practices",
        tags: ["best practices", "strict mode", "any"]
      }
    ]
  },

  // Part 10: React Native
  part10: {
    name: "Part 10: React Native",
    description: "Mobile development with React Native, native components, and deployment",
    color: "#ff7f0e",
    cards: [
      {
        type: "definition",
        front: "What is React Native?",
        back: "Framework for building native mobile applications using React and JavaScript/TypeScript",
        category: "React Native Basics",
        tags: ["React Native", "mobile", "native"]
      },
      {
        type: "concept",
        front: "How does React Native work?",
        back: "Uses JavaScript bridge to communicate between JavaScript code and native platform APIs",
        category: "React Native Architecture",
        tags: ["bridge", "native", "JavaScript"]
      },
      {
        type: "code",
        front: "Create a basic React Native component",
        back: "```jsx\nimport React from 'react'\nimport { View, Text, StyleSheet } from 'react-native'\n\nconst App = () => {\n  return (\n    <View style={styles.container}>\n      <Text>Hello React Native!</Text>\n    </View>\n  )\n}\n\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    justifyContent: 'center',\n    alignItems: 'center'\n  }\n})\n```",
        category: "React Native Components",
        tags: ["View", "Text", "StyleSheet"]
      },
      {
        type: "concept",
        front: "What are the main differences between React and React Native?",
        back: "React Native uses native components (View, Text) instead of HTML elements, different styling approach, platform-specific APIs",
        category: "React vs React Native",
        tags: ["differences", "components", "styling"]
      },
      {
        type: "code",
        front: "Handle user input in React Native",
        back: "```jsx\nimport { TextInput, Button } from 'react-native'\n\nconst [text, setText] = useState('')\n\n<TextInput\n  value={text}\n  onChangeText={setText}\n  placeholder='Enter text'\n/>\n<Button title='Submit' onPress={() => console.log(text)} />\n```",
        category: "User Input",
        tags: ["TextInput", "Button", "onChangeText"]
      },
      {
        type: "concept",
        front: "What is Expo?",
        back: "Platform and set of tools for building React Native applications with additional APIs and easier deployment",
        category: "Expo",
        tags: ["Expo", "platform", "tools"]
      },
      {
        type: "concept",
        front: "What are the main React Native navigation libraries?",
        back: "React Navigation (most popular), React Native Navigation (Wix), Native Navigation",
        category: "Navigation",
        tags: ["React Navigation", "navigation", "routing"]
      },
      {
        type: "best-practice",
        front: "React Native performance best practices",
        back: "Use FlatList for large lists, optimize images, avoid heavy computations on main thread, use native drivers for animations",
        category: "Performance",
        tags: ["performance", "FlatList", "optimization"]
      }
    ]
  },

  // Part 11: CI/CD
  part11: {
    name: "Part 11: CI/CD",
    description: "Continuous Integration, Continuous Deployment, and DevOps practices",
    color: "#2ca02c",
    cards: [
      {
        type: "definition",
        front: "What is CI/CD?",
        back: "Continuous Integration/Continuous Deployment - Practices of automatically building, testing, and deploying code changes",
        category: "CI/CD Basics",
        tags: ["CI/CD", "automation", "deployment"]
      },
      {
        type: "concept",
        front: "What is Continuous Integration?",
        back: "Practice of merging code changes frequently, running automated tests to detect integration issues early",
        category: "Continuous Integration",
        tags: ["CI", "integration", "testing"]
      },
      {
        type: "concept",
        front: "What is Continuous Deployment?",
        back: "Practice of automatically deploying code changes to production after passing all tests and quality checks",
        category: "Continuous Deployment",
        tags: ["CD", "deployment", "automation"]
      },
      {
        type: "code",
        front: "Basic GitHub Actions workflow",
        back: "```yaml\nname: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - uses: actions/setup-node@v2\n        with:\n          node-version: '16'\n      - run: npm install\n      - run: npm test\n```",
        category: "GitHub Actions",
        tags: ["GitHub Actions", "workflow", "YAML"]
      },
      {
        type: "concept",
        front: "What is a deployment pipeline?",
        back: "Automated process that moves code from development through testing stages to production deployment",
        category: "Deployment Pipeline",
        tags: ["pipeline", "stages", "automation"]
      },
      {
        type: "concept",
        front: "What are deployment strategies?",
        back: "Blue-green (two identical environments), Rolling (gradual replacement), Canary (small percentage first)",
        category: "Deployment Strategies",
        tags: ["blue-green", "rolling", "canary"]
      },
      {
        type: "definition",
        front: "What is Docker?",
        back: "Platform for containerizing applications, packaging code with all dependencies for consistent deployment",
        category: "Docker",
        tags: ["Docker", "containers", "packaging"]
      },
      {
        type: "best-practice",
        front: "CI/CD best practices",
        back: "Small frequent commits, comprehensive tests, fast feedback, automated deployments, rollback capabilities, monitoring",
        category: "CI/CD Best Practices",
        tags: ["best practices", "automation", "monitoring"]
      }
    ]
  },

  // Part 12: Containers
  part12: {
    name: "Part 12: Containers",
    description: "Docker, containerization, orchestration, and microservices",
    color: "#d62728",
    cards: [
      {
        type: "definition",
        front: "What is containerization?",
        back: "Packaging applications with all dependencies into portable, isolated containers that run consistently across environments",
        category: "Containerization",
        tags: ["containers", "packaging", "isolation"]
      },
      {
        type: "code",
        front: "Create a basic Dockerfile",
        back: "```dockerfile\nFROM node:16\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n```",
        category: "Docker",
        tags: ["Dockerfile", "FROM", "WORKDIR", "COPY"]
      },
      {
        type: "code",
        front: "Build and run a Docker container",
        back: "```bash\n# Build image\ndocker build -t my-app .\n\n# Run container\ndocker run -p 3000:3000 my-app\n```",
        category: "Docker Commands",
        tags: ["docker build", "docker run", "ports"]
      },
      {
        type: "concept",
        front: "What is Docker Compose?",
        back: "Tool for defining and running multi-container Docker applications using YAML configuration",
        category: "Docker Compose",
        tags: ["Docker Compose", "multi-container", "YAML"]
      },
      {
        type: "code",
        front: "Basic docker-compose.yml",
        back: "```yaml\nversion: '3.8'\nservices:\n  app:\n    build: .\n    ports:\n      - '3000:3000'\n  db:\n    image: postgres:13\n    environment:\n      POSTGRES_PASSWORD: password\n```",
        category: "Docker Compose",
        tags: ["docker-compose", "services", "environment"]
      },
      {
        type: "concept",
        front: "What are the benefits of containers?",
        back: "Consistency across environments, isolation, scalability, resource efficiency, easier deployment and testing",
        category: "Container Benefits",
        tags: ["benefits", "consistency", "scalability"]
      },
      {
        type: "concept",
        front: "What is Kubernetes?",
        back: "Container orchestration platform for automating deployment, scaling, and management of containerized applications",
        category: "Kubernetes",
        tags: ["Kubernetes", "orchestration", "scaling"]
      },
      {
        type: "best-practice",
        front: "Container best practices",
        back: "Use official base images, minimize image size, don't store secrets in images, use multi-stage builds, health checks",
        category: "Container Best Practices",
        tags: ["best practices", "security", "optimization"]
      }
    ]
  },

  // Part 13: Using relational databases
  part13: {
    name: "Part 13: Using Relational Databases",
    description: "SQL, database design, migrations, and ORM usage",
    color: "#9467bd",
    cards: [
      {
        type: "definition",
        front: "What is a relational database?",
        back: "Database that stores data in tables with rows and columns, using relationships between tables via foreign keys",
        category: "Database Basics",
        tags: ["relational", "tables", "relationships"]
      },
      {
        type: "concept",
        front: "What is SQL?",
        back: "Structured Query Language - Standard language for managing and querying relational databases",
        category: "SQL",
        tags: ["SQL", "query", "standard"]
      },
      {
        type: "code",
        front: "Basic SQL SELECT query",
        back: "```sql\nSELECT name, email \nFROM users \nWHERE age > 18 \nORDER BY name ASC;\n```",
        category: "SQL Queries",
        tags: ["SELECT", "WHERE", "ORDER BY"]
      },
      {
        type: "code",
        front: "SQL JOIN query",
        back: "```sql\nSELECT u.name, p.title\nFROM users u\nINNER JOIN posts p ON u.id = p.user_id\nWHERE u.active = true;\n```",
        category: "SQL Joins",
        tags: ["JOIN", "INNER JOIN", "relationship"]
      },
      {
        type: "definition",
        front: "What is an ORM?",
        back: "Object-Relational Mapping - Tool that lets you query and manipulate data using object-oriented paradigm",
        category: "ORM",
        tags: ["ORM", "object-oriented", "mapping"]
      },
      {
        type: "code",
        front: "Sequelize model definition",
        back: "```javascript\nconst User = sequelize.define('User', {\n  name: {\n    type: DataTypes.STRING,\n    allowNull: false\n  },\n  email: {\n    type: DataTypes.STRING,\n    unique: true\n  }\n})\n```",
        category: "Sequelize",
        tags: ["Sequelize", "model", "DataTypes"]
      },
      {
        type: "concept",
        front: "What are database migrations?",
        back: "Scripts that modify database schema over time, allowing version control of database structure changes",
        category: "Migrations",
        tags: ["migrations", "schema", "version control"]
      },
      {
        type: "concept",
        front: "What is database normalization?",
        back: "Process of organizing data to reduce redundancy and improve data integrity by dividing into related tables",
        category: "Normalization",
        tags: ["normalization", "redundancy", "integrity"]
      },
      {
        type: "best-practice",
        front: "Database design best practices",
        back: "Use appropriate data types, create indexes for frequent queries, normalize to reduce redundancy, backup regularly",
        category: "Database Best Practices",
        tags: ["best practices", "indexes", "backup"]
      }
    ]
  }
};

// Utility: very small cloze generator for definition/concept cards.
// It finds the first important noun-like token (heuristic) and creates a cloze deletion.
function generateClozeCardsForPart(part) {
  const additional = [];
  for (const card of part.cards) {
    // Ensure hints array exists
    if (!card.hints) card.hints = [];
    if (card.hints.length === 0) {
      // Provide a simple contextual hint based on category
      card.hints.push(`Category: ${card.category}`);
      card.hints.push('Try to recall the core term or concept.');
    }

    // Generate cloze for definitions and concepts
    if ((card.type === 'definition' || card.type === 'concept') && typeof card.back === 'string') {
      // Heuristic: pick the first phrase before a dash or colon or the first 3 words as answer
      const back = card.back.replace(/\s+/g, ' ').trim();
      let answer = null;
      // Try to extract phrase before dash or parentheses
      const dashMatch = back.match(/^([^:\-\(]+)[\-:\(]/);
      if (dashMatch) answer = dashMatch[1].trim();
      if (!answer) {
        const words = back.split(' ');
        answer = words.slice(0, Math.min(3, words.length)).join(' ');
      }

      // avoid trivial answers
      if (answer && answer.length > 3 && back.toLowerCase().includes(answer.toLowerCase())) {
        const clozeFront = card.front + '\n\nFill the blank: ';
        const clozeBack = back.replace(new RegExp(answer, 'i'), `{{c1::${answer}}}`);
        additional.push({
          type: 'cloze',
          front: clozeFront,
          back: clozeBack,
          category: card.category,
          tags: (card.tags || []).concat(['cloze','auto-generated']),
          difficulty: card.difficulty || 'intermediate',
          hints: card.hints.slice(0,2)
        });
      }
    }

    // For code cards, add reverse Q/A: question asking what the code does if not already present
    if (card.type === 'code' && typeof card.front === 'string' && typeof card.back === 'string') {
      // If back is short (explanation), create an exercise card asking to write what it does
      if (card.back.length < 200) {
        additional.push({
          type: 'exercise',
          front: `Describe what this code does or write equivalent code:\n\n${card.front}`,
          back: card.back,
          category: card.category,
          tags: (card.tags || []).concat(['exercise','reverse','code']),
          difficulty: card.difficulty || 'intermediate',
          hints: card.hints.slice(0,2)
        });
      }
    }
  }

  // append generated cards to the part (non-destructive)
  if (additional.length > 0) part.cards.push(...additional);
}

// Run augmentation for all parts at module load time so downstream createFullStackOpenDecks uses enriched cards
for (const part of Object.values(FULLSTACK_OPEN_CONTENT)) {
  try { generateClozeCardsForPart(part); } catch (e) { console.error('Cloze generation error for part', part.name, e); }
}

export async function createFullStackOpenDecks() {
  const createdDecks = [];
  const createdCards = [];
  // Load existing decks/cards to make this operation idempotent
  const existingDecks = getAllDecks() || [];
  const existingDeckNames = new Set(existingDecks.map(d => d.name));

  for (const [partKey, partData] of Object.entries(FULLSTACK_OPEN_CONTENT)) {
    // If a deck with the same name already exists, skip creation to avoid duplicates
    if (existingDeckNames.has(partData.name)) {
      // find the existing deck and include it in the returned list
      const existing = existingDecks.find(d => d.name === partData.name);
      if (existing) createdDecks.push(existing);
      // do not attempt to recreate cards for an existing deck
      continue;
    }

    // Create deck for this part
    const deck = await createDeck({
      name: partData.name,
      description: partData.description,
      category: "Full Stack Open",
      color: partData.color,
      tags: ["fullstack", "course", partKey],
      difficulty: "intermediate",
      estimatedTime: 30,
      isOfficial: true
    });

    createdDecks.push(deck);

    // Create cards for this deck (persist generated hints and related cards when available)
    for (const cardData of partData.cards) {
      const card = await createCard({
        deckId: deck.id,
        type: cardData.type,
        front: cardData.front,
        back: cardData.back,
        category: cardData.category,
        tags: cardData.tags,
        difficulty: cardData.difficulty || "intermediate",
        hints: Array.isArray(cardData.hints) ? cardData.hints : [],
        relatedCards: Array.isArray(cardData.relatedCards) ? cardData.relatedCards : []
      });

      createdCards.push(card);
    }
  }

  return {
    decks: createdDecks,
    cards: createdCards,
    message: `Created ${createdDecks.length} decks with ${createdCards.length} cards`
  };
}

export { FULLSTACK_OPEN_CONTENT };