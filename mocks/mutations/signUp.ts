import { UserFactory } from "../../data/users";
import { graphql } from 'msw';

export const signUp = 
  graphql.mutation('signUp', (req, res, ctx) => {
    const { data } = req.variables;
    if(!data){
      return res(ctx.errors([
        {
          message: 'Invalid data'
        }
      ]));
    }
    const {email, name, password, username} = data;
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
        signUp: {
          message: 'Check your e-mail for validation'
        },
      }),
    );
    
  });