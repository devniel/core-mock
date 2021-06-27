import { UserFactory } from "../../data/users";
import { graphql } from 'msw';

export const signIn = 
  graphql.mutation('signIn', (req, res, ctx) => {
    const { username, password } = req.variables
    // Error - bad password
    if(password === 'bad_password'){
      return res(ctx.errors([
        {
          message: 'Bad password'
        }
      ]));
    }
    // Error - empty password
    if(password === '') {
      return res(ctx.errors([
        {
          message: 'Empty password'
        }
      ]));
    }
    // Success
    //sessionStorage.setItem('is-authenticated', username)
    return res(
      ctx.data({
        signIn: {
          user: UserFactory.create(),
          access_token: 'token'
        },
      }),
    );
    
  });