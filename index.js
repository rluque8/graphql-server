import { ApolloServer, UserInputError, gql } from "apollo-server";
import { v4 as uuid } from "uuid";

const people = [
  {
    name: "Rodrigo",
    phone: "34612938415",
    street: "Calle test",
    city: "Madrid",
    age: 18,
    id: "be194692-76c5-4d59-8bba-cc37836fdfe7",
  },
  {
    name: "Pepe",
    phone: "34612938222",
    street: "Calle test 2",
    city: "Valencia",
    age: 17,
    id: "49f506e6-182a-4d6e-811d-aa4d75209443",
  },
  {
    name: "Lucas",
    street: "Calle test 3",
    city: "Barcelona",
    age: 23,
    id: "4baeca87-e0a4-4312-89b8-bab9eb9507bc",
  },
];

const typeDefs = gql(`
  enum HasValue {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    check: String!
    canDrink: Boolean!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPeople(phone: HasValue): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(
      name: String!
      phone: String!
    ): Person
  }
`);

const resolvers = {
  Query: {
    personCount: () => people.length,
    allPeople: (root, args) => {
      const { phone } = args;
      if (!phone) {
        return people;
      }
      return people.filter((person) =>
        phone === "YES" ? person.phone : !person.phone
      );
    },
    findPerson: (root, args) => {
      const { name } = args;
      return people.find((person) => person.name === name);
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      const { name } = args;
      if (people.find((person) => person.name === name)) {
        throw new UserInputError("Duplicated person", {
          invalidArgs: name,
        });
      }
      const person = { ...args, id: uuid() };
      people.push(person);
      return person;
    },
    editNumber: (root, args) => {
      const personIndex = people.findIndex(
        (person) => person.name === args.name
      );
      if (personIndex === -1) {
        return null;
      }
      const person = people[personIndex];

      const updatedPerson = { ...person, phone: args.phone };
      people[personIndex] = updatedPerson;
      return updatedPerson;
    },
  },
  Person: {
    address: (root) => {
      return { street: root.street, city: root.city };
    },
    check: () => "test",
    canDrink: (root) => root.age > 18,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

try {
  const { url } = await server.listen();
  console.log(`Server listening in ${url}`);
} catch (error) {
  console.log(`Server error: ${error}`);
}
