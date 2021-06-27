import { graphql } from 'msw';
import { UserFactory } from '../data/users';
import { signIn } from './mutations/signIn';
import { signUp } from './mutations/signUp';
 
export const handlers = [
  signIn,
  signUp
]