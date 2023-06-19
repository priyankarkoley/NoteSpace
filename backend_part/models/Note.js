import { Schema, model } from 'mongoose';

const noteSchema = new Schema({
    usertoken:{
        type: Schema.Types.ObjectId,
        ref:'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: 'regular'
    },
    date:{
        type: Date,
        default: Date.now
    }
})

export default model('notes', noteSchema);