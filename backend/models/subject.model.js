import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true
  },
  subjectSem: {
    type: Number,
    required: true
  },
  totalClasses: {
    type: Number,
    default: 0
  },
  taughtBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: false
  }
}, { timestamps: true 
  
});

subjectSchema.methods.increaseTotalClasses = function() {
  this.totalClasses += 1;
  return this.save();
};

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
