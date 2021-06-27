import app from '../../mocks/server';
import supertest from 'supertest';
import gql from 'graphql-tag';
import { print } from 'graphql';
import http from 'http';
import Ajv from 'ajv';

var ajv = new Ajv({ logger: console, allErrors: true });
var schema = {
    "type":"object",
    "required": [
      "signIn"
    ],
    "properties": {
      "signIn": {
        "type": "object",
        "required": [
          "user",
          "access_token"
        ],
        "properties": {
          "user": {
            "type": "object",
            "required":[
              "active",
              "email",
              "id",
              "name",
              "username",
              "verified_email"
            ],
            "properties":{
                "active": {
                    "type": "boolean"
                },
                "email": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                },
                "verified_email": {
                    "type": "boolean"
                }
            }
          },
          "access_token": {
            "type": "string"
          }
        }
      }
    }
};

describe('signIn', () => {

  let request:  supertest.SuperTest<supertest.Test>;
  let server: http.Server;

  beforeAll((done) => {
    server = app.listen(done);
    request = supertest.agent(server);
  });

  it('success', (done) => {
    const query = gql`
      mutation signIn ($password: String!, $username: String!) {
        signIn (password: $password, username: $username) {
          access_token
          user {
            active
            email
            id
            name
            username
            verified_email
          }
        }
      }
    `;
    const res =  request
    .post('/graphql')
    .send({
      query: print(query),
      variables: {
        "password": "password",
        "username": "username"
      }
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      expect(ajv.validate(schema, res.body.data)).toBeTruthy();
      done();
    });
  });

  it('fail', (done) => {
    const query = gql`
      mutation signIn ($password: String!, $username: String!) {
        signIn (password: $password, username: $username) {
          access_token
          user {
            active
            email
            id
            name
            username
            verified_email
          }
        }
      }
    `;
    const res =  request
    .post('/graphql')
    .send({
      query: print(query),
      variables: {
        "password": "password",
        "username": "username"
      }
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      expect(ajv.validate(schema, res.body.data)).toBeTruthy();
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  })
});