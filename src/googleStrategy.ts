import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from  './models/user'
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
  
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: 'http://localhost:8989/api/authgoogle/google/callback',
},

async (accessToken, refreshToken, profile, done) => {
  try {
     
    console.log(accessToken)
    const email = profile.emails && profile.emails[0].value;
    if (!email) {

      return done(null, false, { message: 'No email associated with this account' });
    }

    let user = await UserModel.findOne({ email });
  
    if (!user) {
     
      return done(null, false, { message: 'No user with this email' });
    }
   

    
    return done(null, user);
  
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  
  done(null, (user as any)._id);
   
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
   
    done(null, user);
   
  } catch (error) {
    done(error);
  }
});
