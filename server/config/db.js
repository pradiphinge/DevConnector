import mongoose from 'mongoose';
import config from 'config';

const db = config.get('MONGO_URI')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(db, {
            
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify:false
            
        });
        console.log(`Mongo DB Connected :${conn.connection.host}`);

    } catch (error) {
        console.log('error connecting db :', error);
        process.exit(1);
    }
}

export default connectDB;
