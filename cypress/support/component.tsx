// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
// Alternatively you can use CommonJS syntax:
// require('./commands')
import "@/styles/globals.css";

import { DM_Sans, Libre_Baskerville } from "@next/font/google";
import { mount } from "cypress/react18";

const dmsans = DM_Sans({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-sans",
});
const libre = Libre_Baskerville({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-libre",
});

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add("mount", (component, options) => {
  const wrapped = (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${dmsans.style.fontFamily};
            --font-libre: ${libre.style.fontFamily};
          }
        `}
      </style>
      {component}
    </>
  );
  return mount(wrapped, options);
});

// Example use:
// cy.mount(<MyComponent />)
