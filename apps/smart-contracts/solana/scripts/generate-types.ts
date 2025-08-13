import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to generate TypeScript types from the Anchor IDL
 * This helps with type safety when interacting with the program
 */
async function generateTypes() {
  try {
    console.log('Generating TypeScript types from IDL...');

    // Check if IDL file exists
    const idlPath = path.join(__dirname, '../target/idl/todo_program.json');
    if (!fs.existsSync(idlPath)) {
      console.error('IDL file not found. Please build the program first with "anchor build"');
      process.exit(1);
    }

    // Read IDL file
    const idlContent = fs.readFileSync(idlPath, 'utf-8');
    const idl = JSON.parse(idlContent);

    // Create types directory if it doesn't exist
    const typesDir = path.join(__dirname, '../types');
    if (!fs.existsSync(typesDir)) {
      fs.mkdirSync(typesDir, { recursive: true });
    }

    // Generate TypeScript interface
    const typesContent = `
/**
 * This file is auto-generated from the Anchor IDL.
 * Do not modify this file manually.
 */
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type TodoProgram = {
  version: "${idl.version}";
  name: "${idl.name}";
  instructions: [
${idl.instructions
  .map(
    instruction => `    {
      name: "${instruction.name}";
      accounts: [
${instruction.accounts
  .map(
    account => `        {
          name: "${account.name}";
          isMut: ${account.isMut};
          isSigner: ${account.isSigner};
        }`,
  )
  .join(',\n')}
      ];
      args: [
${(instruction.args || [])
  .map(
    arg => `        {
          name: "${arg.name}";
          type: ${JSON.stringify(arg.type)};
        }`,
  )
  .join(',\n')}
      ];
    }`,
  )
  .join(',\n')}
  ];
  accounts: [
${idl.accounts
  .map(
    account => `    {
      name: "${account.name}";
      type: {
        kind: "${account.type.kind}";
        fields: [
${account.type.fields
  .map(
    field => `          {
            name: "${field.name}";
            type: ${JSON.stringify(field.type)};
          }`,
  )
  .join(',\n')}
        ];
      };
    }`,
  )
  .join(',\n')}
  ];
  types: [
${(idl.types || [])
  .map(
    type => `    {
      name: "${type.name}";
      type: {
        kind: "${type.type.kind}";
        fields: [
${(type.type.fields || [])
  .map(
    field => `          {
            name: "${field.name}";
            type: ${JSON.stringify(field.type)};
          }`,
  )
  .join(',\n')}
        ];
      };
    }`,
  )
  .join(',\n')}
  ];
  errors: [
${(idl.errors || [])
  .map(
    error => `    {
      code: ${error.code};
      name: "${error.name}";
      msg: "${error.msg}";
    }`,
  )
  .join(',\n')}
  ];
};

export interface Todo {
  id: anchor.BN;
  title: string;
  description: string;
  completed: boolean;
  priority: { low: {} } | { medium: {} } | { high: {} };
  createdAt: anchor.BN;
  updatedAt: anchor.BN;
  completedAt: anchor.BN | null;
}

export interface TodoList {
  owner: PublicKey;
  todos: Todo[];
  nextId: anchor.BN;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
}

export const IDL: TodoProgram = ${JSON.stringify(idl, null, 2)};
`;

    // Write types file
    const typesPath = path.join(typesDir, 'todo_program.ts');
    fs.writeFileSync(typesPath, typesContent);

    console.log(`TypeScript types generated successfully at ${typesPath}`);
  } catch (error) {
    console.error('Error generating types:', error);
    process.exit(1);
  }
}

generateTypes().catch(console.error);
