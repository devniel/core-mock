import app from "../../mocks/server";
import supertest from "supertest";
import gql from "graphql-tag";
import { print } from "graphql";
import http from "http";
import Ajv, { JSONSchemaType } from "ajv";

interface SignupData {
  message: string;
}

interface SignupError {
  message: string;
}

interface SignUpResponse {
  data?: SignupData;
  errors?: SignupError[];
}

const SignupErrorSchema = {
  $id: "http://devniel.com/schemas/SignupErrorSchema.json",
  type: "object",
  properties: {
    message: {
      type: "string",
    },
  },
  required: ["message"],
};

const SignupDataSchema = {
  $id: "http://devniel.com/schemas/SignupDataSchema.json",
  type: "object",
  properties: {
    message: {
      type: "string",
    },
  },
  required: ["message"],
};

const SignupResponseSchema: JSONSchemaType<SignUpResponse> = {
  $id: "http://devniel.com/schemas/SignupResponseSchema.json",
  type: "object",
  properties: {
    data: {
      type: "object",
      $ref: "SignupDataSchema.json",
      nullable: true,
    },
    errors: {
      type: "array",
      items: {
        type: "object",
        $ref: "SignupErrorSchema.json",
        required: [],
      },
      nullable: true,
    },
  },
  required: [],
};

const ajv = new Ajv({
  schemas: [SignupErrorSchema, SignupDataSchema, SignupResponseSchema],
  logger: console,
  allErrors: true,
});

describe("signUp", () => {
  let request: supertest.SuperTest<supertest.Test>;
  let server: http.Server;

  beforeAll((done) => {
    server = app.listen(done);
    request = supertest.agent(server);
  });

  it("success", (done) => {
    const query = gql`
      mutation signUp($data: SignupInput!) {
        signUp(data: $data) {
          message
        }
      }
    `;
    const res = request
      .post("/graphql")
      .send({
        query: print(query),
        variables: {
          data: {
            email: "test@gmail.com",
            name: "name",
            password: "password",
            username: "username",
          },
        },
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(ajv.validate(SignupResponseSchema, res.body.data)).toBeTruthy();
        done();
      });
  });

  it("fail", (done) => {
    const query = gql`
      mutation signUp($data: SignupInput!) {
        signUp(data: $data) {
          message
        }
      }
    `;
    const res = request
      .post("/graphql")
      .send({
        query: print(query),
        variables: {
          data: {
            email: "test@gmail.com",
            name: "name",
            password: "",
            username: "username",
          },
        },
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(ajv.validate(SignupResponseSchema, res.body)).toBeTruthy();
        expect(
          ajv.validate(SignupErrorSchema, res.body.errors[0])
        ).toBeTruthy();
        done();
      });
  });

  afterAll((done) => {
    server.close(done);
  });
});
