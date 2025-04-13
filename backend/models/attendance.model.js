import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    batch: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    students: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        present: {
            type: Boolean,
            default: true
        },
    }],
    totalPresent: {
        type: Number,
        default: 0
    },
    totalAbsent: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to calculate total present and absent
attendanceSchema.pre('save', function (next) {
    this.totalPresent = this.students.filter(student => student.present).length;
    this.totalAbsent = this.students.length - this.totalPresent;
    next();
});

// Safe model export (avoids overwrite error during hot reloads)
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

// Change this line from CommonJS to ES modules syntax
export default Attendance;