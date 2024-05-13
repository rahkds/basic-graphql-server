const express = require('express');
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const cors = require('cors');
const axios = require('axios');

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `

            type User {
                id : ID!
                name: String!
                username: String!
                phone : String!
                website: String!
                email: String!
            }

            type Todo {
                id: ID!,
                title: String!,
                completed: Boolean
                userId: ID!
                user: User
            }
            
            type Query {
                getTodos: [Todo]
                getAllUsers: [User]
                getUser(id: ID!): User
            }
        `,
        resolvers: {
            Todo: {
                user: async(todo) => {
                    return (await axios.get('https://jsonplaceholder.typicode.com/users/'+todo.userId)).data
                }
            },

            Query : {
                getTodos : async () => {
                    return (await axios.get('https://jsonplaceholder.typicode.com/todos')).data
                },
                getAllUsers: async() => {
                    return (await axios.get('https://jsonplaceholder.typicode.com/users')).data
                },

                getUser: async(parent, {id}) => {
                    return (await axios.get('https://jsonplaceholder.typicode.com/users/'+id)).data
                }                
            }
        }
    });
    app.use(express.json());
    app.use(cors());

    await server.start();

    app.use('/graphql', expressMiddleware(server));

    app.get('/ping', (req,res)=> res.send("pong"));

    app.listen(8000, ()=> {
        console.log("server connnected at ", 8000);
    })
}

startServer();