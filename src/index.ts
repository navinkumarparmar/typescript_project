import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import routes from './routes/index';
import connectDB from './connectDB';


import session from 'express-session'
import path from 'path';
// import './config/googleStrategy'; 

import notFoundHandler from '../src/errors/notFoundHandler';
import setupSwagger from './swagger'
const app = express();
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
const PORT = 8080;
connectDB();
app.use(bodyParser.json());
app.use('/',(req,res)=>{
    res.send("api working is good")
})
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api', routes);



setupSwagger(app);
app.use(notFoundHandler)


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


