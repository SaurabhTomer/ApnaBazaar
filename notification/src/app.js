import express from 'express'
import { connect } from './broker/broker.js';

const app = express();

connect();

app.get('/' , (req , res) => {
    res.send('running fine')
})

export default app;