import { FULLSTACK_OPEN_CONTENT } from './fullstack-open-content.mjs';

// Extra exercise/summary cards to fill gaps compared to external repo
const EXTRAS = {
  part1: [
    {
      type: 'definition',
      front: 'What is Unicafe (exercise)?',
      back: 'Simple React app for submitting feedback and calculating averages (exercise from FSO part 1)',
      category: 'Exercises',
      tags: ['unicafe','exercise','react'],
      hints: ['Focus on state for counters','Derived values: average and positive %']
    },
    {
      type: 'definition',
      front: 'What is the Anecdotes exercise?',
      back: 'Small React app to display, vote and create anecdotes; practice routing and state management',
      category: 'Exercises',
      tags: ['anecdotes','exercise','react'],
      hints: ['Use state for anecdotes list','Consider routing for detail view']
    }
  ],
  part2: [
    {
      type: 'definition',
      front: 'What is the Countries exercise?',
      back: 'A React app that fetches country data from a REST API and filters/searches results (FSO part 2/7 variants)',
      category: 'Exercises',
      tags: ['countries','exercise','REST'],
      hints: ['Use axios/fetch to query API','Debounce search input for UX']
    },
    {
      type: 'definition',
      front: 'What is Courseinfo (exercise)?',
      back: 'Small React app to display course parts and exercises; practice props and component structure',
      category: 'Exercises',
      tags: ['courseinfo','exercise','react'],
      hints: ['Structure components for parts and exercises','Pass data via props']
    }
  ],
  part3: [
    {
      type: 'definition',
      front: 'What is the Phonebook project?',
      back: "Full-stack phonebook app: React frontend + Node/Express backend (FSO part 3); includes CRUD operations and deployment",
      category: 'Exercises',
      tags: ['phonebook','exercise','express','deployment'],
      hints: ['Implement REST endpoints','Validate input and handle errors']
    },
    {
      type: 'exercise',
      front: 'Implement backend endpoints for phonebook: GET /api/persons, POST /api/persons, DELETE /api/persons/:id',
      back: 'Server should validate data, handle errors and persist to a database (or in-memory for exercises).',
      category: 'Exercises',
      tags: ['phonebook','express','api'],
      hints: ['Use express.json() middleware','Structure routes with a router']
    }
  ],
  part7: [
    {
      type: 'definition',
      front: 'What is the Bloglist project?',
      back: 'A full-stack blog application allowing users to create, like and comment posts; often implemented with Node/Express backend and React frontend (FSO part 7)',
      category: 'Exercises',
      tags: ['bloglist','exercise','fullstack'],
      hints: ['Design API for blogs','Protect write endpoints with auth']
    },
    {
      type: 'exercise',
      front: 'Design the Bloglist API endpoints and frontend components needed to list, create and like blogs',
      back: 'Backend needs CRUD endpoints; frontend needs pages for blog listing, blog detail, login and creating posts.',
      category: 'Exercises',
      tags: ['bloglist','api','design'],
      hints: ['Use token-based auth for protected actions','Sort blogs by likes in UI']
    }
  ],
  part8: [
    {
      type: 'definition',
      front: 'What is the Library exercise (GraphQL)?',
      back: 'Full application with a library backend and frontend, showcasing queries/mutations and relationships; used as a GraphQL example in FSO part 8',
      category: 'Exercises',
      tags: ['library','graphql','exercise'],
      hints: ['Define schema types and resolvers','Use Apollo Client for frontend queries']
    }
  ],
  part9: [
    {
      type: 'definition',
      front: 'What is Patientor (exercise)?',
      back: 'Healthcare application with TypeScript backend demonstrating type-safe APIs and complex domain modeling (FSO part 9)',
      category: 'Exercises',
      tags: ['patientor','typescript','exercise'],
      hints: ['Model domain types carefully','Use strict TypeScript compiler options']
    },
    {
      type: 'definition',
      front: 'What is Flight Diary?',
      back: 'Full-stack application for logging flights and notes; often used as a part 9 exercise involving TypeScript',
      category: 'Exercises',
      tags: ['flight-diary','exercise','typescript'],
      hints: ['Design API and models','Use TypeScript types for request/response']
    },
    {
      type: 'definition',
      front: 'What is the HealthApp exercise?',
      back: 'Application demonstrating APIs and frontend integrations for health data; includes authentication and structured data',
      category: 'Exercises',
      tags: ['healthApp','exercise','fullstack'],
      hints: ['Consider privacy and data validation','Use secure auth patterns']
    }
  ]
};

export function mergeExtras() {
  for (const [partKey, cards] of Object.entries(EXTRAS)) {
    if (FULLSTACK_OPEN_CONTENT[partKey] && Array.isArray(FULLSTACK_OPEN_CONTENT[partKey].cards)) {
      for (const c of cards) {
        // ensure hints array exists
        if (!c.hints) c.hints = [];
        FULLSTACK_OPEN_CONTENT[partKey].cards.push(c);
      }
    }
  }
  return { merged: true };
}
