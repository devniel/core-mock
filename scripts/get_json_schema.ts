import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { loadSchemaSync } from '@graphql-tools/load'
import {
  getIntrospectionQuery,
  graphqlSync,
  IntrospectionQuery
} from 'graphql';
import { fromIntrospectionQuery } from 'graphql-2-json-schema';

// schema is your GraphQL schema.
const schema = readFileSync(path.resolve(__dirname, '../schema.gql'), 'utf-8');
const introspection = graphqlSync(loadSchemaSync(schema, null), getIntrospectionQuery()).data as IntrospectionQuery;
const result = fromIntrospectionQuery(introspection);
console.log('result:', result);
writeFileSync('./schema.json', JSON.stringify(result, null, '\t'));