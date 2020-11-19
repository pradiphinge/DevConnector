import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      likes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId
          }
        }
      ],
      comments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId
          },
          text: {
            type: String,
            required: true
          },
          name: {
            type: String
          },
          avatar: {
            type: String
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
      ],
      date: {
        type: Date,
        default: Date.now
      }
})

const Post = mongoose.model('Post', postSchema)
export default Post; 