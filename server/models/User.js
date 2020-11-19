import mongoose from 'mongoose';

const userSchema =  mongoose.Schema({
    name: {
        type: String,
        required:true
    }   , 
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max:20
    },
    avatar: {
        type:String
    },
    date:{
        type: Date,
        default:Date.now
    }
})

const User = mongoose.model('User', userSchema);

export default User;